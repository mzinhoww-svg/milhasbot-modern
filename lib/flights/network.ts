/**
 * Grafo da malha e busca de itinerários.
 *
 * Tudo aqui roda em memória, no cliente. O grafo tem ~180 nós e alguns milhares
 * de arestas, então buscar direto, 1 parada e 2 paradas custa poucos
 * milissegundos — não há chamada de rede no caminho da busca.
 */

import {
  type Airport,
  type Regiao,
  airports,
  airportByIata,
} from './airports';
import { type Alianca, airlineByCode, airlines } from './airlines';
import { distanceKm, flightMinutes } from './geo';
import { routes } from './routes';

// ---------------------------------------------------------------- construção

/** de → para → companhias que operam o trecho. */
type Adjacencia = Map<string, Map<string, string[]>>;

function construirGrafo(): { adjacencia: Adjacencia; arestas: Trecho[] } {
  const pares = new Map<string, Set<string>>();

  for (const [codigo, malha] of Object.entries(routes)) {
    for (const [base, destinos] of malha) {
      for (const destino of destinos) {
        if (base === destino) continue;
        if (!airportByIata.has(base) || !airportByIata.has(destino)) continue;

        // Chave canônica ordenada: a rota é a mesma nos dois sentidos.
        const chave = base < destino ? `${base}-${destino}` : `${destino}-${base}`;
        const atual = pares.get(chave);
        if (atual) atual.add(codigo);
        else pares.set(chave, new Set([codigo]));
      }
    }
  }

  const adjacencia: Adjacencia = new Map();
  const arestas: Trecho[] = [];

  const ligar = (de: string, para: string, companhias: string[]) => {
    const vizinhos = adjacencia.get(de) ?? new Map<string, string[]>();
    vizinhos.set(para, companhias);
    adjacencia.set(de, vizinhos);
  };

  for (const [chave, companhias] of pares) {
    const [a, b] = chave.split('-');
    const lista = [...companhias].sort();
    ligar(a, b, lista);
    ligar(b, a, lista);

    const origem = airportByIata.get(a)!;
    const destino = airportByIata.get(b)!;
    const km = Math.round(distanceKm(origem.lat, origem.lon, destino.lat, destino.lon));

    arestas.push({ de: a, para: b, companhias: lista, km, minutos: flightMinutes(km) });
  }

  return { adjacencia, arestas };
}

export interface Trecho {
  de: string;
  para: string;
  companhias: string[];
  km: number;
  minutos: number;
}

const { adjacencia, arestas } = construirGrafo();

export const TOTAL_ROTAS = arestas.length;
export const TOTAL_AEROPORTOS = adjacencia.size;

/** Todas as rotas da base, para desenhar a malha completa. */
export function todasAsRotas(): Trecho[] {
  return arestas;
}

const trechoPorChave = new Map(
  arestas.flatMap((t) => [
    [`${t.de}>${t.para}`, t],
    [`${t.para}>${t.de}`, { ...t, de: t.para, para: t.de }],
  ] as [string, Trecho][]),
);

// ------------------------------------------------------------------ filtros

export interface Filtros {
  /** Códigos IATA de companhia. Vazio = todas. */
  companhias?: string[];
  /** Alianças aceitas. Vazio = todas. */
  aliancas?: Alianca[];
  /** Só itinerários emissíveis integralmente com este programa. */
  programa?: string;
}

function companhiasPermitidas(filtros: Filtros): Set<string> | null {
  const { companhias, aliancas, programa } = filtros;
  const temFiltro =
    (companhias && companhias.length > 0) ||
    (aliancas && aliancas.length > 0) ||
    Boolean(programa);

  if (!temFiltro) return null;

  const permitidas = new Set<string>();
  for (const airline of airlines) {
    if (companhias && companhias.length > 0 && !companhias.includes(airline.code)) continue;
    if (aliancas && aliancas.length > 0 && !aliancas.includes(airline.alianca)) continue;
    if (programa && !airline.programas.includes(programa)) continue;
    permitidas.add(airline.code);
  }

  return permitidas;
}

function filtrarCompanhias(lista: string[], permitidas: Set<string> | null): string[] {
  if (!permitidas) return lista;
  return lista.filter((c) => permitidas.has(c));
}

// ------------------------------------------------------------------- alvos

