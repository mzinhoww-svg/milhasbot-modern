import { NextResponse } from 'next/server';
import {
  type Alvo,
  type Regiao,
  REGIOES,
  airportByIata,
  resolverAlvo,
} from '@/lib/flights/airports';
import { aeroportosDaCidade, buscarCriativo } from '@/lib/flights/network';
import { chegadaLocal, parseHourMinute } from '@/lib/flights/time';

/**
 * Busca de rotas criativas (staff / não-revenue).
 *
 *   /api/rotas/criativo?de=ATL&alvo=aeroporto:CGB&partida=13:00&chegarAte=17:00
 *
 * Roda inteiramente na malha em memória (OpenFlights) — não depende de token
 * nem de rede. Devolve várias opções diversas, não só o caminho mais curto,
 * porque o valor para viagem de staff é ter alternativas quando o voo enche.
 *
 * Horários são estimados por distância + tempos de conexão/traslado, e vêm
 * marcados como estimativa na resposta.
 */

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

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const origem = params.get('de')?.toUpperCase();
  if (!origem || !airportByIata.has(origem)) {
    return NextResponse.json({ erro: 'Informe uma origem válida em `de`.' }, { status: 400 });
  }

  const alvo = parseAlvo(params.get('alvo'));
  if (!alvo) {
    return NextResponse.json(
      { erro: 'Informe `alvo` como aeroporto:GRU, pais:Brasil ou regiao:Caribe.' },
      { status: 400 },
    );
  }

  const maxVoos = Math.min(Math.max(Number(params.get('maxVoos') ?? 3), 1), 3);
  const permitirTraslado = params.get('traslado') !== '0';
  const partidaMin = parseHourMinute(params.get('partida') ?? '') ?? 6 * 60;
  const chegarAte = parseHourMinute(params.get('chegarAte') ?? '');

  // Destino: um aeroporto vira a cidade inteira (chegar em qualquer aeroporto
  // da cidade serve, e é o que o staff faz). País/região usam o conjunto todo.
  const destinos =
    alvo.tipo === 'aeroporto'
      ? aeroportosDaCidade(alvo.valor)
      : resolverAlvo(alvo, [origem]).map((a) => a.iata);

  if (destinos.length === 0) {
    return NextResponse.json({ erro: 'Nenhum aeroporto corresponde ao alvo.' }, { status: 400 });
  }

  const itinerarios = buscarCriativo({ origem, destinos, maxVoos, permitirTraslado, limite: 40 });

  // Estimativa de chegada a partir da partida informada e do tempo estimado.
  const hoje = new Date();
  const data = new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()));
  const tzOrigem = airportByIata.get(origem)!.tz;

  const avaliados = itinerarios.map((it) => {
    const tzDestino = airportByIata.get(it.destino)!.tz;
    const chegada = chegadaLocal(data, tzOrigem, partidaMin, tzDestino, it.minutosTotal);
    // "Chegar até" é sobre a hora do relógio na chegada; o dia (+1, +2) fica
    // sempre visível para o viajante julgar. Em trecho internacional a chegada
    // costuma ser no dia seguinte de madrugada — antes das 17h, mas no outro
    // dia, e é isso que a marcação de dia deixa claro.
    const dentroDoPrazo = chegarAte === null || chegada.minutos <= chegarAte;

    return {
      ...it,
      chegadaEstimada: chegada,
      dentroDoPrazo,
    };
  });

  const ordenados =
    chegarAte === null
      ? avaliados
      : avaliados.sort(
          (a, b) => Number(b.dentroDoPrazo) - Number(a.dentroDoPrazo) || a.minutosTotal - b.minutosTotal,
        );

  return NextResponse.json({
    fonte: 'openflights',
    estimativa: true,
    origem,
    alvo,
    partida: params.get('partida') ?? null,
    chegarAte: params.get('chegarAte') ?? null,
    total: ordenados.length,
    itinerarios: ordenados,
  });
}
