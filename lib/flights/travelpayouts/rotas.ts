import 'server-only';

import { getAirport } from '../airports';
import { tzOffsetMinutes } from '../time';
import { linkReserva, tpGet } from './client';

/**
 * Consultas de tarifa e horário na Data API do Travelpayouts.
 *
 * O endpoint de preços devolve a melhor tarifa em cache por rota/data, com
 * horário de partida real, duração e nº de conexões — mas não o itinerário
 * trecho a trecho. Mostramos o que é real (partida, chegada estimada da
 * duração, paradas, preço) e o link leva ao itinerário completo na reserva.
 */

// Preço muda ao longo do dia; três horas de cache poupa cota sem envelhecer.
const CACHE_PRECOS = 60 * 60 * 3;

interface PrecoApi {
  origin: string;
  destination: string;
  origin_airport?: string;
  destination_airport?: string;
  price: number;
  airline: string;
  flight_number?: number | string;
  departure_at: string;
  return_at?: string;
  transfers?: number;
  /** Duração total ida+volta em minutos. */
  duration?: number;
  /** Duração só da ida, em minutos. */
  duration_to?: number;
  link?: string;
}

interface RespostaPrecos {
  data?: PrecoApi[];
  currency?: string;
}

export interface Chegada {
  /** AAAA-MM-DD no fuso do destino. */
  data: string;
  /** Minutos desde a meia-noite no fuso do destino. */
  minutos: number;
}

export interface OfertaReal {
  origem: string;
  destino: string;
  companhia: string;
  voo?: string;
  /** ISO com offset da origem, ex.: 2026-09-06T20:29:00-04:00. */
  partida: string;
  /** Horário local de chegada, calculado da duração da ida. */
  chegada: Chegada | null;
  duracaoMin: number;
  paradas: number;
  preco: { total: number; moeda: string };
  link: string;
}

/**
 * Converte a chegada em hora local do destino: parte-se do instante absoluto
 * da partida (o offset já vem na string) mais a duração da ida, e reposiciona
 * no fuso do aeroporto de destino.
 */
function calcularChegada(partidaIso: string, duracaoIdaMin: number, tzDestino: string): Chegada | null {
  const partidaMs = Date.parse(partidaIso);
  if (!Number.isFinite(partidaMs) || duracaoIdaMin <= 0) return null;

  const chegadaUtc = new Date(partidaMs + duracaoIdaMin * 60_000);
  const offset = tzOffsetMinutes(tzDestino, chegadaUtc);
  const local = new Date(chegadaUtc.getTime() + offset * 60_000);

  return {
    data: local.toISOString().slice(0, 10),
    minutos: local.getUTCHours() * 60 + local.getUTCMinutes(),
  };
}

export interface ParametrosOfertas {
  origem: string;
  destino: string;
  /** AAAA-MM-DD; sem data, a API devolve a melhor tarifa próxima. */
  data?: string;
  moeda?: string;
  limite?: number;
}

/** Tarifas reais para um par origem/destino, com horário e link de reserva. */
export async function ofertas(p: ParametrosOfertas): Promise<OfertaReal[]> {
  const resposta = await tpGet<RespostaPrecos>(
    '/aviasales/v3/prices_for_dates',
    {
      origin: p.origem,
      destination: p.destino,
      departure_at: p.data,
      one_way: true,
      currency: (p.moeda ?? 'brl').toLowerCase(),
      sorting: 'price',
      limit: p.limite ?? 20,
      market: 'br',
    },
    { revalidate: CACHE_PRECOS },
  );

  const tzDestino = getAirport(p.destino)?.tz;

  return (resposta.data ?? []).map((it) => {
    const destino = it.destination_airport ?? it.destination;
    const duracaoIda = it.duration_to ?? it.duration ?? 0;

    return {
      origem: it.origin_airport ?? it.origin,
      destino,
      companhia: it.airline,
      voo: it.flight_number ? `${it.airline}${it.flight_number}` : undefined,
      partida: it.departure_at,
      chegada: tzDestino ? calcularChegada(it.departure_at, duracaoIda, tzDestino) : null,
      duracaoMin: duracaoIda,
      paradas: it.transfers ?? 0,
      preco: { total: it.price, moeda: (resposta.currency ?? p.moeda ?? 'BRL').toUpperCase() },
      link: linkReserva(it.link ?? ''),
    };
  });
}

interface RespostaDirecoes {
  data?: Record<
    string,
    {
      origin: string;
      destination: string;
      price: number;
      airline: string;
      departure_at: string;
      transfers?: number;
    }
  >;
}

export interface DestinoBarato {
  destino: string;
  preco: number;
  companhia: string;
  partida: string;
  paradas: number;
}

/**
 * Destinos mais baratos a partir de uma cidade (uma chamada só). Útil como
 * panorama; a chave é código de cidade, resolvido para aeroporto quando possível.
 */
export async function destinosBaratos(origem: string, moeda = 'brl'): Promise<DestinoBarato[]> {
  const resposta = await tpGet<RespostaDirecoes>(
    '/v1/city-directions',
    { origin: origem, currency: moeda.toLowerCase() },
    { revalidate: CACHE_PRECOS },
  );

  return Object.values(resposta.data ?? {}).map((d) => ({
    destino: d.destination,
    preco: d.price,
    companhia: d.airline,
    partida: d.departure_at,
    paradas: d.transfers ?? 0,
  }));
}
