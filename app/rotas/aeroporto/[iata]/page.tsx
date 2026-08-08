import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RouteMap, { type Arco, type Marcador } from '@/components/flights/RouteMap';
import { type Regiao, REGIOES, getAirport } from '@/lib/flights/airports';
import { corDaCompanhia, nomeDaCompanhia } from '@/lib/flights/airlines';
import { formatDuration } from '@/lib/flights/geo';
import {
  type DestinoDireto,
  companhiasDoAeroporto,
  destinosDiretos,
} from '@/lib/flights/network';
import { rotuloFuso } from '@/lib/flights/time';

/**
 * Voos diretos de um aeroporto, da malha real (OpenFlights). Estático: os dados
 * estão no bundle, não há chamada externa.
 */
export function generateStaticParams() {
  // Só os hubs mais relevantes são pré-renderizados; o resto é sob demanda.
  return ['GRU', 'GIG', 'BSB', 'MIA', 'JFK', 'ATL', 'MEX', 'PTY', 'BOG', 'SCL', 'EZE', 'LIM'].map(
    (iata) => ({ iata }),
  );
}

export const dynamicParams = true;

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
    description: `Destinos com voo direto de ${airport.nome}, em ${airport.cidade}, e as companhias que operam cada rota.`,
  };
}

export default async function AeroportoPage({
  params,
}: {
  params: Promise<{ iata: string }>;
}) {
  const { iata } = await params;
  const airport = getAirport(iata);
  if (!airport) notFound();

  const destinos = destinosDiretos(airport.iata);
  const companhias = companhiasDoAeroporto(airport.iata);

  const arcos: Arco[] = destinos.map((d) => ({
    de: airport.iata,
    para: d.aeroporto.iata,
    cor: corDaCompanhia(d.companhias[0]),
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
        ← Rotas criativas
      </Link>

      <header className="mt-3 mb-6">
        <h1 className="text-4xl font-bold tracking-tight">
          {airport.cidade} <span className="font-mono text-zinc-500">{airport.iata}</span>
        </h1>
        <p className="mt-2 text-zinc-400">
          {airport.nome} · {airport.pais} · {rotuloFuso(airport.tz, new Date())}
        </p>
      </header>

      {destinos.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
          Sem voos diretos mapeados a partir de {airport.iata} na malha do OpenFlights.
        </div>
      ) : (
        <>
          <RouteMap arcos={arcos} marcadores={marcadores} altura="h-[520px]" />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Cartao titulo="Destinos diretos" valor={String(destinos.length)} />
            <Cartao titulo="Países alcançados" valor={String(paisesAlcancados.size)} />
            <Cartao
              titulo="Voo mais longo"
              valor={maisLongo?.aeroporto.iata ?? '—'}
              detalhe={
                maisLongo
                  ? `${maisLongo.km.toLocaleString('pt-BR')} km · ~${formatDuration(maisLongo.minutos)}`
                  : undefined
              }
            />
          </div>

          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Companhias em {airport.iata}</h2>
            <div className="flex flex-wrap gap-2">
              {companhias.map(({ codigo, rotas }) => (
                <Link
                  key={codigo}
                  href="/rotas"
                  className="rounded-full border px-3 py-1.5 text-xs transition-colors hover:brightness-125"
                  style={{ borderColor: `${corDaCompanhia(codigo)}66`, color: corDaCompanhia(codigo) }}
                >
                  {nomeDaCompanhia(codigo)}
                  <span className="ml-1.5 text-zinc-600">{rotas}</span>
                </Link>
              ))}
            </div>
          </section>

          {porRegiao.map(({ regiao, lista }) => (
            <RegiaoBloco key={regiao} regiao={regiao} lista={lista} />
          ))}

          <p className="mt-8 text-xs text-zinc-600">
            Malha do OpenFlights (voos diretos reais). Distância e tempo estimados pela rota
            ortodrômica — para horário e preço de uma data, use a{' '}
            <Link href="/rotas" className="underline underline-offset-2 hover:text-zinc-400">
              busca de rotas
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}

function RegiaoBloco({ regiao, lista }: { regiao: Regiao; lista: DestinoDireto[] }) {
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
            className="rounded-xl border border-zinc-800 p-3 transition-colors hover:border-zinc-600"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-sm">
                <span className="font-mono text-white">{d.aeroporto.iata}</span>{' '}
                <span className="text-zinc-400">{d.aeroporto.cidade}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-zinc-500">
                ~{formatDuration(d.minutos)} · {d.km.toLocaleString('pt-BR')} km
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-2 text-[11px]">
              {d.companhias.slice(0, 5).map((c) => (
                <span key={c} style={{ color: corDaCompanhia(c) }}>
                  {nomeDaCompanhia(c)}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Cartao({ titulo, valor, detalhe }: { titulo: string; valor: string; detalhe?: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{titulo}</span>
      <div className="mt-1 text-2xl font-semibold text-white">{valor}</div>
      {detalhe && <div className="text-sm text-zinc-500">{detalhe}</div>}
    </div>
  );
}
