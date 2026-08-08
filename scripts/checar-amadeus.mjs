/**
 * Diagnóstico da integração com a Amadeus.
 *
 *   node scripts/checar-amadeus.mjs            # ATL → GRU amanhã
 *   node scripts/checar-amadeus.mjs GRU LIS 2026-09-15
 *
 * Roda fora do Next para dar erro legível quando o problema é credencial,
 * cota ou rede — e não um "falhou" genérico na tela.
 *
 * Lê AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET e AMADEUS_HOSTNAME do ambiente.
 */

import fs from 'node:fs';

// Carrega .env.local sem depender de pacote: o script roda solto.
for (const arquivo of ['.env.local', '.env']) {
  if (!fs.existsSync(arquivo)) continue;
  for (const linha of fs.readFileSync(arquivo, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(linha);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const { AMADEUS_CLIENT_ID: id, AMADEUS_CLIENT_SECRET: secret } = process.env;
const base =
  process.env.AMADEUS_HOSTNAME === 'production'
    ? 'https://api.amadeus.com'
    : 'https://test.api.amadeus.com';

if (!id || !secret) {
  console.error('✗ AMADEUS_CLIENT_ID / AMADEUS_CLIENT_SECRET não definidos.');
  console.error('  Crie uma chave gratuita em https://developers.amadeus.com e coloque no .env.local');
  process.exit(1);
}

const [, , origem = 'ATL', destino = 'GRU', dataArg] = process.argv;
const data = dataArg ?? new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

console.log(`ambiente: ${base}`);

// ------------------------------------------------------------------ token
const respostaToken = await fetch(`${base}/v1/security/oauth2/token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: id,
    client_secret: secret,
  }),
});

const corpoToken = await respostaToken.json().catch(() => null);

if (!respostaToken.ok) {
  console.error(`✗ autenticação falhou (HTTP ${respostaToken.status})`);
  console.error(' ', corpoToken?.error_description ?? corpoToken ?? 'sem detalhe');
  process.exit(1);
}

console.log(`✓ autenticado, token válido por ${corpoToken.expires_in}s`);

const autenticado = (caminho, params) =>
  fetch(`${base}${caminho}?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${corpoToken.access_token}` },
  });

const detalharErro = async (resposta, rotulo) => {
  const corpo = await resposta.json().catch(() => null);
  const erro = corpo?.errors?.[0];
  console.error(`✗ ${rotulo} (HTTP ${resposta.status}): ${erro?.detail ?? erro?.title ?? 'sem detalhe'}`);
  return null;
};

// ------------------------------------------------------- destinos diretos
const respostaDestinos = await autenticado('/v1/airport/direct-destinations', {
  departureAirportCode: origem,
  max: 200,
});

if (respostaDestinos.ok) {
  const { data: destinos = [] } = await respostaDestinos.json();
  console.log(`✓ destinos diretos de ${origem}: ${destinos.length}`);
  console.log('  ' + destinos.slice(0, 25).map((d) => d.iataCode).join(' '));
  console.log(`  ${destino} está na lista? ${destinos.some((d) => d.iataCode === destino) ? 'sim' : 'não'}`);
} else {
  await detalharErro(respostaDestinos, `destinos diretos de ${origem}`);
}

// -------------------------------------------------------------- ofertas
const respostaOfertas = await autenticado('/v2/shopping/flight-offers', {
  originLocationCode: origem,
  destinationLocationCode: destino,
  departureDate: data,
  adults: '1',
  currencyCode: 'BRL',
  max: '10',
});

if (!respostaOfertas.ok) {
  await detalharErro(respostaOfertas, `ofertas ${origem}→${destino} em ${data}`);
  process.exit(1);
}

const { data: ofertas = [], dictionaries } = await respostaOfertas.json();
console.log(`\n✓ ofertas ${origem} → ${destino} em ${data}: ${ofertas.length}`);

for (const oferta of ofertas.slice(0, 6)) {
  const segmentos = oferta.itineraries[0].segments;
  const primeiro = segmentos[0];
  const ultimo = segmentos[segmentos.length - 1];
  const paradas = segmentos.length - 1;
  const escalas = segmentos.slice(0, -1).map((s) => s.arrival.iataCode).join(',');

  console.log(
    `  ${primeiro.departure.at.slice(11, 16)} → ${ultimo.arrival.at.slice(11, 16)}` +
      `  ${String(paradas)}p${escalas ? ` via ${escalas}` : '     '}` +
      `  ${oferta.itineraries[0].duration.replace('PT', '').toLowerCase()}` +
      `  ${segmentos.map((s) => s.carrierCode).join('/')}` +
      `  ${oferta.price?.currency ?? ''} ${oferta.price?.grandTotal ?? oferta.price?.total ?? ''}`,
  );
}

if (dictionaries?.carriers) {
  console.log('\ncompanhias:', Object.entries(dictionaries.carriers).map(([c, n]) => `${c}=${n}`).join(', '));
}
