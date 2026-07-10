import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guias, getGuia } from '@/lib/data/editorial';

export function generateStaticParams() {
  return guias.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guia = getGuia(slug);
  return { title: guia?.titulo ?? 'Guia' };
}

export default async function GuiaDetalhe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guia = getGuia(slug);
  if (!guia) notFound();

  return (
    <article className="max-w-3xl mx-auto p-8">
      <Link href="/editorial/guias" className="text-sm text-zinc-400 hover:text-white">
        ← Todos os guias
      </Link>

      <div className="flex gap-3 text-xs mt-6 mb-4">
        <span className="px-3 py-1 bg-zinc-800 rounded-full">{guia.categoria}</span>
        <span className="text-zinc-500">
          {guia.tempoLeitura} • {guia.nivel}
        </span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">{guia.titulo}</h1>
      <p className="mt-4 text-lg text-zinc-300">{guia.resumo}</p>

      <div className="mt-10 space-y-10">
        {guia.secoes.map((secao, i) => (
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
    </article>
  );
}
