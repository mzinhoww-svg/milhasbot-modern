import type { Metadata } from 'next';
import Link from 'next/link';
import RotasExplorer from './RotasExplorer';
import { FONTE, airports, paises } from '@/lib/flights/airports';
import { FONTE_ROTAS } from '@/lib/flights/routes.data';
import { TOTAL_AEROPORTOS_COM_ROTA, TOTAL_ARESTAS } from '@/lib/flights/network';
import { travelpayoutsConfigurado } from '@/lib/flights/travelpayouts/client';

export const metadata: Metadata = {
  title: 'Rotas criativas nas Américas',
  description:
    'Rotas alternativas para viagem de staff: quando o voo direto está cheio, encontre caminhos por hubs não óbvios, com troca de aeroporto na mesma cidade e filtro de horário de chegada.',
};

const DESTAQUES = ['GRU', 'GIG', 'BSB', 'MIA', 'JFK', 'ATL', 'MEX', 'PTY', 'BOG', 'SCL', 'EZE', 'LIM'];

export default function RotasPage() {
  const precoLigado = travelpayoutsConfigurado();

  return (
    <>
      <RotasExplorer />

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="mb-3 text-lg font-semibold">Voos diretos por aeroporto</h2>
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
            <strong className="text-zinc-300">Malha de rotas:</strong>{' '}
            {TOTAL_ARESTAS.toLocaleString('pt-BR')} trechos diretos entre{' '}
            {TOTAL_AEROPORTOS_COM_ROTA} aeroportos, de{' '}
            <a href={FONTE_ROTAS} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-zinc-300">
              OpenFlights
            </a>
            . É o que permite achar rotas criativas de vários trechos sem depender de API — roda no
            servidor, instantâneo.
          </p>
          <p>
            <strong className="text-zinc-300">Aeroportos:</strong> {airports.length} das Américas com
            serviço regular em {paises.length} países, de{' '}
            <a href={FONTE} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-zinc-300">
              OurAirports
            </a>
            . Fusos derivados das coordenadas.
          </p>
          <p>
            <strong className="text-zinc-300">Tarifa e reserva:</strong> Travelpayouts (Aviasales),
            sob demanda por trecho{precoLigado ? '' : ' — token não configurado'}. Horários das rotas
            criativas são estimados por distância.
          </p>
        </div>
      </section>
    </>
  );
}
