/**
 * Malha de rotas nas Américas, por companhia.
 *
 * Formato: para cada companhia, uma lista de `[base, [destinos...]]`. As rotas
 * são tratadas como bidirecionais e deduplicadas ao montar o grafo, então não
 * há problema em repetir um par nas duas pontas (GRU→BSB e BSB→GRU) quando os
 * dois aeroportos são bases da mesma companhia.
 *
 * Escopo: apenas trechos dentro das Américas. Voos transatlânticos e
 * transpacíficos ficaram de fora de propósito — o recorte é o que mantém o
 * grafo pequeno e as buscas instantâneas.
 *
 * Esta é uma base curada de referência para planejamento, não o inventário ao
 * vivo das companhias. Frequências mudam por temporada; confirme o voo no site
 * da companhia antes de emitir.
 */

export const ROUTES_REVISAO = 'julho/2026';

export type AirlineRoutes = [base: string, destinos: string[]][];

export const routes: Record<string, AirlineRoutes> = {
  // ------------------------------------------------------------------ LATAM
  LA: [
    ['GRU', ['BSB', 'CNF', 'GIG', 'POA', 'CWB', 'FLN', 'SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'JPA', 'AJU', 'BEL', 'MAO', 'SLZ', 'THE', 'CGB', 'CGR', 'GYN', 'VIX', 'IGU', 'BPS', 'NVT', 'JOI', 'LDB', 'MGF', 'RAO', 'UDI', 'PMW', 'PVH', 'RBR', 'STM', 'SCL', 'LIM', 'BOG', 'EZE', 'MVD', 'ASU', 'VVI', 'MIA', 'JFK', 'LAX', 'MCO', 'CUN', 'MEX', 'PUJ']],
    ['CGH', ['SDU', 'BSB', 'CNF', 'GIG', 'POA', 'CWB', 'FLN', 'SSA', 'REC', 'VIX', 'GYN', 'CGB', 'CGR', 'NVT', 'IGU', 'LDB', 'MGF', 'RAO', 'UDI', 'BPS', 'JOI']],
    ['GIG', ['BSB', 'CNF', 'POA', 'CWB', 'FLN', 'SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'BEL', 'MAO', 'GYN', 'VIX', 'CGB', 'IGU', 'BPS', 'NVT', 'SCL', 'EZE', 'LIM', 'MIA', 'JFK', 'CUN']],
    ['SDU', ['BSB', 'CNF', 'CGH']],
    ['BSB', ['SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'JPA', 'AJU', 'BEL', 'MAO', 'SLZ', 'THE', 'CGB', 'CGR', 'GYN', 'PMW', 'PVH', 'RBR', 'VIX', 'POA', 'CWB', 'FLN', 'CNF', 'IGU', 'BPS', 'UDI']],
    ['CNF', ['SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'POA', 'CWB', 'FLN', 'VIX', 'GYN', 'CGB', 'BPS', 'IGU', 'UDI', 'MAO', 'BEL']],
    ['SCL', ['LIM', 'BOG', 'EZE', 'MVD', 'ASU', 'VVI', 'LPB', 'ANF', 'CJC', 'PMC', 'IPC', 'BRC', 'MDZ', 'COR', 'CUZ', 'GYE', 'UIO', 'MIA', 'JFK', 'LAX', 'MEX', 'CUN', 'POA', 'CWB', 'FLN', 'IGU']],
    ['LIM', ['BOG', 'MDE', 'CLO', 'UIO', 'GYE', 'EZE', 'MVD', 'ASU', 'VVI', 'LPB', 'CUZ', 'AQP', 'MIA', 'JFK', 'LAX', 'MEX', 'CUN', 'SJO', 'PTY', 'CTG']],
    ['BOG', ['MDE', 'CTG', 'CLO', 'BAQ', 'SMR', 'PEI', 'ADZ', 'UIO', 'GYE', 'EZE', 'MIA', 'MEX', 'CUN', 'PTY']],
    ['EZE', ['MVD', 'ASU', 'VVI', 'COR', 'MDZ', 'BRC', 'USH', 'IGR', 'MIA', 'CUN', 'PUJ', 'AEP']],
    ['UIO', ['GYE', 'GPS']],
    ['GYE', ['GPS']],
  ],

  // -------------------------------------------------------------------- GOL
  G3: [
    ['GRU', ['BSB', 'CNF', 'GIG', 'SDU', 'POA', 'CWB', 'FLN', 'SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'JPA', 'AJU', 'BEL', 'MAO', 'SLZ', 'THE', 'CGB', 'CGR', 'GYN', 'VIX', 'IGU', 'BPS', 'NVT', 'JOI', 'LDB', 'MGF', 'RAO', 'UDI', 'PMW', 'PVH', 'RBR', 'MIA', 'MCO', 'FLL', 'CUN', 'PUJ', 'EZE', 'AEP', 'MVD', 'ASU', 'SCL', 'BOG']],
    ['CGH', ['SDU', 'BSB', 'CNF', 'POA', 'CWB', 'FLN', 'SSA', 'REC', 'VIX', 'GYN', 'CGB', 'CGR', 'NVT', 'JOI', 'LDB', 'MGF', 'RAO', 'UDI', 'IGU', 'BPS']],
    ['GIG', ['BSB', 'CNF', 'POA', 'CWB', 'FLN', 'SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'BEL', 'MAO', 'GYN', 'VIX', 'IGU', 'BPS', 'NVT', 'EZE', 'AEP', 'MVD', 'MCO', 'MIA']],
    ['BSB', ['SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'JPA', 'AJU', 'BEL', 'MAO', 'SLZ', 'THE', 'CGB', 'CGR', 'GYN', 'PMW', 'PVH', 'RBR', 'BVB', 'VIX', 'POA', 'CWB', 'FLN', 'CNF', 'IGU', 'UDI', 'BPS']],
    ['CNF', ['SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'POA', 'CWB', 'FLN', 'VIX', 'GYN', 'CGB', 'BPS', 'IGU', 'UDI', 'SLZ', 'THE', 'JPA', 'AJU']],
    ['SSA', ['REC', 'FOR', 'MCZ', 'AJU', 'POA', 'CWB', 'FLN', 'VIX', 'BPS']],
    ['FOR', ['REC', 'NAT', 'JPA', 'SLZ', 'THE', 'BEL', 'MAO', 'MCZ']],
  ],

  // ------------------------------------------------------------------- Azul
  AD: [
    ['VCP', ['BSB', 'CNF', 'GIG', 'SDU', 'POA', 'CWB', 'FLN', 'SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'JPA', 'AJU', 'BEL', 'MAO', 'SLZ', 'THE', 'CGB', 'CGR', 'GYN', 'VIX', 'IGU', 'BPS', 'NVT', 'JOI', 'LDB', 'MGF', 'RAO', 'UDI', 'CXJ', 'PMW', 'PVH', 'RBR', 'STM', 'MCP', 'BVB', 'FLL', 'MCO', 'CUN', 'PUJ', 'EZE', 'AEP', 'MVD', 'ASU', 'SCL']],
    ['CGH', ['SDU', 'CNF', 'CWB', 'POA', 'FLN', 'NVT', 'JOI', 'LDB', 'MGF', 'RAO', 'UDI', 'GYN', 'CGB']],
    ['CNF', ['SDU', 'GIG', 'POA', 'CWB', 'FLN', 'SSA', 'REC', 'FOR', 'NAT', 'MCZ', 'JPA', 'AJU', 'VIX', 'GYN', 'CGB', 'CGR', 'BPS', 'IGU', 'UDI', 'SLZ', 'THE', 'BEL', 'NVT', 'JOI', 'LDB', 'CXJ']],
    ['REC', ['FOR', 'NAT', 'JPA', 'MCZ', 'AJU', 'SSA', 'SLZ', 'THE', 'BEL', 'GIG', 'BSB', 'FLL', 'MCO']],
    ['FOR', ['NAT', 'JPA', 'SLZ', 'THE', 'BEL', 'MAO', 'MCZ', 'BSB', 'GIG', 'FLL']],
    ['MAO', ['BEL', 'STM', 'MCP', 'BVB', 'PVH', 'RBR', 'BSB', 'GIG', 'FLL']],
    ['BEL', ['STM', 'MCP', 'SLZ', 'THE', 'BSB', 'GIG', 'FLL']],
    ['GIG', ['BSB', 'POA', 'CWB', 'FLN', 'SSA', 'VIX', 'GYN', 'NVT', 'BPS']],
  ],

  // --------------------------------------------------------------- American
  AA: [
    ['DFW', ['ORD', 'CLT', 'PHL', 'MIA', 'PHX', 'LAX', 'JFK', 'LGA', 'DCA', 'BOS', 'SFO', 'SEA', 'DEN', 'LAS', 'MCO', 'TPA', 'FLL', 'ATL', 'IAH', 'AUS', 'SAT', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CVG', 'CLE', 'PIT', 'RDU', 'MSP', 'DTW', 'SLC', 'SAN', 'PDX', 'SMF', 'SJC', 'OAK', 'HNL', 'ANC', 'YYZ', 'YUL', 'YVR', 'YYC', 'MEX', 'CUN', 'GDL', 'MTY', 'SJD', 'PVR', 'BJX', 'MID', 'PTY', 'SJO', 'LIR', 'GUA', 'SAL', 'SAP', 'TGU', 'MGA', 'BZE', 'BOG', 'LIM', 'GRU', 'EZE', 'SCL', 'SJU', 'PUJ', 'SDQ', 'MBJ', 'NAS', 'GCM', 'AUA', 'CUR', 'POS', 'BGI', 'STT', 'PLS', 'RSW', 'PBI', 'JAX', 'BWI', 'IAD', 'HOU', 'MDW', 'YWG', 'YOW', 'YHZ']],
    ['CLT', ['MIA', 'ORD', 'PHL', 'JFK', 'LGA', 'DCA', 'BOS', 'LAX', 'SFO', 'SEA', 'DEN', 'LAS', 'PHX', 'MCO', 'TPA', 'FLL', 'RSW', 'PBI', 'JAX', 'ATL', 'IAH', 'AUS', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CVG', 'CLE', 'PIT', 'RDU', 'MSP', 'DTW', 'SLC', 'SAN', 'PDX', 'BWI', 'IAD', 'YYZ', 'YUL', 'CUN', 'MEX', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'SJU', 'GCM', 'AUA', 'PLS', 'BZE', 'SJO', 'GUA', 'SAL']],
    ['MIA', ['JFK', 'LGA', 'BOS', 'PHL', 'DCA', 'ORD', 'LAX', 'SFO', 'SEA', 'DEN', 'LAS', 'ATL', 'IAH', 'MCO', 'TPA', 'RDU', 'BWI', 'IAD', 'CLE', 'PIT', 'MSP', 'DTW', 'STL', 'MCI', 'IND', 'CVG', 'BNA', 'MSY', 'SAT', 'AUS', 'YYZ', 'YUL', 'MEX', 'CUN', 'GDL', 'MTY', 'MID', 'PTY', 'SJO', 'LIR', 'GUA', 'SAL', 'SAP', 'TGU', 'MGA', 'BZE', 'BOG', 'MDE', 'CTG', 'CLO', 'BAQ', 'PEI', 'LIM', 'UIO', 'GYE', 'CCS', 'GEO', 'PBM', 'GRU', 'GIG', 'EZE', 'SCL', 'MVD', 'ASU', 'VVI', 'LPB', 'SJU', 'PUJ', 'SDQ', 'STI', 'MBJ', 'KIN', 'NAS', 'GCM', 'HAV', 'AUA', 'CUR', 'SXM', 'POS', 'BGI', 'ANU', 'UVF', 'GND', 'PAP', 'STT', 'PLS', 'PTP', 'FDF']],
    ['PHL', ['ORD', 'BOS', 'JFK', 'LGA', 'DCA', 'LAX', 'SFO', 'SEA', 'DEN', 'LAS', 'PHX', 'MCO', 'TPA', 'FLL', 'RSW', 'PBI', 'JAX', 'ATL', 'IAH', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CVG', 'CLE', 'PIT', 'RDU', 'MSP', 'DTW', 'SLC', 'SAN', 'PDX', 'YYZ', 'YUL', 'YHZ', 'CUN', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'SJU', 'AUA', 'STT', 'PLS', 'GCM']],
    ['PHX', ['LAX', 'SFO', 'SAN', 'SEA', 'PDX', 'LAS', 'DEN', 'SLC', 'SMF', 'SJC', 'OAK', 'ORD', 'JFK', 'LGA', 'BOS', 'DCA', 'IAD', 'MCO', 'TPA', 'FLL', 'ATL', 'IAH', 'AUS', 'SAT', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'MSP', 'DTW', 'HNL', 'ANC', 'YVR', 'YYC', 'YEG', 'MEX', 'GDL', 'SJD', 'PVR', 'CUN', 'MTY']],
    ['JFK', ['LAX', 'SFO', 'SEA', 'SAN', 'LAS', 'ORD', 'MIA', 'MCO', 'TPA', 'FLL', 'BOS', 'DCA', 'IAD', 'SJU', 'STT', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'STI', 'AUA', 'CUR', 'BGI', 'POS', 'ANU', 'GCM', 'PLS', 'GRU', 'EZE', 'SCL', 'LIM', 'BOG', 'MEX', 'CUN', 'YYZ', 'YUL']],
    ['LAX', ['SFO', 'SAN', 'SJC', 'OAK', 'SMF', 'SEA', 'PDX', 'LAS', 'PHX', 'DEN', 'SLC', 'ORD', 'BOS', 'DCA', 'IAD', 'MIA', 'MCO', 'ATL', 'IAH', 'AUS', 'MSY', 'HNL', 'ANC', 'YVR', 'YYC', 'MEX', 'GDL', 'SJD', 'PVR', 'CUN', 'MTY', 'BJX', 'GUA', 'SAL', 'SJO', 'LIM']],
    ['DCA', ['ORD', 'BOS', 'MIA', 'MCO', 'TPA', 'FLL', 'ATL', 'DFW', 'DEN', 'LAS', 'RDU', 'CLE', 'PIT', 'IND', 'CVG', 'BNA', 'STL', 'MCI', 'MSY', 'MSP', 'DTW', 'YYZ', 'YUL', 'NAS']],
  ],

  // ----------------------------------------------------------------- United
  UA: [
    ['ORD', ['EWR', 'IAD', 'DEN', 'IAH', 'SFO', 'LAX', 'SEA', 'PDX', 'SAN', 'SJC', 'OAK', 'SMF', 'LAS', 'PHX', 'SLC', 'MSP', 'DTW', 'CLE', 'PIT', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'SAT', 'ATL', 'CLT', 'RDU', 'BOS', 'JFK', 'LGA', 'DCA', 'BWI', 'PHL', 'MIA', 'FLL', 'MCO', 'TPA', 'RSW', 'PBI', 'JAX', 'HNL', 'ANC', 'YYZ', 'YUL', 'YVR', 'YYC', 'YEG', 'YWG', 'YOW', 'YHZ', 'MEX', 'CUN', 'GDL', 'MTY', 'SJD', 'PVR', 'PTY', 'SJO', 'LIR', 'GUA', 'SAL', 'BZE', 'NAS', 'MBJ', 'PUJ', 'SJU', 'GCM', 'AUA', 'BOG', 'MDW']],
    ['DEN', ['ORD', 'EWR', 'IAD', 'IAH', 'SFO', 'LAX', 'SEA', 'PDX', 'SAN', 'SJC', 'OAK', 'SMF', 'LAS', 'PHX', 'SLC', 'MSP', 'DTW', 'CLE', 'PIT', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'SAT', 'DFW', 'ATL', 'CLT', 'RDU', 'BOS', 'JFK', 'LGA', 'DCA', 'BWI', 'PHL', 'MIA', 'FLL', 'MCO', 'TPA', 'RSW', 'JAX', 'HNL', 'ANC', 'YVR', 'YYC', 'YEG', 'YYZ', 'MEX', 'CUN', 'GDL', 'SJD', 'PVR', 'MTY', 'SJO', 'LIR', 'GUA', 'BZE', 'PTY', 'NAS', 'MBJ', 'PUJ', 'SJU']],
    ['IAH', ['ORD', 'EWR', 'IAD', 'DEN', 'SFO', 'LAX', 'SEA', 'PDX', 'SAN', 'SJC', 'LAS', 'PHX', 'SLC', 'MSP', 'DTW', 'CLE', 'PIT', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'SAT', 'DFW', 'ATL', 'CLT', 'RDU', 'BOS', 'JFK', 'LGA', 'DCA', 'BWI', 'PHL', 'MIA', 'FLL', 'MCO', 'TPA', 'RSW', 'JAX', 'HNL', 'YYZ', 'YUL', 'YVR', 'YYC', 'MEX', 'CUN', 'GDL', 'MTY', 'SJD', 'PVR', 'BJX', 'QRO', 'MID', 'PTY', 'SJO', 'LIR', 'GUA', 'SAL', 'SAP', 'TGU', 'MGA', 'BZE', 'BOG', 'LIM', 'UIO', 'GYE', 'SJU', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'GCM', 'AUA', 'CUR', 'GRU', 'EZE', 'SCL']],
    ['EWR', ['ORD', 'IAD', 'DEN', 'IAH', 'SFO', 'LAX', 'SEA', 'PDX', 'SAN', 'SJC', 'LAS', 'PHX', 'SLC', 'MSP', 'DTW', 'CLE', 'PIT', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'SAT', 'DFW', 'ATL', 'CLT', 'RDU', 'BOS', 'DCA', 'MIA', 'FLL', 'MCO', 'TPA', 'RSW', 'PBI', 'JAX', 'HNL', 'YYZ', 'YUL', 'YVR', 'YYC', 'YOW', 'YHZ', 'MEX', 'CUN', 'SJD', 'PVR', 'PTY', 'SJO', 'LIR', 'GUA', 'SAL', 'BZE', 'BOG', 'LIM', 'UIO', 'SJU', 'STT', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'GCM', 'AUA', 'CUR', 'SXM', 'BGI', 'ANU', 'POS', 'GRU', 'EZE', 'SCL']],
    ['SFO', ['ORD', 'EWR', 'IAD', 'DEN', 'IAH', 'LAX', 'SAN', 'SEA', 'PDX', 'LAS', 'PHX', 'SLC', 'SMF', 'SJC', 'MSP', 'DTW', 'STL', 'MCI', 'AUS', 'DFW', 'ATL', 'BOS', 'JFK', 'DCA', 'MCO', 'MIA', 'HNL', 'ANC', 'YVR', 'YYC', 'MEX', 'GDL', 'SJD', 'PVR', 'CUN']],
    ['IAD', ['ORD', 'EWR', 'DEN', 'IAH', 'SFO', 'LAX', 'SEA', 'LAS', 'PHX', 'MSP', 'DTW', 'CLE', 'PIT', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'DFW', 'ATL', 'CLT', 'RDU', 'BOS', 'MIA', 'FLL', 'MCO', 'TPA', 'YYZ', 'YUL', 'YOW', 'CUN', 'MEX', 'PTY', 'SJO', 'SJU', 'NAS', 'MBJ', 'PUJ']],
    ['LAX', ['SFO', 'SAN', 'SJC', 'OAK', 'SMF', 'SEA', 'PDX', 'LAS', 'PHX', 'DEN', 'SLC', 'ORD', 'EWR', 'IAD', 'IAH', 'BOS', 'JFK', 'DCA', 'MCO', 'MIA', 'ATL', 'AUS', 'HNL', 'ANC', 'YVR', 'YYC', 'MEX', 'GDL', 'SJD', 'PVR', 'CUN']],
  ],

  // ------------------------------------------------------------------ Delta
  DL: [
    ['ATL', ['JFK', 'LGA', 'BOS', 'DCA', 'IAD', 'BWI', 'PHL', 'ORD', 'MDW', 'DTW', 'MSP', 'SLC', 'LAX', 'SFO', 'SEA', 'PDX', 'SAN', 'SJC', 'SMF', 'OAK', 'LAS', 'PHX', 'DEN', 'DFW', 'IAH', 'HOU', 'AUS', 'SAT', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CVG', 'CLE', 'PIT', 'RDU', 'CLT', 'MIA', 'FLL', 'MCO', 'TPA', 'RSW', 'PBI', 'JAX', 'HNL', 'ANC', 'YYZ', 'YUL', 'YVR', 'YYC', 'YOW', 'YHZ', 'MEX', 'CUN', 'GDL', 'MTY', 'SJD', 'PVR', 'MID', 'PTY', 'SJO', 'LIR', 'GUA', 'SAL', 'SAP', 'TGU', 'MGA', 'BZE', 'BOG', 'LIM', 'UIO', 'GYE', 'GRU', 'GIG', 'EZE', 'SCL', 'SJU', 'STT', 'NAS', 'MBJ', 'KIN', 'PUJ', 'SDQ', 'STI', 'GCM', 'AUA', 'CUR', 'SXM', 'POS', 'BGI', 'ANU', 'PLS', 'PAP']],
    ['DTW', ['ATL', 'JFK', 'LGA', 'BOS', 'DCA', 'IAD', 'BWI', 'PHL', 'ORD', 'MSP', 'SLC', 'LAX', 'SFO', 'SEA', 'PDX', 'SAN', 'LAS', 'PHX', 'DEN', 'DFW', 'IAH', 'AUS', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CVG', 'CLE', 'PIT', 'RDU', 'CLT', 'MIA', 'FLL', 'MCO', 'TPA', 'RSW', 'PBI', 'JAX', 'YYZ', 'YUL', 'YVR', 'YYC', 'YOW', 'MEX', 'CUN', 'SJD', 'PVR', 'NAS', 'MBJ', 'PUJ', 'SJU', 'GCM', 'AUA']],
    ['MSP', ['ATL', 'DTW', 'JFK', 'LGA', 'BOS', 'DCA', 'IAD', 'BWI', 'PHL', 'ORD', 'SLC', 'LAX', 'SFO', 'SEA', 'PDX', 'SAN', 'LAS', 'PHX', 'DEN', 'DFW', 'IAH', 'AUS', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CVG', 'CLE', 'PIT', 'RDU', 'CLT', 'MIA', 'FLL', 'MCO', 'TPA', 'RSW', 'HNL', 'ANC', 'YYZ', 'YUL', 'YVR', 'YYC', 'YWG', 'YEG', 'MEX', 'CUN', 'SJD', 'PVR', 'NAS', 'MBJ', 'PUJ', 'SJU', 'GCM', 'LIR', 'SJO']],
    ['SLC', ['ATL', 'DTW', 'MSP', 'JFK', 'BOS', 'DCA', 'ORD', 'LAX', 'SFO', 'SEA', 'PDX', 'SAN', 'SJC', 'OAK', 'SMF', 'LAS', 'PHX', 'DEN', 'DFW', 'IAH', 'AUS', 'MCI', 'STL', 'BNA', 'MSY', 'RDU', 'CLT', 'MCO', 'TPA', 'FLL', 'MIA', 'HNL', 'ANC', 'YVR', 'YYC', 'YEG', 'MEX', 'CUN', 'SJD', 'PVR', 'GDL', 'MTY', 'LIR', 'SJO']],
    ['JFK', ['ATL', 'DTW', 'MSP', 'SLC', 'LAX', 'SFO', 'SEA', 'SAN', 'LAS', 'PHX', 'DEN', 'AUS', 'MSY', 'RDU', 'CLT', 'MCO', 'TPA', 'FLL', 'MIA', 'PBI', 'RSW', 'JAX', 'BOS', 'DCA', 'IAD', 'ORD', 'HNL', 'YYZ', 'YUL', 'MEX', 'CUN', 'SJU', 'STT', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'STI', 'GCM', 'AUA', 'CUR', 'SXM', 'BGI', 'ANU', 'POS', 'PLS', 'PAP', 'BOG', 'LIM', 'GRU', 'EZE', 'SCL']],
    ['LAX', ['ATL', 'DTW', 'MSP', 'SLC', 'JFK', 'BOS', 'DCA', 'ORD', 'SFO', 'SEA', 'PDX', 'SAN', 'SJC', 'OAK', 'SMF', 'LAS', 'PHX', 'DEN', 'DFW', 'IAH', 'AUS', 'HNL', 'ANC', 'YVR', 'YYC', 'MEX', 'CUN', 'GDL', 'SJD', 'PVR', 'MTY', 'LIM']],
    ['SEA', ['ATL', 'DTW', 'MSP', 'SLC', 'JFK', 'BOS', 'DCA', 'ORD', 'LAX', 'SFO', 'PDX', 'SAN', 'SJC', 'OAK', 'SMF', 'LAS', 'PHX', 'DEN', 'DFW', 'IAH', 'AUS', 'MCO', 'HNL', 'ANC', 'YVR', 'YYC', 'MEX', 'CUN', 'SJD', 'PVR']],
    ['BOS', ['ATL', 'DTW', 'MSP', 'SLC', 'JFK', 'LGA', 'DCA', 'BWI', 'PHL', 'ORD', 'LAX', 'SFO', 'SEA', 'SAN', 'LAS', 'PHX', 'DEN', 'DFW', 'IAH', 'AUS', 'MCO', 'TPA', 'FLL', 'MIA', 'RSW', 'PBI', 'JAX', 'RDU', 'CLT', 'MSY', 'BNA', 'YYZ', 'YUL', 'CUN', 'PUJ', 'SJU', 'NAS', 'MBJ', 'AUA']],
  ],

  // ----------------------------------------------------------------- Alaska
  AS: [
    ['SEA', ['PDX', 'ANC', 'SFO', 'SJC', 'OAK', 'LAX', 'SAN', 'SMF', 'LAS', 'PHX', 'SLC', 'DEN', 'ORD', 'MDW', 'MSP', 'DTW', 'STL', 'MCI', 'IND', 'BNA', 'AUS', 'SAT', 'DFW', 'IAH', 'HOU', 'ATL', 'CLT', 'RDU', 'BOS', 'JFK', 'EWR', 'LGA', 'DCA', 'IAD', 'BWI', 'PHL', 'MCO', 'TPA', 'FLL', 'MIA', 'HNL', 'YVR', 'YYC', 'YEG', 'MEX', 'CUN', 'SJD', 'PVR', 'GDL', 'BZE', 'LIR', 'SJO', 'NAS']],
    ['PDX', ['SEA', 'ANC', 'SFO', 'SJC', 'OAK', 'LAX', 'SAN', 'SMF', 'LAS', 'PHX', 'SLC', 'DEN', 'ORD', 'MSP', 'DTW', 'STL', 'MCI', 'BNA', 'AUS', 'DFW', 'IAH', 'ATL', 'BOS', 'JFK', 'EWR', 'DCA', 'IAD', 'MCO', 'TPA', 'HNL', 'YVR', 'YYC', 'MEX', 'SJD', 'PVR', 'LIR']],
    ['SFO', ['SEA', 'PDX', 'ANC', 'LAX', 'SAN', 'LAS', 'PHX', 'SLC', 'DEN', 'ORD', 'MSP', 'AUS', 'DFW', 'IAH', 'ATL', 'BOS', 'JFK', 'EWR', 'DCA', 'IAD', 'MCO', 'HNL', 'YVR', 'MEX', 'SJD', 'PVR', 'CUN']],
    ['LAX', ['SEA', 'PDX', 'ANC', 'SFO', 'SJC', 'OAK', 'SMF', 'SAN', 'LAS', 'PHX', 'SLC', 'DEN', 'ORD', 'MSP', 'AUS', 'DFW', 'IAH', 'ATL', 'BOS', 'JFK', 'EWR', 'DCA', 'IAD', 'MCO', 'TPA', 'MIA', 'HNL', 'YVR', 'YYC', 'MEX', 'SJD', 'PVR', 'GDL', 'CUN', 'LIR', 'SJO']],
    ['ANC', ['SEA', 'PDX', 'SFO', 'LAX', 'LAS', 'PHX', 'DEN', 'ORD', 'MSP', 'HNL']],
  ],

  // ---------------------------------------------------------------- JetBlue
  B6: [
    ['JFK', ['BOS', 'DCA', 'IAD', 'BWI', 'PHL', 'ORD', 'MDW', 'DTW', 'MSP', 'CLE', 'PIT', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'SAT', 'DFW', 'IAH', 'HOU', 'DEN', 'SLC', 'LAS', 'PHX', 'LAX', 'SFO', 'SJC', 'OAK', 'SMF', 'SAN', 'SEA', 'PDX', 'ATL', 'CLT', 'RDU', 'JAX', 'MCO', 'TPA', 'FLL', 'MIA', 'PBI', 'RSW', 'SJU', 'STT', 'STX', 'NAS', 'MBJ', 'KIN', 'PUJ', 'SDQ', 'STI', 'GCM', 'AUA', 'CUR', 'SXM', 'BGI', 'ANU', 'POS', 'UVF', 'GND', 'PAP', 'PLS', 'CUN', 'SJO', 'LIR', 'GUA', 'BZE', 'YYZ', 'YUL', 'BOG', 'LIM']],
    ['BOS', ['JFK', 'LGA', 'DCA', 'IAD', 'BWI', 'PHL', 'ORD', 'MDW', 'DTW', 'MSP', 'CLE', 'PIT', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'DFW', 'IAH', 'HOU', 'DEN', 'SLC', 'LAS', 'PHX', 'LAX', 'SFO', 'SJC', 'SAN', 'SEA', 'PDX', 'ATL', 'CLT', 'RDU', 'JAX', 'MCO', 'TPA', 'FLL', 'MIA', 'PBI', 'RSW', 'SJU', 'STT', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'GCM', 'AUA', 'CUR', 'SXM', 'BGI', 'ANU', 'PLS', 'CUN', 'SJO', 'LIR', 'BZE', 'YYZ']],
    ['FLL', ['JFK', 'BOS', 'LGA', 'DCA', 'IAD', 'BWI', 'PHL', 'ORD', 'DTW', 'CLE', 'PIT', 'IND', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'DFW', 'IAH', 'HOU', 'DEN', 'LAS', 'LAX', 'SFO', 'ATL', 'CLT', 'RDU', 'SJU', 'STT', 'NAS', 'MBJ', 'KIN', 'PUJ', 'SDQ', 'STI', 'GCM', 'AUA', 'CUR', 'SXM', 'BGI', 'POS', 'UVF', 'GND', 'PAP', 'PLS', 'CUN', 'SJO', 'LIR', 'GUA', 'SAL', 'BZE', 'MGA', 'BOG', 'MDE', 'CTG', 'LIM', 'GYE', 'UIO']],
    ['MCO', ['JFK', 'BOS', 'LGA', 'EWR', 'DCA', 'IAD', 'BWI', 'PHL', 'ORD', 'DTW', 'CLE', 'PIT', 'IND', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'DFW', 'IAH', 'DEN', 'LAS', 'LAX', 'SFO', 'ATL', 'CLT', 'RDU', 'SJU', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'GCM', 'CUN', 'SJO', 'BZE']],
    ['SJU', ['JFK', 'BOS', 'FLL', 'MCO', 'EWR', 'BWI', 'PHL', 'TPA', 'STT', 'STX', 'SDQ', 'STI', 'PUJ', 'SXM', 'AUA', 'CUR', 'POS', 'BGI', 'ANU', 'UVF', 'GND', 'PAP']],
  ],

  // -------------------------------------------------------------- Southwest
  WN: [
    ['MDW', ['DEN', 'LAS', 'PHX', 'BWI', 'HOU', 'AUS', 'SAT', 'MCO', 'TPA', 'FLL', 'RSW', 'PBI', 'JAX', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CLE', 'PIT', 'DTW', 'MSP', 'ATL', 'CLT', 'RDU', 'DCA', 'PHL', 'BOS', 'LGA', 'SAN', 'LAX', 'SJC', 'OAK', 'SMF', 'SFO', 'SEA', 'PDX', 'SLC', 'CUN', 'MBJ', 'NAS']],
    ['DEN', ['MDW', 'LAS', 'PHX', 'BWI', 'HOU', 'AUS', 'SAT', 'MCO', 'TPA', 'FLL', 'RSW', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CLE', 'PIT', 'DTW', 'MSP', 'ATL', 'CLT', 'RDU', 'DCA', 'PHL', 'BOS', 'LGA', 'SAN', 'LAX', 'SJC', 'OAK', 'SMF', 'SFO', 'SEA', 'PDX', 'SLC', 'DFW', 'IAH', 'CUN', 'SJD', 'PVR']],
    ['LAS', ['MDW', 'DEN', 'PHX', 'BWI', 'HOU', 'AUS', 'SAT', 'MCO', 'TPA', 'FLL', 'RSW', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CLE', 'PIT', 'DTW', 'MSP', 'ATL', 'CLT', 'RDU', 'DCA', 'PHL', 'BOS', 'LGA', 'SAN', 'LAX', 'SJC', 'OAK', 'SMF', 'SFO', 'SEA', 'PDX', 'SLC', 'DFW', 'HNL']],
    ['BWI', ['MDW', 'DEN', 'LAS', 'PHX', 'HOU', 'AUS', 'SAT', 'MCO', 'TPA', 'FLL', 'RSW', 'PBI', 'JAX', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CLE', 'PIT', 'DTW', 'MSP', 'ATL', 'CLT', 'RDU', 'BOS', 'LGA', 'SAN', 'LAX', 'SFO', 'SEA', 'CUN', 'NAS', 'MBJ', 'SJU', 'PUJ', 'AUA']],
    ['HOU', ['MDW', 'DEN', 'LAS', 'PHX', 'BWI', 'AUS', 'SAT', 'MCO', 'TPA', 'FLL', 'RSW', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CLE', 'PIT', 'DTW', 'MSP', 'ATL', 'CLT', 'RDU', 'DCA', 'PHL', 'BOS', 'LGA', 'SAN', 'LAX', 'SJC', 'OAK', 'SMF', 'SFO', 'SEA', 'PDX', 'SLC', 'CUN', 'MTY', 'SJD', 'PVR', 'BZE', 'SJO', 'GCM', 'MBJ', 'NAS']],
    ['PHX', ['MDW', 'DEN', 'LAS', 'BWI', 'HOU', 'AUS', 'SAT', 'MCO', 'TPA', 'FLL', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CLE', 'PIT', 'DTW', 'MSP', 'ATL', 'CLT', 'RDU', 'DCA', 'PHL', 'BOS', 'SAN', 'LAX', 'SJC', 'OAK', 'SMF', 'SFO', 'SEA', 'PDX', 'SLC', 'HNL', 'SJD', 'PVR']],
    ['MCO', ['MDW', 'DEN', 'LAS', 'BWI', 'HOU', 'PHX', 'AUS', 'SAT', 'MSY', 'BNA', 'STL', 'MCI', 'IND', 'CLE', 'PIT', 'DTW', 'MSP', 'ATL', 'CLT', 'RDU', 'DCA', 'PHL', 'BOS', 'LGA', 'TPA', 'FLL', 'RSW', 'JAX', 'SJU', 'NAS', 'MBJ', 'PUJ', 'GCM', 'CUN']],
  ],

  // ----------------------------------------------------------------- Spirit
  NK: [
    ['FLL', ['MCO', 'TPA', 'JAX', 'ATL', 'CLT', 'RDU', 'BWI', 'DCA', 'PHL', 'EWR', 'LGA', 'BOS', 'PIT', 'CLE', 'DTW', 'ORD', 'MDW', 'MSP', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'IAH', 'HOU', 'DFW', 'AUS', 'SAT', 'DEN', 'LAS', 'PHX', 'LAX', 'SAN', 'SJC', 'OAK', 'SFO', 'SEA', 'SJU', 'STT', 'NAS', 'MBJ', 'KIN', 'PUJ', 'SDQ', 'STI', 'GCM', 'AUA', 'CUR', 'SXM', 'POS', 'PAP', 'PLS', 'CUN', 'MID', 'SJO', 'LIR', 'GUA', 'SAL', 'SAP', 'TGU', 'MGA', 'BZE', 'BOG', 'MDE', 'CTG', 'CLO', 'BAQ', 'LIM', 'GYE', 'UIO', 'PTY']],
    ['MCO', ['FLL', 'TPA', 'ATL', 'CLT', 'RDU', 'BWI', 'DCA', 'PHL', 'EWR', 'LGA', 'BOS', 'PIT', 'CLE', 'DTW', 'ORD', 'MDW', 'MSP', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'IAH', 'DFW', 'AUS', 'DEN', 'LAS', 'LAX', 'SJU', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'GCM', 'CUN', 'SJO', 'GUA', 'SAL', 'BOG', 'MDE', 'CTG', 'LIM']],
    ['DTW', ['FLL', 'MCO', 'TPA', 'ATL', 'CLT', 'RDU', 'BWI', 'DCA', 'PHL', 'EWR', 'LGA', 'BOS', 'ORD', 'MSP', 'STL', 'MCI', 'BNA', 'MSY', 'IAH', 'DFW', 'AUS', 'DEN', 'LAS', 'PHX', 'LAX', 'SAN', 'SEA', 'CUN', 'MBJ', 'PUJ', 'SJU']],
    ['LAS', ['FLL', 'MCO', 'TPA', 'ATL', 'CLT', 'BWI', 'DCA', 'PHL', 'EWR', 'BOS', 'ORD', 'MDW', 'DTW', 'MSP', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'IAH', 'HOU', 'DFW', 'AUS', 'SAT', 'DEN', 'PHX', 'LAX', 'SAN', 'SJC', 'OAK', 'SFO', 'SMF', 'SEA', 'PDX', 'SLC', 'GDL', 'SJD', 'PVR', 'CUN']],
  ],

  // ------------------------------------------------------------- Air Canada
  AC: [
    ['YYZ', ['YUL', 'YOW', 'YQB', 'YHZ', 'YWG', 'YYC', 'YEG', 'YVR', 'JFK', 'LGA', 'EWR', 'BOS', 'DCA', 'IAD', 'BWI', 'PHL', 'ORD', 'DTW', 'MSP', 'CLE', 'PIT', 'IND', 'CVG', 'STL', 'MCI', 'BNA', 'MSY', 'AUS', 'SAT', 'DFW', 'IAH', 'HOU', 'DEN', 'SLC', 'LAS', 'PHX', 'LAX', 'SFO', 'SJC', 'SAN', 'SEA', 'PDX', 'ATL', 'CLT', 'RDU', 'MCO', 'TPA', 'FLL', 'MIA', 'RSW', 'PBI', 'JAX', 'HNL', 'MEX', 'CUN', 'GDL', 'SJD', 'PVR', 'PTY', 'SJO', 'LIR', 'GUA', 'SAL', 'BZE', 'BOG', 'LIM', 'GRU', 'GIG', 'EZE', 'SCL', 'SJU', 'NAS', 'MBJ', 'KIN', 'PUJ', 'SDQ', 'GCM', 'AUA', 'CUR', 'SXM', 'BGI', 'ANU', 'POS', 'UVF', 'GND', 'PLS', 'PTP', 'FDF', 'STT']],
    ['YUL', ['YYZ', 'YOW', 'YQB', 'YHZ', 'YWG', 'YYC', 'YEG', 'YVR', 'JFK', 'LGA', 'EWR', 'BOS', 'DCA', 'IAD', 'PHL', 'ORD', 'DTW', 'MSP', 'CLE', 'STL', 'MCI', 'BNA', 'DFW', 'IAH', 'DEN', 'LAS', 'PHX', 'LAX', 'SFO', 'SEA', 'ATL', 'CLT', 'RDU', 'MCO', 'TPA', 'FLL', 'MIA', 'RSW', 'PBI', 'MEX', 'CUN', 'SJD', 'PVR', 'PTY', 'SJO', 'LIR', 'BOG', 'LIM', 'GRU', 'SJU', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'GCM', 'AUA', 'CUR', 'SXM', 'BGI', 'ANU', 'POS', 'UVF', 'PLS', 'PTP', 'FDF']],
    ['YVR', ['YYZ', 'YUL', 'YYC', 'YEG', 'YWG', 'YOW', 'YHZ', 'SEA', 'PDX', 'SFO', 'SJC', 'LAX', 'SAN', 'LAS', 'PHX', 'DEN', 'SLC', 'ORD', 'IAH', 'DFW', 'JFK', 'EWR', 'BOS', 'IAD', 'ATL', 'MCO', 'HNL', 'ANC', 'MEX', 'CUN', 'SJD', 'PVR', 'LIR', 'SJO', 'PTY']],
    ['YYC', ['YYZ', 'YUL', 'YVR', 'YEG', 'YWG', 'YOW', 'YHZ', 'SEA', 'PDX', 'SFO', 'LAX', 'SAN', 'LAS', 'PHX', 'DEN', 'SLC', 'ORD', 'IAH', 'DFW', 'JFK', 'EWR', 'MCO', 'HNL', 'MEX', 'CUN', 'SJD', 'PVR', 'LIR']],
  ],

  // ---------------------------------------------------------------- WestJet
  WS: [
    ['YYC', ['YVR', 'YEG', 'YWG', 'YYZ', 'YUL', 'YOW', 'YQB', 'YHZ', 'SEA', 'PDX', 'SFO', 'LAX', 'SAN', 'LAS', 'PHX', 'DEN', 'SLC', 'ORD', 'MSP', 'DTW', 'IAH', 'DFW', 'ATL', 'JFK', 'EWR', 'BOS', 'MCO', 'TPA', 'FLL', 'MIA', 'RSW', 'PBI', 'HNL', 'MEX', 'CUN', 'SJD', 'PVR', 'PTY', 'LIR', 'SJO', 'BZE', 'NAS', 'MBJ', 'PUJ', 'SDQ', 'GCM', 'AUA', 'CUR', 'SXM', 'BGI', 'POS', 'PLS']],
    ['YVR', ['YYC', 'YEG', 'YWG', 'YYZ', 'YUL', 'YOW', 'YHZ', 'SEA', 'PDX', 'SFO', 'LAX', 'SAN', 'LAS', 'PHX', 'DEN', 'ORD', 'MCO', 'HNL', 'CUN', 'SJD', 'PVR', 'LIR', 'MBJ']],
    ['YEG', ['YYC', 'YVR', 'YWG', 'YYZ', 'YUL', 'YOW', 'YHZ', 'LAS', 'PHX', 'LAX', 'SFO', 'DEN', 'ORD', 'MCO', 'CUN', 'SJD', 'PVR', 'MBJ', 'PUJ']],
    ['YYZ', ['YWG', 'YOW', 'YQB', 'YHZ', 'LAS', 'PHX', 'LAX', 'MCO', 'TPA', 'FLL', 'MIA', 'RSW', 'CUN', 'MBJ', 'PUJ', 'SDQ', 'NAS', 'GCM', 'AUA', 'SXM', 'BGI', 'POS', 'PLS', 'LIR', 'SJO']],
  ],

  // ------------------------------------------------------------- Aeroméxico
  AM: [
    ['MEX', ['CUN', 'GDL', 'MTY', 'TIJ', 'SJD', 'PVR', 'MID', 'BJX', 'QRO', 'LAX', 'SFO', 'SAN', 'SJC', 'LAS', 'PHX', 'DEN', 'SLC', 'ORD', 'MDW', 'DTW', 'MSP', 'IAH', 'DFW', 'AUS', 'SAT', 'MSY', 'ATL', 'CLT', 'RDU', 'JFK', 'EWR', 'LGA', 'BOS', 'DCA', 'IAD', 'PHL', 'MIA', 'FLL', 'MCO', 'TPA', 'YYZ', 'YUL', 'YVR', 'YYC', 'HAV', 'GUA', 'SAL', 'SJO', 'PTY', 'MGA', 'TGU', 'SAP', 'BZE', 'BOG', 'MDE', 'LIM', 'UIO', 'GYE', 'SCL', 'EZE', 'GRU', 'MVD', 'CCS', 'PUJ', 'SDQ', 'SJU', 'ADZ']],
    ['GDL', ['MEX', 'CUN', 'MTY', 'TIJ', 'SJD', 'PVR', 'MID', 'BJX', 'LAX', 'SFO', 'SJC', 'SAN', 'LAS', 'PHX', 'DEN', 'ORD', 'IAH', 'DFW', 'AUS', 'SAT', 'ATL', 'JFK', 'SEA', 'PDX', 'SMF', 'OAK']],
    ['MTY', ['MEX', 'CUN', 'GDL', 'TIJ', 'SJD', 'MID', 'LAX', 'LAS', 'PHX', 'DEN', 'ORD', 'IAH', 'DFW', 'AUS', 'SAT', 'ATL', 'JFK', 'DTW', 'MCO', 'MIA']],
  ],

  // ---------------------------------------------------------------- Volaris
  Y4: [
    ['MEX', ['CUN', 'GDL', 'MTY', 'TIJ', 'SJD', 'PVR', 'MID', 'BJX', 'QRO', 'LAX', 'SFO', 'SJC', 'OAK', 'SAN', 'SMF', 'LAS', 'PHX', 'DEN', 'ORD', 'MDW', 'IAH', 'HOU', 'DFW', 'AUS', 'SAT', 'MCO', 'MIA', 'JFK', 'EWR', 'SEA', 'PDX', 'GUA', 'SAL', 'SJO', 'MGA', 'TGU', 'SAP', 'BOG', 'LIM']],
    ['GDL', ['MEX', 'CUN', 'MTY', 'TIJ', 'SJD', 'PVR', 'MID', 'BJX', 'LAX', 'SFO', 'SJC', 'OAK', 'SAN', 'SMF', 'LAS', 'PHX', 'DEN', 'ORD', 'MDW', 'IAH', 'HOU', 'DFW', 'AUS', 'SAT', 'MCO', 'SEA', 'PDX', 'GUA', 'SAL']],
    ['TIJ', ['MEX', 'GDL', 'CUN', 'MTY', 'SJD', 'PVR', 'MID', 'BJX', 'QRO']],
    ['NLU', ['CUN', 'GDL', 'MTY', 'TIJ', 'SJD', 'PVR', 'MID', 'BJX']],
    ['CUN', ['MEX', 'GDL', 'MTY', 'TIJ', 'NLU', 'BJX', 'QRO', 'GUA', 'SAL', 'SJO', 'BOG', 'LIM', 'MDE']],
  ],

  // ------------------------------------------------------------------- Copa
  CM: [
    ['PTY', ['MEX', 'CUN', 'GDL', 'MTY', 'MID', 'GUA', 'SAL', 'SAP', 'TGU', 'MGA', 'SJO', 'LIR', 'BZE', 'HAV', 'SJU', 'PUJ', 'SDQ', 'STI', 'MBJ', 'KIN', 'NAS', 'GCM', 'AUA', 'CUR', 'BGI', 'POS', 'PAP', 'BOG', 'MDE', 'CTG', 'CLO', 'BAQ', 'PEI', 'SMR', 'ADZ', 'CCS', 'GEO', 'PBM', 'UIO', 'GYE', 'LIM', 'CUZ', 'AQP', 'LPB', 'VVI', 'ASU', 'MVD', 'EZE', 'AEP', 'COR', 'MDZ', 'ROS', 'SCL', 'GRU', 'GIG', 'BSB', 'CNF', 'POA', 'CWB', 'SSA', 'REC', 'FOR', 'MAO', 'BEL', 'MIA', 'FLL', 'MCO', 'TPA', 'JFK', 'EWR', 'BOS', 'IAD', 'ORD', 'MDW', 'DFW', 'IAH', 'LAX', 'SFO', 'LAS', 'DEN', 'ATL', 'CLT', 'RDU', 'MSY', 'BWI', 'YYZ', 'YUL', 'PDP']],
  ],

  // ---------------------------------------------------------------- Avianca
  AV: [
    ['BOG', ['MDE', 'CTG', 'CLO', 'BAQ', 'SMR', 'PEI', 'ADZ', 'LIM', 'CUZ', 'UIO', 'GYE', 'CCS', 'GEO', 'PTY', 'SJO', 'GUA', 'SAL', 'SAP', 'TGU', 'MGA', 'MEX', 'CUN', 'HAV', 'PUJ', 'SDQ', 'SJU', 'AUA', 'CUR', 'MIA', 'FLL', 'MCO', 'JFK', 'EWR', 'IAD', 'BOS', 'ORD', 'DFW', 'IAH', 'LAX', 'SFO', 'YYZ', 'YUL', 'GRU', 'GIG', 'EZE', 'AEP', 'SCL', 'MVD', 'ASU', 'VVI', 'LPB', 'PDP']],
    ['SAL', ['GUA', 'SAP', 'TGU', 'MGA', 'SJO', 'PTY', 'MEX', 'CUN', 'MIA', 'FLL', 'MCO', 'JFK', 'EWR', 'IAD', 'IAH', 'DFW', 'LAX', 'SFO', 'ORD', 'BOG', 'LIM']],
    ['SJO', ['GUA', 'SAL', 'MGA', 'PTY', 'MEX', 'CUN', 'MIA', 'FLL', 'MCO', 'JFK', 'IAH', 'LAX', 'BOG', 'LIM']],
    ['UIO', ['GYE', 'GPS', 'BOG', 'LIM']],
    ['LIM', ['CUZ', 'AQP', 'BOG', 'MDE', 'UIO', 'GYE', 'SCL', 'EZE', 'AEP', 'MVD', 'ASU', 'VVI', 'LPB', 'GRU', 'PTY', 'SJO', 'SAL', 'MEX', 'MIA', 'JFK']],
  ],

  // ------------------------------------------------- Aerolíneas Argentinas
  AR: [
    ['AEP', ['COR', 'MDZ', 'ROS', 'BRC', 'USH', 'IGR', 'MVD', 'PDP', 'ASU', 'SCL', 'LIM', 'VVI', 'LPB', 'GRU', 'GIG', 'FLN', 'POA', 'CWB', 'CGH', 'SSA', 'REC', 'FOR', 'MCZ', 'BPS', 'IGU', 'EZE']],
    ['EZE', ['COR', 'MDZ', 'BRC', 'USH', 'IGR', 'MVD', 'ASU', 'SCL', 'LIM', 'BOG', 'PTY', 'CUN', 'PUJ', 'MIA', 'JFK', 'GRU', 'GIG', 'SSA', 'REC', 'FOR', 'VVI', 'CCS']],
  ],

  // -------------------------------------------------------------- Sky Chile
  H2: [
    ['SCL', ['ANF', 'CJC', 'PMC', 'IPC', 'LIM', 'CUZ', 'AQP', 'EZE', 'AEP', 'COR', 'MDZ', 'ROS', 'MVD', 'ASU', 'VVI', 'LPB', 'GRU', 'GIG', 'FLN', 'POA', 'CWB', 'BOG', 'MDE', 'CTG', 'PUJ', 'CUN', 'PTY', 'SJO', 'GYE', 'UIO', 'BRC']],
    ['LIM', ['CUZ', 'AQP', 'SCL', 'ANF', 'BOG', 'MDE', 'GYE', 'UIO', 'EZE', 'AEP', 'MVD', 'ASU', 'VVI', 'LPB', 'GRU', 'PUJ', 'CUN', 'SJO', 'PTY', 'CTG']],
  ],

  // --------------------------------------------------------------- JetSMART
  JA: [
    ['SCL', ['ANF', 'CJC', 'PMC', 'EZE', 'AEP', 'COR', 'MDZ', 'ROS', 'BRC', 'USH', 'IGR', 'MVD', 'PDP', 'ASU', 'LIM', 'CUZ', 'AQP', 'VVI', 'LPB', 'GRU', 'GIG', 'FLN', 'POA', 'CWB', 'CGH', 'SSA', 'BOG', 'MDE', 'CTG', 'GYE', 'UIO']],
    ['AEP', ['COR', 'MDZ', 'ROS', 'BRC', 'USH', 'IGR', 'SCL', 'MVD', 'PDP', 'ASU', 'LIM', 'GRU', 'GIG', 'FLN', 'POA', 'CWB', 'SSA', 'BPS', 'IGU', 'EZE']],
    ['LIM', ['CUZ', 'AQP', 'SCL', 'BOG', 'MDE', 'GYE', 'UIO', 'EZE', 'AEP', 'GRU', 'MVD', 'ASU', 'VVI']],
  ],
};