export type Alvo =
  | { tipo: 'aeroporto'; valor: string }
  | { tipo: 'pais'; valor: string }
  | { tipo: 'regiao'; valor: Regiao };

/** Aeroportos que satisfazem o alvo, excluindo as origens. */
export function resolverAlvo(alvo: Alvo, origens: string[] = []): Airport[] {
  const excluir = new Set(origens);

  const candidatos = (() => {
    switch (alvo.tipo) {
      case 'aeroporto': {
        const a = airportByIata.get(alvo.valor);
        return a ? [a] : [];
      }
      case 'pais':
        return airports.filter((a) => a.pais === alvo.valor);
      case 'regiao':
        return airports.filter((a) => a.regiao === alvo.valor);
    }
  })();

  return candidatos.filter((a) => !excluir.has(a.iata));
}

export function rotuloAlvo(alvo: Alvo): string {
  if (alvo.tipo === 'aeroporto') {
    const a = airportByIata.get(alvo.valor);
    return a ? `${a.cidade} (${a.iata})` : alvo.valor;
  }
  return alvo.valor;
}

// ------------------------------------------------------------- itinerários

export interface Conexao {
  /** Aeroporto onde a conexão acontece. */
  iata: string;
  /** Tempo mínimo considerado, em minutos. */
  minutos: number;
  /** Se é preciso trocar de companhia sem acordo de bagagem. */
  trocaSemAcordo: boolean;
}

export interface Itinerario {
  segmentos: Trecho[];
  conexoes: Conexao[];
  paradas: number;
  destino: string;
  kmTotal: number;
  minutosVoo: number;
  minutosConexao: number;
  minutosTotal: number;
  /** Desvio em relação ao trajeto direto: 1.0 = sem desvio. */
  desvio: number;
  /** Companhias que cobrem o itinerário inteiro sozinhas. */
  companhiasUnicas: string[];
  /** Programas que emitem todos os trechos do itinerário. */
  programas: string[];
}

const CONEXAO_DOMESTICA = 60;
const CONEXAO_INTERNACIONAL = 90;
const PENALIDADE_SEM_ACORDO = 45;

function mesmoGrupo(a: string[], b: string[]): boolean {
  if (a.some((c) => b.includes(c))) return true;

  const aliancasA = new Set(
    a.map((c) => airlineByCode.get(c)?.alianca).filter((x) => x && x !== 'nenhuma'),
  );

  return b.some((c) => {
    const alianca = airlineByCode.get(c)?.alianca;
    return alianca && alianca !== 'nenhuma' && aliancasA.has(alianca);
  });
}

function calcularConexao(anterior: Trecho, seguinte: Trecho): Conexao {
  const chegada = airportByIata.get(anterior.para)!;
  const saida = airportByIata.get(anterior.de)!;
  const proximo = airportByIata.get(seguinte.para)!;

  const domestica = saida.cc === chegada.cc && chegada.cc === proximo.cc;
  const base = domestica ? CONEXAO_DOMESTICA : CONEXAO_INTERNACIONAL;
  const trocaSemAcordo = !mesmoGrupo(anterior.companhias, seguinte.companhias);

  return {
    iata: anterior.para,
    minutos: base + (trocaSemAcordo ? PENALIDADE_SEM_ACORDO : 0),
    trocaSemAcordo,
  };
}

function programasDoSegmento(companhias: string[]): Set<string> {
  const programas = new Set<string>();
  for (const codigo of companhias) {
    for (const programa of airlineByCode.get(codigo)?.programas ?? []) {
      programas.add(programa);
    }
  }
  return programas;
}

