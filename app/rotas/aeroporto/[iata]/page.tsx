import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RouteMap, { type Arco, type Marcador } from '@/components/flights/RouteMap';
import { type Regiao, REGIOES, airports, getAirport } from '@/lib/flights/airports';
import { distanceKm, flightMinutes, formatDuration } from '@/lib/flights/geo';
import {
  AmadeusError,
  amadeusConfigurado,
  ambienteAmadeus,
} from '@/lib/flights/amadeus/client';
import { destinosDiretos } from '@/lib/flights/amadeus/rotas';
import { rotuloFuso } from '@/lib/flights/time';

/**
 * Destinos diretos de um aeroporto, direto da Amadeus.
 *
 * A página é dinâmica de propósito: são 1.094 aeroportos, e pré-renderizar
 * todos consumiria a cota da API inteira. O cache do cliente Amadeus (24h)
 * segura a repetição.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iata: string }>;
}): Promise<Metadata> {
  const { iata } = await params;
  const airport = getAirport(iata);
  if (!airport) return { title: 'Aeroporto não encontrado' };

  return {
    title: `Voos diretos de ${airport.cidade} (${airport.iata})`,
    description: `Destinos com voo direto de ${airport.nome}, em ${airport.cidade}, segundo a malha publicada pelas companhias.`,
  };
}

type Resultado =
  | { estado: 'ok'; destinos: string[]; foraDoRecorte: number }
  | { estado: 'sem-credencial' }
  | { estado: 'erro'; mensagem: string };

async function carregar(iata: string): Promise<Resultado> {
  if (!amadeusConfigurado()) return { estado: 'sem-credencial' };

  try {
    const todos = await destinosDiretos(iata);
    const nasAmericas = todos.filter((d) => getAirport(d.iata));

    return {
      estado: 'ok',
      destinos: nasAmericas.map((d) => d.iata),
      foraDoRecorte: todos.length - nasAmericas.length,
    };
  } catch (erro) {
    return {
      estado: 'erro',
      mensagem:
        erro instanceof AmadeusError
          ? erro.message
          : erro instanceof Error
            ? erro.message
            : 'Falha ao consultar a malha.',
    };
  }
}

export default async function AeroportoPage({
  params,
}: {
  params: Promise<{ iata: string }>;
}) {
  const { iata } = await params;
  const airport = getAirport(iata);
  if (!airport) notFound();

  const resultado = await carregar(airport.iata);

  const destinos =
    resultado.estado === 'ok'
      ? resultado.destinos
          .map((d) => getAirport(d)!)
          .map((d) => ({
            aeroporto: d,
            km: Math.round(distanceKm(airport.lat, airport.lon, d.lat, d.lon)),
          }))
          .sort((a, b) => a.km - b.km)
      : [];

  const arcos: Arco[] = destinos.map((d) => ({
    de: airport.iata,
    para: d.aeroporto.iata,
    cor: '#10b981',
  }));

  const marcadores: Marcador[] = [
    { iata: airport.iata, tipo: 'origem' },
    ...destinos.map((d) => ({ iata: d.aeroporto.iata, tipo: 'ponto' as const })),
  ];

  const porRegiao = REGIOES.map((regiao) => ({
    regiao,
    lista: destinos.filter((d) => d.aeroporto.regiao === regiao),
  })).filter((g) => g.lista.length > 0);

  const paisesAlcancados = new Set(destinos.map((d) => d.aeroporto.pais));
  const maisLongo = destinos[destinos.length - 1];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link href="/rotas" className="text-sm text-zinc-500 hover:text-white">
        ← Busca de voos
      </Link>

      <header className="mt-3 mb-6">
        <h1 className="text-4xl font-bold tracking-tight">
          {airport.cidade} <span className="font-mono text-zinc-500">{airport.iata}</span>
        </h1>
        <p className="mt-2 text-zinc-400">
          {airport.nome} · {airport.pais} · {rotuloFuso(airport.tz, new Date())}
        </p>
      </header>

      {resultado.estado === 'sem-credencial' && (
        <Aviso titulo="Malha real não configurada">
          Defina <code className="text-zinc-300">AMADEUS_CLIENT_ID</code> e{' '}
          <code className="text-zinc-300">AMADEUS_CLIENT_SECRET</code> para esta página listar os
          destinos diretos. Sem as credenciais ela não mostra rota nenhuma — é melhor não responder
          do que responder com dado não verificado.
        </Aviso>
      )}

      {resultado.estado === 'erro' && (
        <Aviso titulo="Falha ao consultar a malha">{resultado.mensagem}</Aviso>
      )}

      {resultado.estado === 'ok' && (
        <>
          <RouteMap arcos={arcos} marcadores={marcadores} altura="h-[520px]" />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Cartao titulo="Destinos diretos nas Américas" valor={String(destinos.length)} />
            <Cartao titulo="Países alcançados" valor={String(paisesAlcancados.size)} />
            <Cartao
              titulo="Voo mais longo"
              valor={maisLongo?.aeroporto.iata ?? '—'}
              detalhe={
                maisLongo
                  ? `${maisLongo.km.toLocaleString('pt-BR')} km · ~${formatDuration(flightMinutes(maisLongo.km))}`
                  : undefined
              }
            />
          </div>

          {resultado.foraDoRecorte > 0 && (
            <p className="mt-3 text-xs text-zinc-600">
              Outros {resultado.foraDoRecorte} destinos diretos ficam fora das Américas e não entram
              nesta página.
            </p>
          )}

          {porRegiao.map(({ regiao, lista }) => (
            <RegiaoBloco key={regiao} regiao={regiao} lista={lista} />
          ))}

          <p className="mt-8 text-xs text-zinc-600">
            Destinos diretos segundo a Amadeus ({ambienteAmadeus()}). Distância e tempo são
            calculados pela rota ortodrômica — para o horário publicado de um voo específico, use a{' '}
            <Link href="/rotas" className="underline underline-offset-2 hover:text-zinc-400">
              busca por data
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}

function RegiaoBloco({
  regiao,
  lista,
}: {
  regiao: Regiao;
  lista: { aeroporto: (typeof airports)[number]; km: number }[];
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">
        {regiao} <span className="text-sm font-normal text-zinc-500">({lista.length})</span>
      </h2>
      <div className="grid gap-2 md:grid-cols-2">
        {lista.map((d) => (
          <Link
            key={d.aeroporto.iata}
            href={`/rotas/aeroporto/${d.aeroporto.iata}`}
            className="flex items-baseline justify-between gap-3 rounded-xl border border-zinc-800 p-3 transition-colors hover:border-zinc-600"
          >
            <span className="truncate text-sm">
              <span className="font-mono text-white">{d.aeroporto.iata}</span>{' '}
              <span className="text-zinc-400">{d.aeroporto.cidade}</span>
            </span>
            <span className="shrink-0 font-mono text-xs text-zinc-500">
              {d.km.toLocaleString('pt-BR')} km
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Aviso({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-600/50 bg-amber-500/5 p-5">
      <h2 className="font-semibold text-white">{titulo}</h2>
      <p className="mt-1 text-sm text-zinc-400">{children}</p>
    </div>
  );
}

function Cartao({
  titulo,
  valor,
  detalhe,
}: {
  titulo: string;
  valor: string;
  detalhe?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{titulo}</span>
      <div className="mt-1 text-2xl font-semibold text-white">{valor}</div>
      {detalhe && <div className="text-sm text-zinc-500">{detalhe}</div>}
    </div>
  );
}
