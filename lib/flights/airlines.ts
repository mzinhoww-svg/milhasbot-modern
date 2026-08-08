/**
 * Alianças e programas de milhas por companhia.
 *
 * Atenção ao que este arquivo é e ao que não é.
 *
 * Rotas e horários do produto vêm da Amadeus — dado operacional, com fonte.
 * Isto aqui é outra coisa: conteúdo editorial curado sobre aliança e sobre
 * quais programas emitem cada companhia. Não há API pública que dê isso, e é
 * justamente o que interessa a quem viaja com milhas: saber que existe voo
 * direto resolve metade do problema; a outra metade é saber com qual programa
 * dá para emitir.
 *
 * Consequências práticas:
 * - a cobertura é parcial de propósito (companhias relevantes das Américas);
 * - companhia que a Amadeus devolver e não constar aqui aparece com o nome que
 *   a própria Amadeus informa e sem dado de programa — nunca com dado chutado;
 * - a revisão é manual e datada, como o resto do conteúdo editorial do site.
 */

export const PROGRAMAS_REVISAO = 'julho/2026';

export type Alianca = 'star' | 'oneworld' | 'skyteam' | 'nenhuma';

export interface Airline {
  /** Código IATA de 2 caracteres, usado nas URLs e como chave das rotas. */
  code: string;
  nome: string;
  pais: string;
  alianca: Alianca;
  /** Cor da malha no mapa. */
  cor: string;
  /** Programa próprio da companhia. */
  programaProprio: string;
  /**
   * Programas parceiros que emitem passagens nesta companhia, do ponto de vista
   * de quem acumula no Brasil. Inclui parcerias bilaterais fora de aliança.
   */
  programas: string[];
}

export const ALIANCAS: Record<Alianca, { nome: string; cor: string }> = {
  star: { nome: 'Star Alliance', cor: '#eab308' },
  oneworld: { nome: 'oneworld', cor: '#38bdf8' },
  skyteam: { nome: 'SkyTeam', cor: '#a78bfa' },
  nenhuma: { nome: 'Sem aliança', cor: '#94a3b8' },
};

export const airlines: Airline[] = [
  {
    code: 'LA',
    nome: 'LATAM',
    pais: 'Chile/Brasil',
    alianca: 'oneworld',
    cor: '#f43f5e',
    programaProprio: 'LATAM Pass',
    programas: ['LATAM Pass', 'AAdvantage', 'Iberia Plus', 'British Avios', 'Qantas', 'Alaska Mileage Plan'],
  },
  {
    code: 'G3',
    nome: 'GOL',
    pais: 'Brasil',
    alianca: 'nenhuma',
    cor: '#f97316',
    programaProprio: 'Smiles',
    programas: ['Smiles', 'AAdvantage'],
  },
  {
    code: 'AD',
    nome: 'Azul',
    pais: 'Brasil',
    alianca: 'nenhuma',
    cor: '#3b82f6',
    programaProprio: 'TudoAzul',
    programas: ['TudoAzul', 'MileagePlus', 'TAP Miles&Go'],
  },
  {
    code: 'AA',
    nome: 'American Airlines',
    pais: 'Estados Unidos',
    alianca: 'oneworld',
    cor: '#0ea5e9',
    programaProprio: 'AAdvantage',
    programas: ['AAdvantage', 'LATAM Pass', 'Iberia Plus', 'British Avios', 'Qantas', 'Alaska Mileage Plan'],
  },
  {
    code: 'UA',
    nome: 'United Airlines',
    pais: 'Estados Unidos',
    alianca: 'star',
    cor: '#2563eb',
    programaProprio: 'MileagePlus',
    programas: ['MileagePlus', 'LifeMiles', 'Aeroplan', 'TAP Miles&Go', 'TudoAzul'],
  },
  {
    code: 'DL',
    nome: 'Delta Air Lines',
    pais: 'Estados Unidos',
    alianca: 'skyteam',
    cor: '#dc2626',
    programaProprio: 'SkyMiles',
    programas: ['SkyMiles', 'Flying Blue', 'Aeroméxico Premier', 'Virgin Points'],
  },
  {
    code: 'AS',
    nome: 'Alaska Airlines',
    pais: 'Estados Unidos',
    alianca: 'oneworld',
    cor: '#14b8a6',
    programaProprio: 'Alaska Mileage Plan',
    programas: ['Alaska Mileage Plan', 'AAdvantage', 'British Avios', 'Qantas', 'LATAM Pass'],
  },
  {
    code: 'B6',
    nome: 'JetBlue',
    pais: 'Estados Unidos',
    alianca: 'nenhuma',
    cor: '#6366f1',
    programaProprio: 'TrueBlue',
    programas: ['TrueBlue'],
  },
  {
    code: 'WN',
    nome: 'Southwest',
    pais: 'Estados Unidos',
    alianca: 'nenhuma',
    cor: '#facc15',
    programaProprio: 'Rapid Rewards',
    programas: ['Rapid Rewards'],
  },
  {
    code: 'NK',
    nome: 'Spirit Airlines',
    pais: 'Estados Unidos',
    alianca: 'nenhuma',
    cor: '#eab308',
    programaProprio: 'Free Spirit',
    programas: ['Free Spirit'],
  },
  {
    code: 'AC',
    nome: 'Air Canada',
    pais: 'Canadá',
    alianca: 'star',
    cor: '#ef4444',
    programaProprio: 'Aeroplan',
    programas: ['Aeroplan', 'MileagePlus', 'LifeMiles', 'TAP Miles&Go'],
  },
  {
    code: 'WS',
    nome: 'WestJet',
    pais: 'Canadá',
    alianca: 'nenhuma',
    cor: '#22d3ee',
    programaProprio: 'WestJet Rewards',
    programas: ['WestJet Rewards', 'SkyMiles'],
  },
  {
    code: 'AM',
    nome: 'Aeroméxico',
    pais: 'México',
    alianca: 'skyteam',
    cor: '#8b5cf6',
    programaProprio: 'Aeroméxico Premier',
    programas: ['Aeroméxico Premier', 'SkyMiles', 'Flying Blue'],
  },
  {
    code: 'Y4',
    nome: 'Volaris',
    pais: 'México',
    alianca: 'nenhuma',
    cor: '#a855f7',
    programaProprio: 'v.club',
    programas: [],
  },
  {
    code: 'CM',
    nome: 'Copa Airlines',
    pais: 'Panamá',
    alianca: 'star',
    cor: '#1d4ed8',
    programaProprio: 'ConnectMiles',
    programas: ['ConnectMiles', 'LifeMiles', 'MileagePlus', 'Aeroplan', 'TAP Miles&Go'],
  },
  {
    code: 'AV',
    nome: 'Avianca',
    pais: 'Colômbia',
    alianca: 'star',
    cor: '#e11d48',
    programaProprio: 'LifeMiles',
    programas: ['LifeMiles', 'MileagePlus', 'Aeroplan', 'TAP Miles&Go'],
  },
  {
    code: 'AR',
    nome: 'Aerolíneas Argentinas',
    pais: 'Argentina',
    alianca: 'skyteam',
    cor: '#0891b2',
    programaProprio: 'Aerolíneas Plus',
    programas: ['Aerolíneas Plus', 'SkyMiles', 'Flying Blue'],
  },
  {
    code: 'H2',
    nome: 'Sky Airline',
    pais: 'Chile',
    alianca: 'nenhuma',
    cor: '#84cc16',
    programaProprio: 'Sky Plus',
    programas: [],
  },
  {
    code: 'JA',
    nome: 'JetSMART',
    pais: 'Chile/Argentina',
    alianca: 'nenhuma',
    cor: '#f59e0b',
    programaProprio: 'SMART Club',
    programas: ['AAdvantage'],
  },
];

