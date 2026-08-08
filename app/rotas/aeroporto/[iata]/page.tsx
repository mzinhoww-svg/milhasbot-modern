import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RouteMap, { type Arco, type Marcador } from '@/components/flights/RouteMap';
import { type Regiao, REGIOES, getAirport } from '@/lib/flights/airports';
import { corDaCompanhia, nomeDaCompanhia } from '@/lib/flights/airlines';
import { distanceKm } from '@/lib/flights/geo';
import {
  TravelpayoutsError,
  travelpayoutsConfigurado,
} from '@/lib/flights/travelpayouts/client';
import { type DestinoBarato, destinosBaratos } from '@/lib/flights/travelpayouts/rotas';

/**
 * Destinos mais baratos a partir de um aeroporto, com preço real do
 * Travelpayouts. Dinâmica de propósito: são 1.094 aeroportos, e o cache do
 * cliente (3h) segura a repetição sem pré-render de todos.
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
    title: `Destinos mais baratos de ${airport.cidade} (${airport.iata})`,
    description: `Para onde voar barato saindo de ${airport.nome}, em ${airport.cidade}, com preços reais e link de reserva.`,
  };
}

type Resultado =
  | { estado: 'ok'; destinos: (DestinoBarato & { iata: string })[] }
  | { estado: 'sem-credencial' }
  | { estado: 'erro'; mensagem: string };

async function carregar(iata: string): Promise<Resultado> {
  if (!travelpayoutsConfigurado()) return { estado: 'sem-credencial' };

  try {
    const brutos = await destinosBaratos(iata);

    // A API devolve código de cidade; fica quem casa com um aeroporto da base.
    const nasAmericas = brutos
      .map((d) => ({ ...d, iata: d.destino }))
      .filter((d) => getAirport(d.iata));

    return { estado: 'ok', destinos: nasAmericas };
  } catch (erro) {
    return {
      estado: 'erro',
      mensagem:
        erro instanceof TravelpayoutsError
          ? erro.message
          : erro instanceof Error
            ? erro.message
            : 'Falha ao consultar tarifas.',
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
          .map((d) => {
            const dest = getAirport(d.iata)!;
            return {
              ...d,
              aeroporto: dest,
              km: Math.round(distanceKm(airport.lat, airport.lon, dest.lat, dest.lon)),
            };
          })
          .sort((a, b) => a.preco - b.preco)
      : [];

  const arcos: Arco[] = destinos.map((d) => ({
    de: airport.iata,
    para: d.aeroporto.iata,
    cor: corDaCompanhia(d.companhia),
  }));

  const marcadores: Marcador[] = [
    { iata: airport.iata, tipo: 'origem' },
    ...destinos.map((d) => ({ iata: d.aeroporto.iata, tipo: 'ponto' as const })),
  ];

  const porRegiao = REGIOES.map((regiao) => ({
    regiao,
    lista: destinos.filter((d) => d.aeroporto.regiao === regiao),
  })).filter((g) => g.lista.length > 0);

  const maisBarato = destinos[0];

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
          {airport.nome} · {airport.pais}
        </p>
      </header>

      {resultado.estado === 'sem-credencial' && (
        <Aviso titulo="Fonte de dados não configurada">
          Defina <code className="text-zinc-300">TRAVELPAYOUTS_TOKEN</code> para esta página listar
          os destinos mais baratos. Sem o token ela não mostra tarifa nenhuma — melhor não responder
          do que responder com dado não verificado.
        </Aviso>
      )}

      {resultado.estado === 'erro' && (
        <Aviso titulo="Falha ao consultar tarifas">{resultado.mensagem}</Aviso>
      )}

      {resultado.estado === 'ok' && destinos.length === 0 && (
        <Aviso titulo="Sem tarifas em cache">
          O Travelpayouts não tem tarifas recentes saindo de {airport.iata} para destinos das
          Américas no momento. Tente um aeroporto de maior movimento.
        </Aviso>
      )}

      {resultado.estado === 'ok' && destinos.length > 0 && (
        <>
          <RouteMap arcos={arcos} marcadores={marcadores} altura="h-[520px]" />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Cartao titulo="Destinos com tarifa" valor={String(destinos.length)} />
            <Cartao
              titulo="Mais barato"
              valor={maisBarato ? maisBarato.aeroporto.iata : '—'}
              detalhe={
                maisBarato
                  ? `R$ ${maisBarato.preco.toLocaleString('pt-BR')} · ${nomeDaCompanhia(maisBarato.companhia)}`
                  : undefined
              }
            />
            <Cartao
              titulo="Países alcançados"
              valor={String(new Set(destinos.map((d) => d.aeroporto.pais)).size)}
            />
          </div>

          {porRegiao.map(({ regiao, lista }) => (
            <RegiaoBloco key={regiao} regiao={regiao} lista={lista} />
          ))}

          <p className="mt-8 text-xs text-zinc-600">
            Menores tarifas em cache no Travelpayouts (Aviasales), em reais. Preço e disponibilidade
            mudam — confirme na reserva. Para uma data e horário específicos, use a{' '}
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
  lista: {
    aeroporto: NonNullable<ReturnType<typeof getAirport>>;
    km: number;
    preco: number;
    companhia: string;
    paradas: number;
  }[];
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
            <span className="min-w-0 truncate text-sm">
              <span className="font-mono text-white">{d.aeroporto.iata}</span>{' '}
              <span className="text-zinc-400">{d.aeroporto.cidade}</span>{' '}
              <span className="text-xs text-zinc-600">
                · {d.paradas === 0 ? 'direto' : `${d.paradas} parada${d.paradas > 1 ? 's' : ''}`}
              </span>
            </span>
            <span className="shrink-0 font-mono text-xs text-emerald-400">
              R$ {d.preco.toLocaleString('pt-BR')}
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
