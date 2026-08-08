import type { Metadata } from 'next';
import Link from 'next/link';
import RotasExplorer from './RotasExplorer';
import { airlines } from '@/lib/flights/airlines';
import { TOTAL_AEROPORTOS, TOTAL_ROTAS, aeroportosPorMovimento } from '@/lib/flights/network';

export const metadata: Metadata = {
  title: 'Mapa de rotas aéreas das Américas',
  description:
    'Encontre voos diretos e conexões entre qualquer aeroporto das Américas. Busque por país ou região inteira, filtre por horário de chegada e descubra com qual programa de milhas dá para emitir cada trecho.',
};

export default function RotasPage() {
  const principais = aeroportosPorMovimento.slice(0, 24);

  return (
    <>
      <RotasExplorer />

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-lg font-semibold">Malha por companhia</h2>
            <div className="flex flex-wrap gap-2">
              {airlines.map((a) => (
                <Link
                  key={a.code}
                  href={`/rotas/cia/${a.code}`}
                  className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                  style={{ borderLeftColor: a.cor, borderLeftWidth: 3 }}
                >
                  {a.nome}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Aeroportos com mais rotas</h2>
            <div className="flex flex-wrap gap-2">
              {principais.map(({ aeroporto, rotas }) => (
                <Link
                  key={aeroporto.iata}
                  href={`/rotas/aeroporto/${aeroporto.iata}`}
                  className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  {aeroporto.iata}
                  <span className="ml-1.5 text-zinc-600">{rotas}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          Cobertura atual: {TOTAL_ROTAS.toLocaleString('pt-BR')} rotas, {TOTAL_AEROPORTOS}{' '}
          aeroportos e {airlines.length} companhias das Américas — do Alasca à Terra do Fogo.
        </p>
      </section>
    </>
  );
}
