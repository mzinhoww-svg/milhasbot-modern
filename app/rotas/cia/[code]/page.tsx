import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RouteMap, { type Arco, type Marcador } from '@/components/flights/RouteMap';
import { REGIOES } from '@/lib/flights/airports';
import { ALIANCAS, airlines, getAirline } from '@/lib/flights/airlines';
import { aeroportosDaCompanhia, malhaDaCompanhia } from '@/lib/flights/network';
import { ROUTES_REVISAO } from '@/lib/flights/routes';

export function generateStaticParams() {
  return airlines.map((a) => ({ code: a.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const airline = getAirline(code);
  if (!airline) return { title: 'Companhia não encontrada' };

  const rotas = malhaDaCompanhia(airline.code).length;

  return {
    title: `Mapa de rotas da ${airline.nome} nas Américas`,
    description: `${rotas} rotas da ${airline.nome} nas Américas, os aeroportos atendidos e os programas de milhas que emitem passagens na companhia.`,
  };
}

export default async function CompanhiaPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const airline = getAirline(code);
  if (!airline) notFound();

  const malha = malhaDaCompanhia(airline.code);
  const atendidos = aeroportosDaCompanhia(airline.code);

  const arcos: Arco[] = malha.map((t) => ({ de: t.de, para: t.para, cor: airline.cor }));
  const marcadores: Marcador[] = atendidos.map(({ aeroporto }) => ({
    iata: aeroporto.iata,
    tipo: 'ponto' as const,
  }));

  const maisLonga = malha.reduce((a, b) => (b.km > a.km ? b : a), malha[0]);
  const alcance = REGIOES.filter((r) => atendidos.some(({ aeroporto }) => aeroporto.regiao === r));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link href="/rotas" className="text-sm text-zinc-500 hover:text-white">
        ← Mapa de rotas
      </Link>

      <header className="mt-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: airline.cor }} />
          <h1 className="text-4xl font-bold tracking-tight">{airline.nome}</h1>
          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: `${ALIANCAS[airline.alianca].cor}22`,
              color: ALIANCAS[airline.alianca].cor,
            }}
          >
            {ALIANCAS[airline.alianca].nome}
          </span>
        </div>
        <p className="mt-2 text-zinc-400">
          {airline.pais} · {malha.length} rotas nas Américas · {atendidos.length} aeroportos
        </p>
      </header>

      <RouteMap arcos={arcos} marcadores={marcadores} altura="h-[560px]" />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Cartao titulo="Rota mais longa">
          <span className="font-mono">
            {maisLonga.de} → {maisLonga.para}
          </span>
          <span className="block text-sm text-zinc-500">
            {maisLonga.km.toLocaleString('pt-BR')} km
          </span>
        </Cartao>
        <Cartao titulo="Alcance">
          <span className="text-base">{alcance.length} regiões</span>
          <span className="block text-sm text-zinc-500">{alcance.join(' · ')}</span>
        </Cartao>
        <Cartao titulo="Programa próprio">
          <span className="text-base">{airline.programaProprio}</span>
          <span className="block text-sm text-zinc-500">
            {airline.programas.length} programa{airline.programas.length === 1 ? '' : 's'} emitem
          </span>
        </Cartao>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Programas que emitem na {airline.nome}</h2>
        {airline.programas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {airline.programas.map((p) => (
              <span
                key={p}
                className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400"
              >
                {p}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            A {airline.nome} não tem parceria de emissão relevante para quem acumula no Brasil — as
            passagens saem em dinheiro ou pelo programa próprio.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Aeroportos atendidos</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {atendidos.map(({ aeroporto, rotas }) => (
            <Link
              key={aeroporto.iata}
              href={`/rotas/aeroporto/${aeroporto.iata}`}
              className="flex items-baseline justify-between rounded-xl border border-zinc-800 px-3 py-2 transition-colors hover:border-zinc-600"
            >
              <span className="truncate text-sm">
                <span className="font-mono text-white">{aeroporto.iata}</span>{' '}
                <span className="text-zinc-500">{aeroporto.cidade}</span>
              </span>
              <span className="shrink-0 text-xs text-zinc-600">{rotas} rotas</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs text-zinc-600">
        Base de referência revisada em {ROUTES_REVISAO}. Só constam trechos dentro das Américas.
      </p>
    </div>
  );
}

function Cartao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{titulo}</span>
      <div className="mt-1 text-lg text-white">{children}</div>
    </div>
  );
}
