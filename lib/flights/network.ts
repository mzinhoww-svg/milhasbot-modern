/**
 * Malha de rotas e busca de itinerários criativos.
 *
 * Pensado para viagem de staff / não-revenue: quando o voo direto está cheio, o
 * que resolve é uma rota alternativa por um hub não óbvio (MSP→BNA→ATL em vez do
 * MSP→ATL direto). Então a busca não devolve só o caminho mais curto — ela
 * abre várias opções diversas, inclusive as que trocam de aeroporto na mesma
 * cidade (GRU→CGH por terra) e as de três trechos.
 *
 * Tudo roda em memória, no servidor. A topologia vem do OpenFlights
 * (lib/flights/routes.data.ts); horários são estimados por distância — para
 * staff, o que importa é a viabilidade da conexão, e o horário exato varia com
 * a carga do voo de qualquer forma.
 */

import { type Airport, airportByIata } from './airports';
import { distanceKm, flightMinutes } from './geo';
import { CIAS, ROUTE_TUPLES } from './routes.data';

// ------------------------------------------------------------- construção

interface Aresta {
  para: string;
  companhias: string[];
  km: number;
  minutos: number;
}

const adjacencia = new Map<string, Aresta[]>();

for (const [origem, destino, cias] of ROUTE_TUPLES) {
  const a = airportByIata.get(origem);
  const b = airportByIata.get(destino);
  if (!a || !b) continue;

  const km = Math.round(distanceKm(a.lat, a.lon, b.lat, b.lon));
  const lista = adjacencia.get(origem) ?? [];
  lista.push({ para: destino, companhias: cias.split(' '), km, minutos: flightMinutes(km) });
  adjacencia.set(origem, lista);
}

export const TOTAL_ARESTAS = ROUTE_TUPLES.length;
export const TOTAL_AEROPORTOS_COM_ROTA = adjacencia.size;

export function nomeCompanhia(codigo: string): string {
  return CIAS[codigo] ?? codigo;
}

/** Companhias que operam um trecho direto, se existir. */
export function quemVoa(de: string, para: string): string[] {
  return adjacencia.get(de)?.find((e) => e.para === para)?.companhias ?? [];
}

export function temRota(iata: string): boolean {
  return adjacencia.has(iata);
}

// -------------------------------------------------------- cidades (metrô)

/**
 * Agrupa aeroportos da mesma cidade/país — é o que permite trocar GRU por CGH.
 * Feito a partir do nome de cidade do OurAirports, sem tabela manual.
 */
const metroPorAeroporto = new Map<string, string>();
const aeroportosDoMetro = new Map<string, string[]>();

for (const iata of adjacencia.keys()) {
  const a = airportByIata.get(iata);
  if (!a) continue;
  const chave = `${a.cidade}|${a.cc}`;
  metroPorAeroporto.set(iata, chave);
  const grupo = aeroportosDoMetro.get(chave) ?? [];
  grupo.push(iata);
  aeroportosDoMetro.set(chave, grupo);
}

/** Todos os aeroportos da cidade de um aeroporto (incluindo ele). */
export function aeroportosDaCidade(iata: string): string[] {
  const grupo = aeroportosDoMetro.get(metroPorAeroporto.get(iata) ?? '');
  return grupo ? [...grupo] : [iata];
}

/** Outros aeroportos da mesma cidade, alcançáveis por traslado terrestre. */
function irmaosDeMetro(iata: string): string[] {
  const grupo = aeroportosDoMetro.get(metroPorAeroporto.get(iata) ?? '');
  return grupo ? grupo.filter((x) => x !== iata) : [];
}

// ----------------------------------------------------------- timing

const CONEXAO_DOMESTICA = 60;
const CONEXAO_INTERNACIONAL = 90;
/** Trocar de aeroporto na mesma cidade (ex.: GRU→CGH). */
const TRASLADO_TERRESTRE = 180;

