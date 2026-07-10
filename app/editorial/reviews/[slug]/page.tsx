import Link from 'next/link';
import { notFound } from 'next/navigation';
import { reviews, getReview } from '@/lib/data/editorial';

export function generateStaticParams() {
  return reviews.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const review = getReview(slug);
  return { title: review ? `Review: ${review.nome}` : 'Review' };
}

export default async function ReviewDetalhe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const review = getReview(slug);
  if (!review) notFound();

  return (
    <article className="max-w-3xl mx-auto p-8">
      <Link href="/editorial/reviews" className="text-sm text-zinc-400 hover:text-white">
        ← Todas as reviews
      </Link>

      <div className="flex justify-between items-start mt-6">
        <div>
          <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full">{review.tipo}</span>
          <h1 className="text-4xl font-bold tracking-tight mt-3">{review.nome}</h1>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold text-emerald-400">{review.nota}</div>
          <div className="text-xs text-zinc-500">/10</div>
        </div>
      </div>

      <p className="mt-6 text-lg text-zinc-300">{review.resumo}</p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="border border-emerald-900/50 rounded-2xl p-6">
          <div className="text-sm font-semibold text-emerald-400 mb-3">Prós</div>
          <ul className="space-y-2 text-sm text-zinc-300">
            {review.pros.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-400">+</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-red-900/50 rounded-2xl p-6">
          <div className="text-sm font-semibold text-red-400 mb-3">Contras</div>
          <ul className="space-y-2 text-sm text-zinc-300">
            {review.contras.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-red-400">−</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {review.secoes.map((secao, i) => (
          <section key={i}>
            <h2 className="text-2xl font-semibold mb-3">{secao.titulo}</h2>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              {secao.paragrafos.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 text-xs text-zinc-500">Atualizado em {review.atualizado}</div>
    </article>
  );
}
