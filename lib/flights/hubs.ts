/**
 * Principais portões de entrada das Américas, para priorizar quais aeroportos
 * consultar numa busca por país ou região.
 *
 * Por quê curadoria e não dado: o OurAirports classifica porte (grande/médio),
 * mas não tráfego. "Grande" sozinho não distingue GRU de um regional grande, e
 * ordem alfabética faria a busca gastar cota em BVB/BPS antes de GRU/GIG. Esta
 * lista é editorial e datada, como a de programas de milhas — resolve a ordem,
 * não inventa rota.
 *
 * Quem não está aqui não é excluído: entra depois dos hubs, priorizando os de
 * grande porte.
 */

/** Ordem importa: o índice vira a prioridade. */
export const HUBS: string[] = [
  // Brasil
  'GRU', 'GIG', 'BSB', 'CNF', 'VCP', 'CGH', 'SDU', 'REC', 'FOR', 'SSA', 'POA', 'CWB', 'MAO', 'BEL',
  // América do Sul
  'EZE', 'AEP', 'SCL', 'LIM', 'BOG', 'MDE', 'UIO', 'GYE', 'MVD', 'ASU', 'VVI', 'CCS',
  // México
  'MEX', 'CUN', 'GDL', 'MTY', 'TIJ',
  // América Central e Caribe
  'PTY', 'SJO', 'GUA', 'SAL', 'SJU', 'PUJ', 'SDQ', 'HAV', 'NAS', 'MBJ',
  // América do Norte
  'ATL', 'JFK', 'EWR', 'LGA', 'MIA', 'FLL', 'MCO', 'ORD', 'DFW', 'IAH', 'LAX', 'SFO',
  'BOS', 'DCA', 'IAD', 'SEA', 'DEN', 'LAS', 'PHX', 'CLT', 'YYZ', 'YUL', 'YVR', 'YYC',
];

const RANK = new Map(HUBS.map((iata, i) => [iata, i]));

/**
 * Prioridade de consulta: hubs primeiro (na ordem da lista), depois aeroportos
 * de grande porte, depois o resto. Menor número = mais prioritário.
 */
export function prioridadeHub(iata: string, grande: boolean): number {
  const rank = RANK.get(iata);
  if (rank !== undefined) return rank;
  return HUBS.length + (grande ? 0 : 1_000);
}
