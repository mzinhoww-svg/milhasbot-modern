/**
 * Gera lib/flights/airports.data.ts a partir do OurAirports.
 *
 *   node scripts/gerar-aeroportos.mjs
 *
 * OurAirports é domínio público e atualizado continuamente pela comunidade.
 * Ficam só aeroportos das Américas com serviço regular declarado e código IATA
 * — é o recorte que faz sentido para busca de passagem.
 *
 * O fuso vem de tz-lookup (lat/lon → IANA), não de tabela escrita à mão.
 * O nome do país vem do Intl, para não depender de tradução manual.
 *
 * O arquivo gerado é versionado de propósito: o build não depende de rede.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tzLookup from 'tz-lookup';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTE = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const SAIDA = path.join(RAIZ, 'lib/flights/airports.data.ts');

// ---------------------------------------------------------------- CSV

/** Parser de CSV com aspas — o arquivo tem vírgulas dentro de nomes. */
function parseCsv(texto) {
  const linhas = [];
  let campo = '';
  let linha = [];
  let dentroDeAspas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];

    if (dentroDeAspas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          dentroDeAspas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') dentroDeAspas = true;
    else if (c === ',') {
      linha.push(campo);
      campo = '';
    } else if (c === '\n') {
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = '';
    } else if (c !== '\r') {
      campo += c;
    }
  }

  if (campo !== '' || linha.length > 0) {
    linha.push(campo);
    linhas.push(linha);
  }

  return linhas;
}

// ------------------------------------------------------------- regiões

const REGIAO_POR_PAIS = {
  BR: 'Brasil',
  MX: 'México',
  US: 'América do Norte',
  CA: 'América do Norte',
  GL: 'América do Norte',
  PM: 'América do Norte',
  BM: 'América do Norte',
  BZ: 'América Central',
  CR: 'América Central',
  SV: 'América Central',
  GT: 'América Central',
  HN: 'América Central',
  NI: 'América Central',
  PA: 'América Central',
  AG: 'Caribe',
  AI: 'Caribe',
  AW: 'Caribe',
  BS: 'Caribe',
  BB: 'Caribe',
  BQ: 'Caribe',
  BL: 'Caribe',
  CU: 'Caribe',
  CW: 'Caribe',
  DM: 'Caribe',
  DO: 'Caribe',
  GD: 'Caribe',
  GP: 'Caribe',
  HT: 'Caribe',
  JM: 'Caribe',
  KN: 'Caribe',
  KY: 'Caribe',
  LC: 'Caribe',
  MF: 'Caribe',
  MQ: 'Caribe',
  MS: 'Caribe',
  PR: 'Caribe',
  SX: 'Caribe',
  TC: 'Caribe',
  TT: 'Caribe',
  VC: 'Caribe',
  VG: 'Caribe',
  VI: 'Caribe',
  AR: 'América do Sul',
  BO: 'América do Sul',
  CL: 'América do Sul',
  CO: 'América do Sul',
  EC: 'América do Sul',
  FK: 'América do Sul',
  GF: 'América do Sul',
  GY: 'América do Sul',
  PE: 'América do Sul',
  PY: 'América do Sul',
  SR: 'América do Sul',
  UY: 'América do Sul',
  VE: 'América do Sul',
};

const nomeDoPais = new Intl.DisplayNames('pt-BR', { type: 'region' });

// -------------------------------------------------------------- geração

const resposta = await fetch(FONTE);
if (!resposta.ok) {
  console.error(`Falha ao baixar ${FONTE}: HTTP ${resposta.status}`);
  process.exit(1);
}

const linhas = parseCsv(await resposta.text());
const cabecalho = linhas[0];
const col = Object.fromEntries(cabecalho.map((nome, i) => [nome, i]));

const selecionados = [];
const paisesSemRegiao = new Set();

