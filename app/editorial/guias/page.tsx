import Link from 'next/link';
import { guias } from '@/lib/data/editorial';

export const metadata = { title: 'Guias' };

export default function Guias() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Guias</h1>
      <p className="text-zinc-400 mb-8">Fase 5 • Conteúdo editorial aprofundado</p>

      <div className="grid md:grid-cols-2 gap-6">
        {guias.map((guia) => (
          <Link
            key={guia.slug}
            href={`/editorial/guias/${guia.slug}`}
            className="block border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 group transition-colors"
          >
            <div className="flex justify-between text-xs mb-4">
              <span className="px-3 py-1 bg-zinc-800 rounded-full">{guia.categoria}</span>
              <span className="text-zinc-500">
                {guia.tempoLeitura} • {guia.nivel}
              </span>
            </div>
            <h3 className="text-2xl font-semibold leading-tight group-hover:text-emerald-400 transition-colors">
              {guia.titulo}
            </h3>
            <p className="mt-3 text-sm text-zinc-400">{guia.resumo}</p>
            <div className="mt-6 text-sm text-emerald-400">Ler guia completo →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
