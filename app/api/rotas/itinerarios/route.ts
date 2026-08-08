import { NextResponse } from 'next/server';
import { type Alvo, type Regiao, REGIOES, airportByIata, resolverAlvo } from '@/lib/flights/airports';
import {
  AmadeusError,
  AmadeusNaoConfigurado,
  amadeusConfigurado,
  ambienteAmadeus,
} from '@/lib/flights/amadeus/client';
import {
  type ItinerarioReal,
  destinosDiretos,
  ofertas,
} from '@/lib/flights/amadeus/rotas';

/**
 * Busca de itinerários reais.
 *
 *   /api/rotas/itinerarios?de=ATL&alvo=pais:Brasil&data=2026-09-15&chegarAte=17:00
 *
 * O alvo pode ser um aeroporto (`aeroporto:GRU`), um país (`pais:Brasil`) ou
 * uma região (`regiao:Caribe`).
 *
 * Para alvo de país/região a busca é feita em duas etapas para não estourar a
 * cota: uma chamada descobre os destinos diretos da origem, e só os que caem
 * dentro do alvo viram consultas de oferta. O que ficou de fora do limite volta
 * declarado em `ignorados` — truncar em silêncio faria a resposta parecer
 * completa quando não é.
 */

/** Teto de chamadas de oferta por requisição. Cada uma consome cota. */
const LIMITE_DESTINOS_PADRAO = 5;
const LIMITE_DESTINOS_MAX = 12;

interface Chegada {
  data: string;
  minutos: number;
}

/** Lê o horário local devolvido pela Amadeus (ISO sem fuso). */
function lerChegada(iso: string): Chegada | null {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!m) return null;
  return { data: m[1], minutos: Number(m[2]) * 60 + Number(m[3]) };
}

function parseAlvo(bruto: string | null): Alvo | null {
  if (!bruto) return null;

  const [tipo, ...resto] = bruto.split(':');
  const valor = resto.join(':');
  if (!valor) return null;

  if (tipo === 'aeroporto') {
    return airportByIata.has(valor.toUpperCase())
      ? { tipo: 'aeroporto', valor: valor.toUpperCase() }
      : null;
  }
  if (tipo === 'pais') return { tipo: 'pais', valor };
  if (tipo === 'regiao') {
    return REGIOES.includes(valor as Regiao) ? { tipo: 'regiao', valor: valor as Regiao } : null;
  }

  return null;
}

function parseHoraLimite(bruto: string | null): number | null {
  if (!bruto) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(bruto);
  if (!m) return null;

  const h = Number(m[1]);
  const min = Number(m[2]);
  return h > 23 || min > 59 ? null : h * 60 + min;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const origem = params.get('de')?.toUpperCase();
  if (!origem || !airportByIata.has(origem)) {
    return NextResponse.json(
      { erro: 'Informe uma origem válida em `de` (código IATA).' },
      { status: 400 },
    );
  }

  const alvo = parseAlvo(params.get('alvo'));
  if (!alvo) {
    return NextResponse.json(
      { erro: 'Informe `alvo` como aeroporto:GRU, pais:Brasil ou regiao:Caribe.' },
      { status: 400 },
    );
  }

  const data = params.get('data') ?? '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return NextResponse.json({ erro: 'Informe `data` no formato AAAA-MM-DD.' }, { status: 400 });
  }

  if (!amadeusConfigurado()) {
    return NextResponse.json(
      {
        erro:
          'A busca de voos reais precisa das credenciais da Amadeus. ' +
          'Defina AMADEUS_CLIENT_ID e AMADEUS_CLIENT_SECRET no ambiente.',
        configurado: false,
      },
      { status: 501 },
    );
  }

  const chegarAte = parseHoraLimite(params.get('chegarAte'));
  const maxParadas = Math.min(Math.max(Number(params.get('paradas') ?? 1), 0), 2);
  const limiteDestinos = Math.min(
    Math.max(Number(params.get('limiteDestinos') ?? LIMITE_DESTINOS_PADRAO), 1),
    LIMITE_DESTINOS_MAX,
  );

  const noAlvo = resolverAlvo(alvo, [origem]);
  if (noAlvo.length === 0) {
    return NextResponse.json({ erro: 'Nenhum aeroporto corresponde ao alvo.' }, { status: 400 });
  }

  try {
    let candidatos: string[];
    let viaDestinosDiretos = false;

    if (alvo.tipo === 'aeroporto') {
      candidatos = [alvo.valor];
    } else {
      // Uma chamada devolve a malha direta inteira da origem; cruzar com o
      // alvo evita consultar dezenas de aeroportos sem ligação nenhuma.
      const diretos = new Set((await destinosDiretos(origem)).map((d) => d.iata));
      viaDestinosDiretos = true;

      const dentroDoAlvo = noAlvo.filter((a) => diretos.has(a.iata));

      // Sem nenhum voo direto para o alvo, sobram os aeroportos maiores como
      // aposta de conexão — é onde a malha costuma passar.
      const base =
        dentroDoAlvo.length > 0
          ? dentroDoAlvo
          : noAlvo.filter((a) => a.grande).slice(0, limiteDestinos);

      candidatos = base.map((a) => a.iata);
    }

    const consultados = candidatos.slice(0, limiteDestinos);
    const ignorados = candidatos.slice(limiteDestinos);

    const respostas = await Promise.allSettled(
      consultados.map((destino) =>
        ofertas({ origem, destino, data, maxParadas, max: 20 }),
      ),
    );

    const itinerarios: ItinerarioReal[] = [];
    const falhas: { destino: string; motivo: string }[] = [];

    respostas.forEach((r, i) => {
      if (r.status === 'fulfilled') itinerarios.push(...r.value);
      else {
        falhas.push({
          destino: consultados[i],
          motivo: r.reason instanceof Error ? r.reason.message : 'falha desconhecida',
        });
      }
    });

    const avaliados = itinerarios
      .map((it) => {
        const chegada = lerChegada(it.segmentos[it.segmentos.length - 1].chegada);
        const dentroDoPrazo =
          chegarAte === null ||
          (chegada !== null && chegada.data === data && chegada.minutos <= chegarAte);

        return { ...it, chegada, dentroDoPrazo };
      })
      .filter((it) => (chegarAte === null ? true : it.dentroDoPrazo))
      .sort((a, b) => {
        const ordemData = (a.chegada?.data ?? '').localeCompare(b.chegada?.data ?? '');
        if (ordemData !== 0) return ordemData;
        return (a.chegada?.minutos ?? 0) - (b.chegada?.minutos ?? 0) || a.duracaoMin - b.duracaoMin;
      });

    return NextResponse.json({
      fonte: 'amadeus',
      ambiente: ambienteAmadeus(),
      origem,
      alvo,
      data,
      chegarAte: params.get('chegarAte') ?? null,
      consultados,
      ignorados,
      viaDestinosDiretos,
      falhas,
      total: avaliados.length,
      itinerarios: avaliados,
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
      { erro: erro instanceof Error ? erro.message : 'Falha inesperada na busca.' },
      { status: 500 },
    );
  }
}