for (const linha of linhas.slice(1)) {
  const continente = linha[col.continent];
  const iata = linha[col.iata_code];
  const tipo = linha[col.type];

  if (continente !== 'NA' && continente !== 'SA') continue;
  if (linha[col.scheduled_service] !== 'yes') continue;
  if (!/^[A-Z]{3}$/.test(iata)) continue;
  if (tipo !== 'large_airport' && tipo !== 'medium_airport') continue;

  const cc = linha[col.iso_country];
  if (!REGIAO_POR_PAIS[cc]) {
    paisesSemRegiao.add(cc);
    continue;
  }

  const lat = Number(linha[col.latitude_deg]);
  const lon = Number(linha[col.longitude_deg]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

  // A janela do mapa não cobre o Pacífico remoto nem o extremo norte.
  if (lat < -56 || lat > 66 || lon < -172 || lon > -32) continue;

  let tz;
  try {
    tz = tzLookup(lat, lon);
  } catch {
    continue;
  }

  // "Aeroporto Internacional Fulano" vira só "Fulano" na lista; o nome longo
  // fica no campo próprio.
  const nome = linha[col.name]
    .replace(/\s+International Airport$/i, '')
    .replace(/\s+Airport$/i, '')
    .trim();

  selecionados.push({
    iata,
    nome,
    cidade: linha[col.municipality] || nome,
    cc,
    grande: tipo === 'large_airport',
    lat: Number(lat.toFixed(4)),
    lon: Number(lon.toFixed(4)),
    tz,
  });
}

// IATA repetido acontece na base; fica o aeroporto de maior porte.
const porIata = new Map();
for (const a of selecionados) {
  const atual = porIata.get(a.iata);
  if (!atual || (a.grande && !atual.grande)) porIata.set(a.iata, a);
}

const finais = [...porIata.values()].sort((a, b) => a.iata.localeCompare(b.iata));

const escapar = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const tuplas = finais
  .map(
    (a) =>
      `  ['${a.iata}','${escapar(a.nome)}','${escapar(a.cidade)}','${a.cc}',${a.lat},${a.lon},'${a.tz}',${a.grande ? 1 : 0}],`,
  )
  .join('\n');

const paisesUsados = [...new Set(finais.map((a) => a.cc))].sort();
const nomes = paisesUsados
  .map((cc) => `  ${cc}: ['${escapar(nomeDoPais.of(cc) ?? cc)}', '${REGIAO_POR_PAIS[cc]}'],`)
  .join('\n');

const conteudo = `/**
 * Aeroportos das Américas com serviço aéreo regular — ARQUIVO GERADO.
 *
 * Fonte: OurAirports (${FONTE}), domínio público.
 * Fuso horário derivado das coordenadas com tz-lookup.
 * Nome do país via Intl.DisplayNames em pt-BR.
 *
 * Não edite à mão: rode \`npm run flights:aeroportos\` para regerar.
 * Gerado a partir de ${finais.length} aeroportos após os filtros
 * (Américas, serviço regular declarado, código IATA, porte médio ou grande).
 */

/** [iata, nome, cidade, país ISO, lat, lon, fuso IANA, é aeroporto grande] */
export type AirportTuple = [
  string,
  string,
  string,
  string,
  number,
  number,
  string,
  0 | 1,
];

export const FONTE_AEROPORTOS = '${FONTE}';

/** ISO alfa-2 → [nome do país em pt-BR, região]. */
export const PAISES: Record<string, [string, string]> = {
${nomes}
};

export const AIRPORT_TUPLES: AirportTuple[] = [
${tuplas}
];
`;

fs.writeFileSync(SAIDA, conteudo);

console.log(`aeroportos gerados: ${finais.length}`);
console.log(`grandes: ${finais.filter((a) => a.grande).length}`);
console.log(`países: ${paisesUsados.length}`);
if (paisesSemRegiao.size > 0) {
  console.log(`ignorados por país sem região: ${[...paisesSemRegiao].join(', ')}`);
}
console.log(`escrito em ${path.relative(RAIZ, SAIDA)}`);
