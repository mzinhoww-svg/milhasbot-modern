import 'server-only';

/**
 * Cliente da Amadeus Self-Service API.
 *
 * As credenciais são lidas do ambiente e nunca saem do servidor — todo acesso
 * passa pelas rotas em app/api/rotas/*.
 *
 * Ambiente de teste (padrão): test.api.amadeus.com, cota mensal limitada e
 * malha reduzida. Produção: api.amadeus.com. Controle por AMADEUS_HOSTNAME.
 */

const TOKEN_PATH = '/v1/security/oauth2/token';

/** Margem de segurança para não usar um token que expira no meio da chamada. */
const MARGEM_EXPIRACAO_MS = 30_000;

export class AmadeusError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detalhe?: unknown,
  ) {
    super(message);
    this.name = 'AmadeusError';
  }
}

/** Credenciais ausentes é uma condição de configuração, não uma falha de rede. */
export class AmadeusNaoConfigurado extends Error {
  constructor() {
    super(
      'Amadeus não configurado: defina AMADEUS_CLIENT_ID e AMADEUS_CLIENT_SECRET.',
    );
    this.name = 'AmadeusNaoConfigurado';
  }
}

export function amadeusConfigurado(): boolean {
  return Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET);
}

function baseUrl(): string {
  const host = process.env.AMADEUS_HOSTNAME ?? 'test';
  return host === 'production' ? 'https://api.amadeus.com' : 'https://test.api.amadeus.com';
}

export function ambienteAmadeus(): 'test' | 'production' {
  return process.env.AMADEUS_HOSTNAME === 'production' ? 'production' : 'test';
}

interface TokenEmCache {
  valor: string;
  expiraEm: number;
}

// O token vale ~30 minutos. Guardar em módulo evita gastar uma chamada de
// autenticação a cada consulta — a cota do plano gratuito é curta.
let tokenAtual: TokenEmCache | null = null;
let tokenEmVoo: Promise<string> | null = null;

async function buscarToken(): Promise<string> {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new AmadeusNaoConfigurado();

  const resposta = await fetch(`${baseUrl()}${TOKEN_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: 'no-store',
  });

  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    // A mensagem da Amadeus para credencial errada é clara; vale repassar.
    const descricao =
      (corpo as { error_description?: string } | null)?.error_description ??
      `HTTP ${resposta.status}`;
    throw new AmadeusError(`Falha ao autenticar na Amadeus: ${descricao}`, resposta.status, corpo);
  }

  const { access_token: accessToken, expires_in: expiresIn } = corpo as {
    access_token: string;
    expires_in: number;
  };

  tokenAtual = {
    valor: accessToken,
    expiraEm: Date.now() + expiresIn * 1000 - MARGEM_EXPIRACAO_MS,
  };

  return accessToken;
}

async function token(): Promise<string> {
  if (tokenAtual && Date.now() < tokenAtual.expiraEm) return tokenAtual.valor;

  // Várias requisições simultâneas com o token vencido devem renovar uma vez só.
  if (!tokenEmVoo) {
    tokenEmVoo = buscarToken().finally(() => {
      tokenEmVoo = null;
    });
  }

  return tokenEmVoo;
}

export interface OpcoesConsulta {
  /** Segundos de cache no data cache do Next. */
  revalidate: number;
}

/**
 * GET autenticado na Amadeus, com cache no servidor.
 *
 * O cache não é luxo: o plano gratuito tem cota mensal baixa, e sem ele uma
 * única tela de busca já a consumiria.
 */
export async function amadeusGet<T>(
  caminho: string,
  parametros: Record<string, string | number | undefined>,
  opcoes: OpcoesConsulta,
): Promise<T> {
  const query = new URLSearchParams();
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== '') query.set(chave, String(valor));
  }

  const url = `${baseUrl()}${caminho}?${query}`;
  const resposta = await fetch(url, {
    headers: { Authorization: `Bearer ${await token()}` },
    next: { revalidate: opcoes.revalidate },
  });

  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const erros = (corpo as { errors?: { detail?: string; title?: string }[] } | null)?.errors;
    const detalhe = erros?.[0]?.detail ?? erros?.[0]?.title ?? `HTTP ${resposta.status}`;

    // 401 no meio da sessão significa token revogado; descarta para a próxima
    // chamada renovar em vez de repetir o erro indefinidamente.
    if (resposta.status === 401) tokenAtual = null;

    throw new AmadeusError(detalhe, resposta.status, corpo);
  }

  return corpo as T;
}
