/**
 * Gera lib/flights/routes.data.ts a partir do OpenFlights.
 *
 *   node scripts/gerar-rotas.mjs
 *
 * OpenFlights (routes.dat) é a malha de voos diretos por companhia, aberta e
 * verificável. É o que permite montar rotas criativas de vários trechos por
 * hubs não óbvios — o cerne da busca para viagem de staff/não-revenue, onde o
 * que importa é existir conexão, não o preço.
 *
 * Recorte: só entram trechos sem escala (stops=0) entre aeroportos que já estão
 * na base do OurAirports (lib/flights/airports.data.ts), mantendo as duas bases
 * consistentes. É um snapshot de referência de topologia, não horário ao vivo.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTE_ROTAS = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat';
const FONTE_CIAS = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat';
const SAIDA = path.join(RAIZ, 'lib/flights/routes.data.ts');

async function baixar(url) {
  const r = await fetch(url);
  if (!r.ok) {
    console.error(`Falha ao baixar ${url}: HTTP ${r.status}`);
    process.exit(1);
  }
  return r.text();
}

// IATAs válidos = os da base de aeroportos já gerada.
const airportsTs = fs.readFileSync(path.join(RAIZ, 'lib/flights/airports.data.ts'), 'utf8');
const IATAS = new Set([...airportsTs.matchAll(/^ {2}\['([A-Z]{3})'/gm)].map((m) => m[1]));

// Nomes de companhia do OpenFlights: id-IATA-ICAO-nome. Guarda por IATA.
const nomesCias = new Map();
for (const linha of (await baixar(FONTE_CIAS)).split('\n')) {
  // "324","All Nippon Airways","ANA All Nippon...","NH","ANA","...","Japan","Y"
  const campos = linha.split(',').map((c) => c.replace(/^"|"$/g, ''));
  const [, nome, , iata, , , , ativo] = campos;
  if (/^[A-Z0-9]{2}$/.test(iata) && nome && ativo === 'Y' && !nomesCias.has(iata)) {
    nomesCias.set(iata, nome);
  }
}

// Arestas direcionais: chave "SRC>DST" → set de companhias.
const arestas = new Map();
let ignoradasForaBase = 0;

for (const linha of (await baixar(FONTE_ROTAS)).split('\n')) {
  const c = linha.split(',');
  if (c.length < 9) continue;

  const cia = c[0];
  const src = c[2];
  const dst = c[4];
  const stops = c[7];

  if (stops !== '0') continue;
  if (!/^[A-Z0-9]{2}$/.test(cia)) continue;
  if (!IATAS.has(src) || !IATAS.has(dst)) {
    ignoradasForaBase++;
    continue;
  }

  const chave = `${src}>${dst}`;
  const atual = arestas.get(chave);
  if (atual) atual.add(cia);
  else arestas.set(chave, new Set([cia]));
}

// Só entram companhias que aparecem em alguma aresta.
const ciasUsadas = new Set();
for (const cias of arestas.values()) for (const c of cias) ciasUsadas.add(c);

const nomes = [...ciasUsadas]
  .sort()
  .filter((c) => nomesCias.has(c))
  .map((c) => `  ${JSON.stringify(c)}: ${JSON.stringify(nomesCias.get(c))},`)
  .join('\n');

const linhasArestas = [...arestas.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([chave, cias]) => {
    const [src, dst] = chave.split('>');
    return `  ['${src}','${dst}','${[...cias].sort().join(' ')}'],`;
  })
  .join('\n');

const conteudo = `/**
 * Malha de voos diretos das Américas — ARQUIVO GERADO.
 *
 * Fonte: OpenFlights routes.dat (${FONTE_ROTAS}), aberto.
 * Só trechos sem escala entre aeroportos da base do OurAirports.
 *
 * Não edite à mão: rode \`npm run flights:rotas\` para regerar.
 * ${arestas.size} arestas direcionais, ${ciasUsadas.size} companhias.
 *
 * É topologia de referência (quais companhias fazem cada trecho direto), não
 * horário ao vivo. Códigos de companhia seguem o snapshot do OpenFlights.
 */

/** [origem, destino, "CIA1 CIA2 ..."] — direcional. */
export type RouteTuple = [string, string, string];

export const FONTE_ROTAS = '${FONTE_ROTAS}';

/** Nome das companhias por código IATA (quando conhecido no OpenFlights). */
export const CIAS: Record<string, string> = {
${nomes}
};

export const ROUTE_TUPLES: RouteTuple[] = [
${linhasArestas}
];
`;

fs.writeFileSync(SAIDA, conteudo);

console.log(`arestas direcionais: ${arestas.size}`);
console.log(`companhias: ${ciasUsadas.size} (com nome: ${[...ciasUsadas].filter((c) => nomesCias.has(c)).length})`);
console.log(`ignoradas por aeroporto fora da base: ${ignoradasForaBase}`);
console.log(`escrito em ${path.relative(RAIZ, SAIDA)}`);
