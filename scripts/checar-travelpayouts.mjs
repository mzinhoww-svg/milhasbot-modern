/**
 * Diagnóstico da integração com o Travelpayouts.
 *
 *   node scripts/checar-travelpayouts.mjs            # ATL → GRU
 *   node scripts/checar-travelpayouts.mjs GRU MIA 2026-09-15
 *
 * Roda fora do Next para dar erro legível quando o problema é token, cota ou
 * rede — e não um "falhou" genérico na tela. Lê TRAVELPAYOUTS_TOKEN do ambiente
 * ou de .env.local.
 */

import fs from 'node:fs';

for (const arquivo of ['.env.local', '.env']) {
  if (!fs.existsSync(arquivo)) continue;
  for (const linha of fs.readFileSync(arquivo, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(linha);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

const token = process.env.TRAVELPAYOUTS_TOKEN;
if (!token) {
  console.error('✗ TRAVELPAYOUTS_TOKEN não definido (ambiente ou .env.local).');
  process.exit(1);
}

const [, , origem = 'ATL', destino = 'GRU', data] = process.argv;
const base = 'https://api.travelpayouts.com';

const get = async (caminho, params) => {
  const query = new URLSearchParams(params);
  const r = await fetch(`${base}${caminho}?${query}`, { headers: { 'X-Access-Token': token } });
  const corpo = await r.json().catch(() => null);
  return { ok: r.ok, status: r.status, corpo };
};

// ------------------------------------------------------- prices_for_dates
const precos = await get('/aviasales/v3/prices_for_dates', {
  origin: origem,
  destination: destino,
  departure_at: data ?? '',
  one_way: 'true',
  currency: 'brl',
  sorting: 'price',
  limit: '10',
  market: 'br',
});

if (!precos.ok || precos.corpo?.success === false) {
  console.error(`✗ prices_for_dates (HTTP ${precos.status}): ${precos.corpo?.error ?? 'sem detalhe'}`);
  process.exit(1);
}

const ofertas = precos.corpo?.data ?? [];
console.log(`✓ token válido. ${origem} → ${destino}${data ? ` em ${data}` : ''}: ${ofertas.length} tarifas`);

for (const o of ofertas.slice(0, 6)) {
  const chegada = new Date(Date.parse(o.departure_at) + (o.duration_to ?? 0) * 60000);
  console.log(
    `  sai ${o.departure_at.slice(0, 16).replace('T', ' ')}  ~chega ${chegada.toISOString().slice(11, 16)}Z` +
      `  ${String(o.transfers)}p  ${o.airline}${o.flight_number ?? ''}  R$ ${o.price}`,
  );
}

// --------------------------------------------------------- city-directions
const direcoes = await get('/v1/city-directions', { origin: origem, currency: 'brl' });
if (direcoes.ok && direcoes.corpo?.data) {
  const n = Object.keys(direcoes.corpo.data).length;
  console.log(`\n✓ destinos baratos de ${origem}: ${n}`);
  for (const [iata, v] of Object.entries(direcoes.corpo.data).slice(0, 8)) {
    console.log(`  ${iata}: R$ ${v.price} ${v.airline} ${v.transfers ?? 0}p`);
  }
} else {
  console.error(`✗ city-directions (HTTP ${direcoes.status}): ${direcoes.corpo?.error ?? 'sem detalhe'}`);
}
