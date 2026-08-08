import 'server-only';

import { amadeusGet } from './client';

/**
 * Consultas de rota e horário na Amadeus.
 *
 * Diferença central para a base curada anterior: `arrival.at` é o horário local
 * publicado pela companhia no aeroporto de chegada. O filtro "chegar até" passa
 * a ser um fato, não uma estimativa por distância.
 */

// Uma malha muda por temporada, não por hora. Um dia de cache é conservador e
// economiza a cota mensal do plano gratuito.
const CACHE_DESTINOS = 60 * 60 * 24;

// Preço e disponibilidade mudam ao longo do dia; horário quase não muda.
const CACHE_OFERTAS = 60 * 60 * 3;

interface RespostaDestinos {
  data?: { name?: string; iataCode: string; subtype?: string }[];
}

export interface DestinoDiretoAmadeus {
  iata: string;
  nome?: string;
}

/**
 * Destinos servidos sem escala a partir de um aeroporto.
 * Endpoint Airport Routes — uma chamada devolve a malha inteira da origem.
 */
export async function destinosDiretos(origem: string): Promise<DestinoDiretoAmadeus[]> {
  const resposta = await amadeusGet<RespostaDestinos>(
    '/v1/airport/direct-destinations',
    { departureAirportCode: origem, max: 200 },
    { revalidate: CACHE_DESTINOS },
  );

  return (resposta.data ?? [])
    .filter((d) => /^[A-Z]{3}$/.test(d.iataCode))
    .map((d) => ({ iata: d.iataCode, nome: d.name }));
}

interface SegmentoApi {
  departure: { iataCode: string; at: string; terminal?: string };
  arrival: { iataCode: string; at: string; terminal?: string };
  carrierCode: string;
  number: string;
  aircraft?: { code: string };
  duration?: string;
  numberOfStops?: number;
  operating?: { carrierCode: string };
}

interface RespostaOfertas {
  data?: {
    id: string;
    itineraries: { duration: string; segments: SegmentoApi[] }[];
    price?: { total?: string; currency?: string; grandTotal?: string };
    validatingAirlineCodes?: string[];
    numberOfBookableSeats?: number;
  }[];
  dictionaries?: {
    carriers?: Record<string, string>;
    aircraft?: Record<string, string>;
  };
}

export interface SegmentoReal {
  de: string;
  para: string;
  /** Horário local de partida, ISO sem fuso (ex.: 2026-09-15T08:05:00). */
  partida: string;
  /** Horário local de chegada, ISO sem fuso. */
  chegada: string;
  companhia: string;
  companhiaNome?: string;
  /** Companhia que de fato opera, quando difere da que vende (codeshare). */
  operadoPor?: string;
  voo: string;
  aeronave?: string;
  duracaoMin: number;
}

export interface ItinerarioReal {
  id: string;
  segmentos: SegmentoReal[];
  paradas: number;
  duracaoMin: number;
  destino: string;
  preco?: { total: number; moeda: string };
  companhias: string[];
}

/** Converte a duração ISO-8601 da Amadeus (PT9H40M) em minutos. */
export function duracaoParaMinutos(duracao: string | undefined): number {
  if (!duracao) return 0;
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(duracao);
  if (!m) return 0;

  const [, dias, horas, minutos] = m;
  return Number(dias ?? 0) * 1440 + Number(horas ?? 0) * 60 + Number(minutos ?? 0);
}

export interface ParametrosOfertas {
  origem: string;
  destino: string;
  /** AAAA-MM-DD. */
  data: string;
  adultos?: number;
  soDireto?: boolean;
  maxParadas?: number;
  moeda?: string;
  max?: number;
}

/**
 * Ofertas reais para um par origem/destino em uma data, com horários
 * publicados. `maxParadas` é aplicado aqui porque a API só oferece o
 * liga/desliga de voo direto.
 */
export async function ofertas(p: ParametrosOfertas): Promise<ItinerarioReal[]> {
  const resposta = await amadeusGet<RespostaOfertas>(
    '/v2/shopping/flight-offers',
    {
      originLocationCode: p.origem,
      destinationLocationCode: p.destino,
      departureDate: p.data,
      adults: p.adultos ?? 1,
      nonStop: p.soDireto ? 'true' : undefined,
      currencyCode: p.moeda ?? 'BRL',
      max: p.max ?? 30,
    },
    { revalidate: CACHE_OFERTAS },
  );

  const nomes = resposta.dictionaries?.carriers ?? {};
  const aeronaves = resposta.dictionaries?.aircraft ?? {};
  const itinerarios: ItinerarioReal[] = [];

  for (const oferta of resposta.data ?? []) {
    // Busca de ida: interessa o primeiro itinerário.
    const bruto = oferta.itineraries[0];
    if (!bruto || bruto.segments.length === 0) continue;

    const paradas = bruto.segments.length - 1;
    if (p.maxParadas !== undefined && paradas > p.maxParadas) continue;

    const segmentos: SegmentoReal[] = bruto.segments.map((s) => ({
      de: s.departure.iataCode,
      para: s.arrival.iataCode,
      partida: s.departure.at,
      chegada: s.arrival.at,
      companhia: s.carrierCode,
      companhiaNome: nomes[s.carrierCode],
      operadoPor:
        s.operating?.carrierCode && s.operating.carrierCode !== s.carrierCode
          ? s.operating.carrierCode
          : undefined,
      voo: `${s.carrierCode}${s.number}`,
      aeronave: s.aircraft?.code ? aeronaves[s.aircraft.code] : undefined,
      duracaoMin: duracaoParaMinutos(s.duration),
    }));

    const total = Number(oferta.price?.grandTotal ?? oferta.price?.total);

    itinerarios.push({
      id: oferta.id,
      segmentos,
      paradas,
      duracaoMin: duracaoParaMinutos(bruto.duration),
      destino: segmentos[segmentos.length - 1].para,
      preco: Number.isFinite(total)
        ? { total, moeda: oferta.price?.currency ?? 'BRL' }
        : undefined,
      companhias: [...new Set(segmentos.map((s) => s.operadoPor ?? s.companhia))],
    });
  }

  return itinerarios;
}