function buffceConexao(anterior: string, atual: string, proximo: string): number {
  const a = airportByIata.get(anterior);
  const b = airportByIata.get(atual);
  const c = airportByIata.get(proximo);
  if (!a || !b || !c) return CONEXAO_INTERNACIONAL;
  const domestica = a.cc === b.cc && b.cc === c.cc;
  return domestica ? CONEXAO_DOMESTICA : CONEXAO_INTERNACIONAL;
}

// ---------------------------------------------------------- passos

export type TipoPasso = 'voo' | 'traslado';

export interface Passo {
  tipo: TipoPasso;
  de: string;
  para: string;
  /** Companhias no trecho (voo) — vazio em traslado terrestre. */
  companhias: string[];
  km: number;
  minutos: number;
}

export interface Itinerario {
  passos: Passo[];
  origem: string;
  destino: string;
  /** Aeroportos de conexão, na ordem. */
  conexoes: string[];
  voos: number;
  traslados: number;
  kmTotal: number;
  /** Voo + esperas de conexão + traslados. */
  minutosTotal: number;
  minutosVoo: number;
  /** Companhias que sozinhas cobrem todos os voos do itinerário. */
  companhiasUnicas: string[];
  /** Todas as companhias que aparecem, para rotular. */
  companhiasTodas: string[];
  /** Assinatura dos hubs, para diversificar resultados. */
  assinatura: string;
}

function montar(passos: Passo[]): Itinerario {
  const voos = passos.filter((p) => p.tipo === 'voo');
  const conexoes = passos.slice(0, -1).map((p) => p.para);

  const minutosVoo = voos.reduce((s, p) => s + p.minutos, 0);
  const minutosTotal = passos.reduce((s, p) => s + p.minutos, 0);
  const kmTotal = passos.reduce((s, p) => s + p.km, 0);

  const companhiasUnicas = voos
    .slice(1)
    .reduce((comuns, p) => comuns.filter((c) => p.companhias.includes(c)), [...voos[0].companhias]);

  const companhiasTodas = [...new Set(voos.flatMap((p) => p.companhias))];

  return {
    passos,
    origem: passos[0].de,
    destino: passos[passos.length - 1].para,
    conexoes,
    voos: voos.length,
    traslados: passos.filter((p) => p.tipo === 'traslado').length,
    kmTotal,
    minutosTotal,
    minutosVoo,
    companhiasUnicas,
    companhiasTodas,
    assinatura: conexoes.join('>'),
  };
}

// ------------------------------------------------------- busca criativa

export interface BuscaCriativaOpts {
  origem: string;
  /** Aeroportos de destino aceitos (a cidade/país/região inteira). */
  destinos: string[];
  /** Máximo de voos no itinerário (1 = direto). Padrão 3. */
  maxVoos?: number;
  /** Permitir um traslado terrestre entre aeroportos da mesma cidade. */
  permitirTraslado?: boolean;
  /** Teto de desvio sobre a distância direta, para podar absurdos. */
  desvioMaximo?: number;
  limite?: number;
}

/**
 * Busca em profundidade limitada, priorizando diversidade: guarda o melhor
 * itinerário por assinatura de hubs, para as opções não colapsarem todas no
 * mesmo caminho. É o que faz a busca "criativa" em vez de só o atalho.
 */
