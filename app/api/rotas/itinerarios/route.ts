import { NextResponse } from 'next/server';
import {
  type Alvo,
  type Regiao,
  REGIOES,
  airportByIata,
  resolverAlvo,
} from '@/lib/flights/airports';
import {
  TravelpayoutsError,
  TravelpayoutsNaoConfigurado,
  travelpayoutsConfigurado,
} from '@/lib/flights/travelpayouts/client';
import { type OfertaReal, ofertas } from '@/lib/flights/travelpayouts/rotas';
import { prioridadeHub } from '@/lib/flights/hubs';

/**
 * Busca de tarifas reais com horário.
 *
 *   /api/rotas/itinerarios?de=ATL&alvo=pais:Brasil&data=2026-09-15&chegarAte=17:00
 *
 * Alvo: aeroporto:GRU, pais:Brasil ou regiao:Caribe.
 *
 * Para país/região a busca consulta um conjunto limitado de aeroportos do alvo
 * — cada um é uma chamada à API. O que fica fora do limite volta declarado em
 * `ignorados`, para a resposta não parecer completa quando não é.
 */

const LIMITE_DESTINOS_PADRAO = 6;
const LIMITE_DESTINOS_MAX = 12;

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
  if (data && !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return NextResponse.json({ erro: 'A `data` deve estar no formato AAAA-MM-DD.' }, { status: 400 });
  }

  if (!travelpayoutsConfigurado()) {
    return NextResponse.json(
      {
        erro:
          'A busca de voos reais precisa do token do Travelpayouts. ' +
          'Defina TRAVELPAYOUTS_TOKEN no ambiente.',
        configurado: false,
      },
      { status: 501 },
    );
  }

  const chegarAte = parseHoraLimite(params.get('chegarAte'));
  const limiteDestinos = Math.min(
    Math.max(Number(params.get('limiteDestinos') ?? LIMITE_DESTINOS_PADRAO), 1),
    LIMITE_DESTINOS_MAX,
  );

  const noAlvo = resolverAlvo(alvo, [origem]);
  if (noAlvo.length === 0) {
    return NextResponse.json({ erro: 'Nenhum aeroporto corresponde ao alvo.' }, { status: 400 });
  }

  // Para país/região, prioriza os portões de entrada — é onde a malha
  // internacional efetivamente passa e onde há tarifa em cache. Sem isso, a
  // ordem alfabética gastaria a cota em regionais antes de GRU/GIG.
  const candidatos =
    alvo.tipo === 'aeroporto'
      ? [alvo.valor]
      : noAlvo
          .slice()
          .sort((a, b) => prioridadeHub(a.iata, a.grande) - prioridadeHub(b.iata, b.grande))
          .map((a) => a.iata);

  const consultados = candidatos.slice(0, limiteDestinos);
  const ignorados = candidatos.slice(limiteDestinos);

  try {
    const respostas = await Promise.allSettled(
      consultados.map((destino) => ofertas({ origem, destino, data: data || undefined, limite: 10 })),
    );

    const todas: OfertaReal[] = [];
    const falhas: { destino: string; motivo: string }[] = [];

    respostas.forEach((r, i) => {
      if (r.status === 'fulfilled') todas.push(...r.value);
      else {
        falhas.push({
          destino: consultados[i],
          motivo: r.reason instanceof Error ? r.reason.message : 'falha desconhecida',
        });
      }
    });

    const filtradas = todas
      .filter((o) => {
        if (chegarAte === null) return true;
        if (!o.chegada) return false;
        // Sem data escolhida, cada oferta traz sua própria data; o limite de
        // hora vale para a chegada naquele dia.
        return o.chegada.minutos <= chegarAte && (!data || o.chegada.data === data);
      })
      .sort((a, b) => {
        if (chegarAte !== null) {
          const ha = a.chegada?.minutos ?? Infinity;
          const hb = b.chegada?.minutos ?? Infinity;
          if (ha !== hb) return ha - hb;
        }
        return a.preco.total - b.preco.total;
      });

    return NextResponse.json({
      fonte: 'travelpayouts',
      origem,
      alvo,
      data: data || null,
      chegarAte: params.get('chegarAte') ?? null,
      consultados,
      ignorados,
      falhas,
      total: filtradas.length,
      itinerarios: filtradas,
    });
  } catch (erro) {
    if (erro instanceof TravelpayoutsNaoConfigurado) {
      return NextResponse.json({ erro: erro.message, configurado: false }, { status: 501 });
    }
    if (erro instanceof TravelpayoutsError) {
      return NextResponse.json(
        { erro: erro.message, status: erro.status, fonte: 'travelpayouts' },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { erro: erro instanceof Error ? erro.message : 'Falha inesperada na busca.' },
      { status: 500 },
    );
  }
}
