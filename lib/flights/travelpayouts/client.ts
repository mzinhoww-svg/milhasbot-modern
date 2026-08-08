import 'server-only';

/**
 * Cliente da Data API do Travelpayouts (Aviasales).
 *
 * Substitui a Amadeus, cujo portal self-service foi descontinuado em jul/2026.
 * O Travelpayouts é rede de afiliados: além de dados reais de preço e horário,
 * cada link de reserva pode carregar o `marker` do parceiro e gerar comissão.
 *
 * O token nunca sai do servidor — todo acesso passa por app/api/rotas/*.
 */

const BASE = 'https://api.travelpayouts.com';

/** Host das reservas; o `link` da API vem como caminho relativo daqui. */
const HOST_RESERVA = 'https://www.aviasales.com';

export class TravelpayoutsError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detalhe?: unknown,
  ) {
    super(message);
    this.name = 'TravelpayoutsError';
  }
}

export class TravelpayoutsNaoConfigurado extends Error {
  constructor() {
    super('Travelpayouts não configurado: defina TRAVELPAYOUTS_TOKEN.');
    this.name = 'TravelpayoutsNaoConfigurado';
  }
}

export function travelpayoutsConfigurado(): boolean {
  return Boolean(process.env.TRAVELPAYOUTS_TOKEN);
}

export function marker(): string | undefined {
  return process.env.TRAVELPAYOUTS_MARKER || undefined;
}

/**
 * Monta o link de reserva a partir do caminho relativo devolvido pela API,
 * anexando o marker do parceiro quando houver — é o que atribui a comissão.
 */
export function linkReserva(caminho: string): string {
  if (!caminho) return HOST_RESERVA;
  const url = new URL(caminho, HOST_RESERVA);
  const m = marker();
  if (m) url.searchParams.set('marker', m);
  return url.toString();
}

export interface OpcoesConsulta {
  /** Segundos de cache no data cache do Next. */
  revalidate: number;
}

/**
 * GET autenticado na Data API, com cache no servidor.
 *
 * O token vai no header X-Access-Token (a API também aceita em query, mas o
 * header evita vazar a chave em logs de URL).
 */
export async function tpGet<T>(
  caminho: string,
  parametros: Record<string, string | number | boolean | undefined>,
  opcoes: OpcoesConsulta,
): Promise<T> {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) throw new TravelpayoutsNaoConfigurado();

  const query = new URLSearchParams();
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== '') query.set(chave, String(valor));
  }

  const resposta = await fetch(`${BASE}${caminho}?${query}`, {
    headers: { 'X-Access-Token': token, Accept: 'application/json' },
    next: { revalidate: opcoes.revalidate },
  });

  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const detalhe =
      (corpo as { error?: string; message?: string } | null)?.error ??
      (corpo as { message?: string } | null)?.message ??
      `HTTP ${resposta.status}`;
    throw new TravelpayoutsError(detalhe, resposta.status, corpo);
  }

  // A API devolve `success: false` com 200 em alguns erros de parâmetro.
  if (corpo && typeof corpo === 'object' && 'success' in corpo && corpo.success === false) {
    const detalhe = (corpo as { error?: string }).error || 'Consulta recusada pela API.';
    throw new TravelpayoutsError(detalhe, 422, corpo);
  }

  return corpo as T;
}
