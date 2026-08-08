import { airportByIata, airports } from '@/lib/flights/airports';
import { formatDuration } from '@/lib/flights/geo';
import {
  TOTAL_ARESTAS,
  TOTAL_AEROPORTOS_COM_ROTA,
  buscarCriativo,
  nomeCompanhia,
} from '@/lib/flights/network';

function metro(cidade: string, cc: string): string[] {
  return airports.filter((a) => a.cidade === cidade && a.cc === cc).map((a) => a.iata);
}

function mostrar(titulo: string, its: ReturnType<typeof buscarCriativo>, n = 8) {
  console.log(`\n== ${titulo} ==`);
  if (its.length === 0) return console.log('  (nenhum)');
  for (const it of its.slice(0, n)) {
    const rota = [it.origem, ...it.passos.map((p) => (p.tipo === 'traslado' ? `[${p.para}]` : p.para))].join(' → ');
    const cias = it.companhiasUnicas.length
      ? `1 cia: ${it.companhiasUnicas.map(nomeCompanhia).join('/')}`
      : it.companhiasTodas.map(nomeCompanhia).slice(0, 4).join(', ');
    console.log(
      `  ${rota.padEnd(34)} ${it.voos}v${it.traslados ? `+${it.traslados}t` : '  '} ` +
        `${formatDuration(it.minutosTotal).padStart(6)}  ${it.kmTotal.toLocaleString('pt-BR')}km  [${cias}]`,
    );
  }
}

console.log(`malha: ${TOTAL_ARESTAS} arestas, ${TOTAL_AEROPORTOS_COM_ROTA} aeroportos`);

// Caso 1: MSP -> ATL (direto costuma estar cheio; achar alternativas via hub)
mostrar(
  'MSP → ATL (rotas alternativas ao direto)',
  buscarCriativo({ origem: 'MSP', destinos: ['ATL'], maxVoos: 2, limite: 10 }),
);

const viaBNA = buscarCriativo({ origem: 'MSP', destinos: ['ATL'], maxVoos: 2, limite: 50 }).find((it) =>
  it.conexoes.includes('BNA'),
);
console.log(`\n  >> MSP→BNA→ATL encontrado? ${viaBNA ? 'SIM' : 'não'}`);

// Caso 2: ATL -> Cuiabá (CGB). Comparar via GIG e via LIM, e o traslado GRU/CGH.
mostrar(
  'ATL → CGB (Cuiabá) — opções criativas',
  buscarCriativo({ origem: 'ATL', destinos: ['CGB'], maxVoos: 3, limite: 12 }),
  12,
);

const paraCGB = buscarCriativo({ origem: 'ATL', destinos: ['CGB'], maxVoos: 3, limite: 200 });
const viaGig = paraCGB.find((it) => it.conexoes.includes('GIG'));
const viaLim = paraCGB.find((it) => it.conexoes.includes('LIM'));
const comTraslado = paraCGB.find((it) => it.traslados > 0);
console.log(`\n  >> via GIG (o que serviu): ${viaGig ? [viaGig.origem, ...viaGig.passos.map((p) => p.para)].join('→') + ' em ' + formatDuration(viaGig.minutosTotal) : 'não achou'}`);
console.log(`  >> via LIM (o que não deu tempo): ${viaLim ? [viaLim.origem, ...viaLim.passos.map((p) => p.para)].join('→') + ' em ' + formatDuration(viaLim.minutosTotal) : 'não achou'}`);
console.log(`  >> alguma com traslado terrestre (troca de aeroporto): ${comTraslado ? comTraslado.conexoes.join('→') + ' (t=' + comTraslado.traslados + ')' : 'não'}`);

// Caso 3: destino por cidade inteira (São Paulo = GRU+CGH+VCP) a partir de MIA
mostrar(
  'MIA → São Paulo (cidade inteira: GRU/CGH/VCP)',
  buscarCriativo({ origem: 'MIA', destinos: metro('São Paulo', 'BR'), maxVoos: 2, limite: 8 }),
);