function montarItinerario(segmentos: Trecho[], kmDireto: number): Itinerario {
  const conexoes: Conexao[] = [];
  for (let i = 1; i < segmentos.length; i++) {
    conexoes.push(calcularConexao(segmentos[i - 1], segmentos[i]));
  }

  const kmTotal = segmentos.reduce((soma, s) => soma + s.km, 0);
  const minutosVoo = segmentos.reduce((soma, s) => soma + s.minutos, 0);
  const minutosConexao = conexoes.reduce((soma, c) => soma + c.minutos, 0);

  const companhiasUnicas = segmentos
    .slice(1)
    .reduce(
      (comuns, s) => comuns.filter((c) => s.companhias.includes(c)),
      [...segmentos[0].companhias],
    );

  const programas = segmentos
    .slice(1)
    .reduce((comuns, s) => {
      const doSegmento = programasDoSegmento(s.companhias);
      return comuns.filter((p) => doSegmento.has(p));
    }, [...programasDoSegmento(segmentos[0].companhias)])
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));

  return {
    segmentos,
    conexoes,
    paradas: segmentos.length - 1,
    destino: segmentos[segmentos.length - 1].para,
    kmTotal,
    minutosVoo,
    minutosConexao,
    minutosTotal: minutosVoo + minutosConexao,
    desvio: kmDireto > 0 ? kmTotal / kmDireto : 1,
    companhiasUnicas,
    programas,
  };
}

export interface BuscaOpts extends Filtros {
  /** Um ou mais aeroportos de partida (ex.: os três de Nova York). */
  origens: string[];
  alvo: Alvo;
  /** 0, 1 ou 2. */
  maxParadas?: number;
  /** Teto de desvio sobre a rota direta. */
  desvioMaximo?: number;
  limite?: number;
}

/**
 * Busca itinerários de qualquer origem informada até qualquer aeroporto que
 * satisfaça o alvo, com até `maxParadas` conexões.
 */
export function buscarItinerarios(opts: BuscaOpts): Itinerario[] {
  const {
    origens,
    alvo,
    maxParadas = 2,
    desvioMaximo = 1.9,
    limite = 60,
  } = opts;

  const permitidas = companhiasPermitidas(opts);
  const destinos = resolverAlvo(alvo, origens);
  if (destinos.length === 0 || origens.length === 0) return [];

  const alvoIatas = new Set(destinos.map((d) => d.iata));
  const origensValidas = origens.filter((o) => airportByIata.has(o) && !alvoIatas.has(o));

  const resultados: Itinerario[] = [];
  const vistos = new Set<string>();

  const registrar = (segmentos: Trecho[], origem: Airport) => {
    const chave = [segmentos[0].de, ...segmentos.map((s) => s.para)].join('>');
    if (vistos.has(chave)) return;

    const chegada = airportByIata.get(segmentos[segmentos.length - 1].para)!;
    const kmDireto = distanceKm(origem.lat, origem.lon, chegada.lat, chegada.lon);
    const itinerario = montarItinerario(segmentos, kmDireto);

    // O teto de desvio só faz sentido com conexão: um voo direto é, por
    // definição, o menor trajeto possível entre os dois pontos.
    if (itinerario.paradas > 0 && itinerario.desvio > desvioMaximo) return;
    if (opts.programa && itinerario.programas.length === 0) return;

    vistos.add(chave);
    resultados.push(itinerario);
  };

  const vizinhos = (iata: string): [string, string[]][] => {
    const mapa = adjacencia.get(iata);
    if (!mapa) return [];

    const saida: [string, string[]][] = [];
    for (const [destino, companhias] of mapa) {
      const filtradas = filtrarCompanhias(companhias, permitidas);
      if (filtradas.length > 0) saida.push([destino, filtradas]);
    }
    return saida;
  };

  const trecho = (de: string, para: string, companhias: string[]): Trecho => {
    const base = trechoPorChave.get(`${de}>${para}`)!;
    return { ...base, de, para, companhias };
  };

  for (const origemIata of origensValidas) {
    const origem = airportByIata.get(origemIata)!;
    const nivel1 = vizinhos(origemIata);

    // Direto
    for (const [destino, companhias] of nivel1) {
      if (alvoIatas.has(destino)) {
        registrar([trecho(origemIata, destino, companhias)], origem);
      }
    }

    if (maxParadas < 1) continue;

    for (const [conexao, companhias1] of nivel1) {
      if (alvoIatas.has(conexao)) continue;

      const seg1 = trecho(origemIata, conexao, companhias1);
      const nivel2 = vizinhos(conexao);

      for (const [destino, companhias2] of nivel2) {
        if (destino === origemIata) continue;

        if (alvoIatas.has(destino)) {
          registrar([seg1, trecho(conexao, destino, companhias2)], origem);
          continue;
        }

        if (maxParadas < 2) continue;

        const seg2 = trecho(conexao, destino, companhias2);
        for (const [final, companhias3] of vizinhos(destino)) {
          if (final === origemIata || final === conexao) continue;
          if (!alvoIatas.has(final)) continue;

          registrar([seg1, seg2, trecho(destino, final, companhias3)], origem);
        }
      }
    }
  }

  resultados.sort(
    (a, b) =>
      a.minutosTotal - b.minutosTotal ||
      a.paradas - b.paradas ||
      a.kmTotal - b.kmTotal,
  );

  return resultados.slice(0, limite);
}

