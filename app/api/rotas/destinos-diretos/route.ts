import { NextResponse } from 'next/server';
import { airportByIata } from '@/lib/flights/airports';
import {
  AmadeusError,
  AmadeusNaoConfigurado,
  amadeusConfigurado,
  ambienteAmadeus,
} from '@/lib/flights/amadeus/client';
import { destinosDiretos } from '@/lib/flights/amadeus/rotas';

/**
 * Destinos com voo direto a partir de um aeroporto, direto da Amadeus.
 *
 *   /api/rotas/destinos-diretos?de=GRU
 *
 * Devolve só os destinos que existem na base de aeroportos das Américas — o
 * recorte do produto — e informa quantos ficaram de fora por serem de outros
 * continentes, para o número na tela não parecer a malha inteira.
 */
export async function GET(request: Request) {
  const origem = new URL(request.url).searchParams.get('de')?.toUpperCase();

  if (!origem || !airportByIata.has(origem)) {
    return NextResponse.json(
      { erro: 'Informe uma origem válida em `de` (código IATA).' },
      { status: 400 },
    );
  }

  if (!amadeusConfigurado()) {
    return NextResponse.json(
      {
        erro:
          'A malha real precisa das credenciais da Amadeus. ' +
          'Defina AMADEUS_CLIENT_ID e AMADEUS_CLIENT_SECRET no ambiente.',
        configurado: false,
      },
      { status: 501 },
    );
  }

  try {
    const todos = await destinosDiretos(origem);

    const nasAmericas = todos
      .map((d) => ({ ...d, aeroporto: airportByIata.get(d.iata) }))
      .filter((d) => Boolean(d.aeroporto));

    return NextResponse.json({
      fonte: 'amadeus',
      ambiente: ambienteAmadeus(),
      origem,
      total: nasAmericas.length,
      foraDoRecorte: todos.length - nasAmericas.length,
      destinos: nasAmericas.map((d) => ({
        iata: d.iata,
        cidade: d.aeroporto!.cidade,
        pais: d.aeroporto!.pais,
        regiao: d.aeroporto!.regiao,
        lat: d.aeroporto!.lat,
        lon: d.aeroporto!.lon,
      })),
    });
  } catch (erro) {
    if (erro instanceof AmadeusNaoConfigurado) {
      return NextResponse.json({ erro: erro.message, configurado: false }, { status: 501 });
    }
    if (erro instanceof AmadeusError) {
      return NextResponse.json(
        { erro: erro.message, status: erro.status, fonte: 'amadeus' },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { erro: erro instanceof Error ? erro.message : 'Falha inesperada.' },
      { status: 500 },
    );
  }
}
