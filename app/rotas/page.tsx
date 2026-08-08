import type { Metadata } from 'next';
import Link from 'next/link';
import RotasExplorer from './RotasExplorer';
import { FONTE, airports, paises } from '@/lib/flights/airports';
import { amadeusConfigurado, ambienteAmadeus } from '@/lib/flights/amadeus/client';

export const metadata: Metadata = {
  title: 'Busca de voos nas Américas',
  description:
    'Voos e horários reais entre aeroportos das Américas. Busque por país ou região inteira, filtre pelo horário em que precisa chegar e veja com qual programa de milhas dá para emitir.',
};

const DESTAQUES = ['GRU', 'GIG', 'BSB', 'MIA', 'JFK', 'ATL', 'MEX', 'PTY', 'BOG', 'SCL', 'EZE', 'LIM'];

export default function RotasPage() {
  const configurado = amadeusConfigurado();
  const grandes = airports.filter((a) => a.grande).length;

  return (
    <>
      <RotasExplorer />

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="mb-3 text-lg font-semibold">Malha direta por aeroporto</h2>
        <div className="flex flex-wrap gap-2">
          {DESTAQUES.map((iata) => (
            <Link
              key={iata}
              href={`/rotas/aeroporto/${iata}`}
              className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              {iata}
            </Link>
          ))}
        </div>

        <div className="mt-8 space-y-2 border-t border-zinc-800 pt-6 text-sm text-zinc-500">
          <p>
            <strong className="text-zinc-300">Voos e horários:</strong> Amadeus Self-Service API
            {configurado ? ` (ambiente ${ambienteAmadeus()})` : ' — credenciais não configuradas'}.
            É a fonte de tudo que aparece como rota, horário e preço.
          </p>
          <p>
            <strong className="text-zinc-300">Aeroportos:</strong> {airports.length} aeroportos das
            Américas com serviço regular ({grandes} de grande porte) em {paises.length} países,
            gerados de{' '}
            <a
              href={FONTE}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-zinc-300"
            >
              OurAirports
            </a>
            , domínio público. Fusos derivados das coordenadas.
          </p>
          <p>
            <strong className="text-zinc-300">Programas de milhas:</strong> curadoria editorial
            própria — é a única parte que não vem de API, porque não existe uma que dê isso.
          </p>
        </div>
      </section>
    </>
  );
}
