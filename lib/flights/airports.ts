/**
 * Aeroportos das Américas.
 *
 * Os dados vêm de lib/flights/airports.data.ts, gerado a partir do OurAirports
 * (domínio público) por `npm run flights:aeroportos`. Nada aqui é escrito à
 * mão — coordenadas, fuso e nome de país têm procedência.
 */

import {
  AIRPORT_TUPLES,
  FONTE_AEROPORTOS,
  PAISES,
  type AirportTuple,
} from './airports.data';

export const REGIOES = [
  'Brasil',
  'América do Sul',
  'América Central',
  'Caribe',
  'México',
  'América do Norte',
] as const;

export type Regiao = (typeof REGIOES)[number];

export interface Airport {
  iata: string;
  nome: string;
  cidade: string;
  pais: string;
  /** ISO 3166-1 alfa-2. */
  cc: string;
  regiao: Regiao;
  lat: number;
  lon: number;
  /** Fuso IANA, derivado das coordenadas. */
  tz: string;
  /** Aeroporto de grande porte na classificação do OurAirports. */
  grande: boolean;
}

export const FONTE = FONTE_AEROPORTOS;

function hidratar([iata, nome, cidade, cc, lat, lon, tz, grande]: AirportTuple): Airport {
  const [pais, regiao] = PAISES[cc] ?? [cc, 'América do Norte'];

  return {
    iata,
    nome,
    cidade,
    pais,
    cc,
    regiao: regiao as Regiao,
    lat,
    lon,
    tz,
    grande: grande === 1,
  };
}

export const airports: Airport[] = AIRPORT_TUPLES.map(hidratar);

export const airportByIata: ReadonlyMap<string, Airport> = new Map(
  airports.map((a) => [a.iata, a]),
);

export function getAirport(iata: string): Airport | undefined {
  return airportByIata.get(iata.toUpperCase());
}

/** Rótulo curto e estável, usado em listas e no <title> das páginas. */
export function airportLabel(a: Airport): string {
  return `${a.cidade} (${a.iata})`;
}

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
    return a ? airportLabel(a) : alvo.valor;
  }
  return alvo.valor;
}
