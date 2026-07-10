import Link from 'next/link';
import { reviews } from '@/lib/data/editorial';

export const metadata = { title: 'Reviews' };

export default function Reviews() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Reviews</h1>
      <p className="text-zinc-400 mb-8">Fase 5 • Análises aprofundadas de cartões e programas</p>

      <div className="space-y-6">
        {reviews.map((review) => (
          <Link
            key={review.slug}
            href={`/editorial/reviews/${review.slug}`}
            className="block border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full">{review.tipo}</span>
                <h3 className="text-2xl font-semibold mt-3">{review.nome}</h3>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-emerald-400">{review.nota}</div>
                <div className="text-xs text-zinc-500">/10</div>
              </div>
            </div>

            <p className="mt-6 text-lg text-zinc-300">{review.resumo}</p>

            <div className="mt-6 text-xs text-zinc-500 flex justify-between">
              <span>Atualizado em {review.atualizado}</span>
              <span className="text-emerald-400">Ler análise completa →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
