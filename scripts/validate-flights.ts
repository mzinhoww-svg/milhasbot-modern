import { airports, airportByIata } from '@/lib/flights/airports';
import { airlines } from '@/lib/flights/airlines';
import { routes } from '@/lib/flights/routes';
import {
  TOTAL_ROTAS,
  TOTAL_AEROPORTOS,
  buscarItinerarios,
  destinosDiretos,
  malhaDaCompanhia,
  quemVoa,
} from '@/lib/flights/network';
import { chegadaLocal, formatHourMinute } from '@/lib/flights/time';
import { distanceKm } from '@/lib/flights/geo';

let falhas = 0;
const erro = (msg: string) => {
  console.error('  ✗', msg);
  falhas++;
};

console.log('== integridade da base ==');

// IATAs referenciados nas rotas precisam existir.
const desconhecidos = new Set<string>();
for (const [codigo, malha] of Object.entries(routes)) {
  if (!airlines.some((a) => a.code === codigo)) erro(`companhia sem cadastro: ${codigo}`);
  for (const [base, destinos] of malha) {
    if (!airportByIata.has(base)) desconhecidos.add(base);
    for (const d of destinos) if (!airportByIata.has(d)) desconhecidos.add(d);
  }
}
if (desconhecidos.size > 0) erro(`IATA em rotas sem aeroporto: ${[...desconhecidos].join(', ')}`);

// Aeroportos órfãos (cadastrados mas sem nenhuma rota).
const orfaos = airports.filter((a) => destinosDiretos(a.iata).length === 0);
if (orfaos.length > 0) erro(`aeroportos sem rota: ${orfaos.map((a) => a.iata).join(', ')}`);

// Fusos precisam ser válidos para o Intl.
for (const a of airports) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: a.tz }).format(new Date());
  } catch {
    erro(`fuso inválido em ${a.iata}: ${a.tz}`);
  }
}

// Coordenadas dentro da janela do mapa.
for (const a of airports) {
  if (a.lat < -56 || a.lat > 66 || a.lon < -172 || a.lon > -32) {
    erro(`${a.iata} fora da janela do mapa (${a.lat}, ${a.lon})`);
  }
}

// IATAs duplicados.
const contagem = new Map<string, number>();
for (const a of airports) contagem.set(a.iata, (contagem.get(a.iata) ?? 0) + 1);
for (const [iata, n] of contagem) if (n > 1) erro(`IATA duplicado: ${iata} (${n}x)`);

console.log(`  aeroportos: ${airports.length} • no grafo: ${TOTAL_AEROPORTOS}`);
console.log(`  companhias: ${airlines.length} • rotas únicas: ${TOTAL_ROTAS}`);

console.log('\n== distâncias de referência ==');
const checarDistancia = (a: string, b: string, esperado: number, tolerancia = 0.06) => {
  const x = airportByIata.get(a)!;
  const y = airportByIata.get(b)!;
  const km = distanceKm(x.lat, x.lon, y.lat, y.lon);
  const desvio = Math.abs(km - esperado) / esperado;
  const ok = desvio <= tolerancia;
  console.log(`  ${a}-${b}: ${km.toFixed(0)} km (esperado ~${esperado}) ${ok ? '✓' : '✗'}`);
  if (!ok) erro(`distância ${a}-${b} fora do esperado`);
};
checarDistancia('GRU', 'MIA', 6570);
checarDistancia('GRU', 'GIG', 358);
checarDistancia('JFK', 'LAX', 3983);
checarDistancia('ATL', 'GRU', 7360);
checarDistancia('SCL', 'LIM', 2460);

console.log('\n== busca: ATL → Brasil, chegando em GRU até 17:00 ==');
const itinerarios = buscarItinerarios({
  origens: ['ATL'],
  alvo: { tipo: 'pais', valor: 'Brasil' },
  maxParadas: 1,
  limite: 8,
});
if (itinerarios.length === 0) erro('nenhum itinerário ATL → Brasil');

const data = new Date(Date.UTC(2026, 8, 15));
for (const it of itinerarios.slice(0, 6)) {
  const rota = [it.segmentos[0].de, ...it.segmentos.map((s) => s.para)].join(' → ');
  const chegada = chegadaLocal(data, 'America/New_York', 8 * 60, airportByIata.get(it.destino)!.tz, it.minutosTotal);
  const dia = chegada.diaSeguinte > 0 ? ` +${chegada.diaSeguinte}d` : '';
  console.log(
    `  ${rota.padEnd(20)} ${String(it.paradas)}p ${(it.minutosTotal / 60).toFixed(1).padStart(5)}h  ` +
      `chega ${formatHourMinute(chegada.minutos)}${dia}  desvio ${it.desvio.toFixed(2)}  ` +
      `programas: ${it.programas.slice(0, 3).join(', ') || '—'}`,
  );
}

console.log('\n== sanidade de trechos conhecidos ==');
const esperaVoo = (a: string, b: string, cia: string) => {
  const ok = quemVoa(a, b).includes(cia);
  console.log(`  ${cia} ${a}-${b}: ${ok ? '✓' : '✗'}`);
  if (!ok) erro(`${cia} deveria voar ${a}-${b}`);
};
esperaVoo('GRU', 'MIA', 'LA');
esperaVoo('MIA', 'GRU', 'AA');
esperaVoo('PTY', 'GRU', 'CM');
esperaVoo('VCP', 'FLL', 'AD');
esperaVoo('BOG', 'MDE', 'AV');

console.log('\n== tamanho das malhas ==');
for (const a of airlines) {
  const n = malhaDaCompanhia(a.code).length;
  if (n === 0) erro(`${a.code} sem rotas`);
  console.log(`  ${a.code} ${a.nome.padEnd(24)} ${String(n).padStart(4)} rotas`);
}

console.log(falhas === 0 ? '\n✓ base consistente' : `\n✗ ${falhas} problema(s)`);
process.exit(falhas === 0 ? 0 : 1);
