/**
 * Consulta de exemplo pela linha de comando, útil para conferir a base sem
 * abrir o navegador.
 *
 *   npx tsx scripts/consulta-exemplo.ts ATL Brasil 17:00
 *   npx tsx scripts/consulta-exemplo.ts GRU Caribe
 */

import { airportByIata, airports } from '@/lib/flights/airports';
import { formatDuration } from '@/lib/flights/geo';
import { type Alvo, buscarItinerarios } from '@/lib/flights/network';
import { chegadaLocal, formatHourMinute, parseHourMinute } from '@/lib/flights/time';

const [, , origemArg = 'ATL', destinoArg = 'Brasil', limiteArg, partidaArg = '08:00'] =
  process.argv;

const origem = origemArg.toUpperCase();
if (!airportByIata.has(origem)) {
  console.error(`Aeroporto de origem desconhecido: ${origem}`);
  process.exit(1);
}

function resolverDestino(valor: string): Alvo {
  const iata = valor.toUpperCase();
  if (iata.length === 3 && airportByIata.has(iata)) return { tipo: 'aeroporto', valor: iata };

  const pais = airports.find((a) => a.pais.toLowerCase() === valor.toLowerCase());
  if (pais) return { tipo: 'pais', valor: pais.pais };

  const regiao = airports.find((a) => a.regiao.toLowerCase() === valor.toLowerCase());
  if (regiao) return { tipo: 'regiao', valor: regiao.regiao };

  console.error(`Destino desconhecido: ${valor}`);
  process.exit(1);
}

const alvo = resolverDestino(destinoArg);
const partidaMin = parseHourMinute(partidaArg) ?? 8 * 60;
const limite = limiteArg ? parseHourMinute(limiteArg) : null;

const hoje = new Date();
const data = new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()));
const aeroportoOrigem = airportByIata.get(origem)!;

const itinerarios = buscarItinerarios({ origens: [origem], alvo, maxParadas: 2, limite: 200 });

// Guarda o melhor de cada cidade, como a tela faz nas buscas por país/região.
const melhores = new Map<string, (typeof itinerarios)[number]>();
for (const it of itinerarios) {
  if (!melhores.has(it.destino)) melhores.set(it.destino, it);
}

console.log(
  `\n${origem} → ${alvo.valor} · saindo ${partidaArg} (hora local de ${aeroportoOrigem.cidade})` +
    (limiteArg ? ` · chegar até ${limiteArg}` : ''),
);
console.log('─'.repeat(96));

let dentro = 0;
for (const it of melhores.values()) {
  const destino = airportByIata.get(it.destino)!;
  const chegada = chegadaLocal(data, aeroportoOrigem.tz, partidaMin, destino.tz, it.minutosTotal);
  const noPrazo = limite === null || (chegada.diaSeguinte === 0 && chegada.minutos <= limite);
  if (limite !== null && !noPrazo) continue;
  dentro++;

  const rota = [it.segmentos[0].de, ...it.segmentos.map((s) => s.para)].join(' → ');
  const dia = chegada.diaSeguinte > 0 ? `+${chegada.diaSeguinte}` : '  ';

  console.log(
    `${rota.padEnd(22)} ${formatDuration(it.minutosTotal).padStart(6)}  ` +
      `chega ${formatHourMinute(chegada.minutos)}${dia}  ` +
      `${destino.cidade.padEnd(18)} ${it.programas.slice(0, 3).join(', ') || '—'}`,
  );
}

console.log('─'.repeat(96));
console.log(
  limite === null
    ? `${melhores.size} cidades alcançáveis`
    : `${dentro} de ${melhores.size} cidades chegam até ${limiteArg}`,
);