export const airlineByCode: ReadonlyMap<string, Airline> = new Map(
  airlines.map((a) => [a.code, a]),
);

export function getAirline(code: string): Airline | undefined {
  return airlineByCode.get(code.toUpperCase());
}

/** Todos os programas que aparecem na base, ordenados alfabeticamente. */
export const PROGRAMAS = Array.from(
  new Set(airlines.flatMap((a) => a.programas)),
).sort((a, b) => a.localeCompare(b, 'pt-BR'));

/** Cor de fallback para companhia fora da curadoria. */
export const COR_DESCONHECIDA = '#a1a1aa';

export function corDaCompanhia(codigo: string): string {
  return airlineByCode.get(codigo)?.cor ?? COR_DESCONHECIDA;
}

/**
 * Nome de exibição: prefere a curadoria, cai para o dicionário da Amadeus e,
 * em último caso, mostra o próprio código — nunca inventa.
 */
export function nomeDaCompanhia(codigo: string, nomeDaApi?: string): string {
  const curado = airlineByCode.get(codigo)?.nome;
  if (curado) return curado;
  if (!nomeDaApi) return codigo;

  // A Amadeus devolve o nome em caixa alta ("DELTA AIR LINES").
  return nomeDaApi
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|[\s/-])(\p{L})/gu, (_, antes, letra: string) => antes + letra.toLocaleUpperCase('pt-BR'));
}

/**
 * Programas que emitem todos os trechos de um itinerário.
 *
 * Devolve lista vazia — e não um palpite — quando alguma companhia do trajeto
 * está fora da curadoria.
 */
export function programasDoItinerario(codigos: string[]): string[] {
  if (codigos.length === 0) return [];

  const porCompanhia = codigos.map((c) => airlineByCode.get(c)?.programas);
  if (porCompanhia.some((p) => p === undefined)) return [];

  return (porCompanhia as string[][])
    .reduce((comuns, programas) => comuns.filter((p) => programas.includes(p)))
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

/** Alguma companhia do trajeto está fora da curadoria de programas? */
export function temCompanhiaForaDaCuradoria(codigos: string[]): boolean {
  return codigos.some((c) => !airlineByCode.has(c));
}