export function buscarCriativo(opts: BuscaCriativaOpts): Itinerario[] {
  const {
    origem,
    destinos,
    maxVoos = 3,
    permitirTraslado = true,
    desvioMaximo = 2.6,
    limite = 40,
  } = opts;

  const aeroOrigem = airportByIata.get(origem);
  if (!aeroOrigem || !adjacencia.has(origem)) return [];

  const alvo = new Set(destinos.filter((d) => d !== origem));
  if (alvo.size === 0) return [];

  // Distância direta até o alvo mais próximo, base do teto de desvio.
  let kmDireto = Infinity;
  for (const d of alvo) {
    const a = airportByIata.get(d);
    if (a) kmDireto = Math.min(kmDireto, distanceKm(aeroOrigem.lat, aeroOrigem.lon, a.lat, a.lon));
  }
  if (!Number.isFinite(kmDireto)) kmDireto = 0;

  const melhorPorAssinatura = new Map<string, Itinerario>();

  const visitados = new Set<string>([origem]);
  const metrosVisitados = new Set<string>([metroPorAeroporto.get(origem) ?? origem]);

  const registrar = (passos: Passo[]) => {
    const it = montar(passos);
    if (it.kmTotal > Math.max(kmDireto * desvioMaximo, kmDireto + 1500)) return;

    const anterior = melhorPorAssinatura.get(it.assinatura);
    if (!anterior || it.minutosTotal < anterior.minutosTotal) {
      melhorPorAssinatura.set(it.assinatura, it);
    }
  };

  const explorar = (atual: string, passos: Passo[], trasladoUsado: boolean) => {
    const voosFeitos = passos.filter((p) => p.tipo === 'voo').length;

    // Chegou? (não conta traslado como último passo útil)
    if (passos.length > 0 && alvo.has(atual) && passos[passos.length - 1].tipo === 'voo') {
      registrar([...passos]);
      // não retorna: pode haver caminho mais longo até outro aeroporto do alvo,
      // mas evitamos seguir a partir de um destino já alcançado
      return;
    }

    if (voosFeitos >= maxVoos) return;

    // Voos diretos a partir de `atual`.
    for (const aresta of adjacencia.get(atual) ?? []) {
      if (visitados.has(aresta.para)) continue;
      const metro = metroPorAeroporto.get(aresta.para) ?? aresta.para;
      // Não revisita a mesma cidade, exceto se for o alvo.
      if (metrosVisitados.has(metro) && !alvo.has(aresta.para)) continue;

      const passo: Passo = {
        tipo: 'voo',
        de: atual,
        para: aresta.para,
        companhias: aresta.companhias,
        km: aresta.km,
        minutos: aresta.minutos + (passos.length > 0 ? buffceConexao(passos[passos.length - 1].de, atual, aresta.para) : 0),
      };

      visitados.add(aresta.para);
      metrosVisitados.add(metro);
      explorar(aresta.para, [...passos, passo], trasladoUsado);
      visitados.delete(aresta.para);
      metrosVisitados.delete(metro);
    }

    // Traslado terrestre para outro aeroporto da mesma cidade (uma vez só, e
    // não como primeiro passo). Abre rotas como ...→GRU (terra)→CGH→CGB.
    if (permitirTraslado && !trasladoUsado && passos.length > 0) {
      for (const irmao of irmaosDeMetro(atual)) {
        if (visitados.has(irmao)) continue;
        const passo: Passo = {
          tipo: 'traslado',
          de: atual,
          para: irmao,
          companhias: [],
          km: 0,
          minutos: TRASLADO_TERRESTRE,
        };
        visitados.add(irmao);
        explorar(irmao, [...passos, passo], true);
        visitados.delete(irmao);
      }
    }
  };

  explorar(origem, [], false);

  return [...melhorPorAssinatura.values()]
    .sort((a, b) => a.minutosTotal - b.minutosTotal || a.voos - b.voos || a.kmTotal - b.kmTotal)
    .slice(0, limite);
}

// ------------------------------------------------------- consultas simples

export interface DestinoDireto {
  aeroporto: Airport;
  companhias: string[];
  km: number;
  minutos: number;
}

export function destinosDiretos(iata: string): DestinoDireto[] {
  const saida: DestinoDireto[] = [];
  for (const aresta of adjacencia.get(iata) ?? []) {
    const aeroporto = airportByIata.get(aresta.para);
    if (!aeroporto) continue;
    saida.push({ aeroporto, companhias: aresta.companhias, km: aresta.km, minutos: aresta.minutos });
  }
  return saida.sort((a, b) => a.km - b.km);
}

export function companhiasDoAeroporto(iata: string): { codigo: string; rotas: number }[] {
  const contagem = new Map<string, number>();
  for (const aresta of adjacencia.get(iata) ?? []) {
    for (const c of aresta.companhias) contagem.set(c, (contagem.get(c) ?? 0) + 1);
  }
  return [...contagem.entries()]
    .map(([codigo, rotas]) => ({ codigo, rotas }))
    .sort((a, b) => b.rotas - a.rotas || a.codigo.localeCompare(b.codigo));
}