// ------------------------------------------------------- consultas simples

export interface DestinoDireto {
  aeroporto: Airport;
  companhias: string[];
  km: number;
  minutos: number;
}

/** Todos os destinos com voo direto a partir de um aeroporto. */
export function destinosDiretos(iata: string, filtros: Filtros = {}): DestinoDireto[] {
  const permitidas = companhiasPermitidas(filtros);
  const mapa = adjacencia.get(iata);
  if (!mapa) return [];

  const saida: DestinoDireto[] = [];
  for (const [destino, companhias] of mapa) {
    const filtradas = filtrarCompanhias(companhias, permitidas);
    if (filtradas.length === 0) continue;

    const aeroporto = airportByIata.get(destino);
    const trecho = trechoPorChave.get(`${iata}>${destino}`);
    if (!aeroporto || !trecho) continue;

    saida.push({
      aeroporto,
      companhias: filtradas,
      km: trecho.km,
      minutos: trecho.minutos,
    });
  }

  return saida.sort((a, b) => a.km - b.km);
}

/** Companhias que operam um trecho direto, se existir. */
export function quemVoa(de: string, para: string): string[] {
  return adjacencia.get(de)?.get(para) ?? [];
}

/** Malha completa de uma companhia, para desenhar no mapa. */
export function malhaDaCompanhia(codigo: string): Trecho[] {
  return arestas.filter((t) => t.companhias.includes(codigo));
}

/** Aeroportos atendidos por uma companhia, do maior para o menor número de rotas. */
export function aeroportosDaCompanhia(codigo: string): { aeroporto: Airport; rotas: number }[] {
  const contagem = new Map<string, number>();

  for (const t of malhaDaCompanhia(codigo)) {
    contagem.set(t.de, (contagem.get(t.de) ?? 0) + 1);
    contagem.set(t.para, (contagem.get(t.para) ?? 0) + 1);
  }

  return [...contagem.entries()]
    .map(([iata, rotas]) => ({ aeroporto: airportByIata.get(iata)!, rotas }))
    .filter((x) => Boolean(x.aeroporto))
    .sort((a, b) => b.rotas - a.rotas || a.aeroporto.iata.localeCompare(b.aeroporto.iata));
}

/** Companhias que operam a partir de um aeroporto, com quantas rotas cada uma. */
export function companhiasDoAeroporto(iata: string): { codigo: string; rotas: number }[] {
  const contagem = new Map<string, number>();

  for (const [, companhias] of adjacencia.get(iata) ?? []) {
    for (const codigo of companhias) {
      contagem.set(codigo, (contagem.get(codigo) ?? 0) + 1);
    }
  }

  return [...contagem.entries()]
    .map(([codigo, rotas]) => ({ codigo, rotas }))
    .sort((a, b) => b.rotas - a.rotas || a.codigo.localeCompare(b.codigo));
}

/** Aeroportos ordenados por número de rotas — usado nos rankings e no autocomplete. */
export const aeroportosPorMovimento: { aeroporto: Airport; rotas: number }[] = airports
  .map((aeroporto) => ({
    aeroporto,
    rotas: adjacencia.get(aeroporto.iata)?.size ?? 0,
  }))
  .sort((a, b) => b.rotas - a.rotas);

/** Países presentes na base, com quantos aeroportos cada um. */
export const paises: { pais: string; regiao: Regiao; aeroportos: number }[] = (() => {
  const mapa = new Map<string, { regiao: Regiao; aeroportos: number }>();

  for (const a of airports) {
    const atual = mapa.get(a.pais);
    if (atual) atual.aeroportos++;
    else mapa.set(a.pais, { regiao: a.regiao, aeroportos: 1 });
  }

  return [...mapa.entries()]
    .map(([pais, info]) => ({ pais, ...info }))
    .sort((a, b) => a.pais.localeCompare(b.pais, 'pt-BR'));
})();
