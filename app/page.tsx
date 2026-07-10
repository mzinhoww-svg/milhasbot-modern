import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-6xl font-bold tracking-tighter">MilhasBot</h1>
            <p className="text-xl text-zinc-400 mt-2">Modernizado • Next.js + Supabase</p>
          </div>
          <div className="text-right text-sm text-zinc-500">
            Fase 0 • Reutilização máxima<br />
            das fórmulas originais
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            href="/calculadora/milheiro" 
            className="group block border border-zinc-800 hover:border-zinc-700 rounded-3xl p-8 transition-all"
          >
            <div className="text-emerald-400 text-sm font-medium mb-3">FERRAMENTA P0</div>
            <h3 className="text-3xl font-semibold mb-3 group-hover:text-emerald-400 transition-colors">
              Calculadora do Milheiro
            </h3>
            <p className="text-zinc-400">
              4 modos completos • Vereditos automáticos • Valores de referência julho/2026
            </p>
            <div className="mt-6 text-sm text-emerald-400">Abrir calculadora →</div>
          </Link>

          <Link 
            href="/calculadora/reversa" 
            className="group block border border-zinc-800 hover:border-zinc-700 rounded-3xl p-8 transition-all"
          >
            <div className="text-emerald-400 text-sm font-medium mb-3">FERRAMENTA P0</div>
            <h3 className="text-3xl font-semibold mb-3 group-hover:text-emerald-400 transition-colors">
              Calculadora Reversa
            </h3>
            <p className="text-zinc-400">
              Gasto mensal → Destinos possíveis • Bônus 1.8x • Busca em passagens
            </p>
            <div className="mt-6 text-sm text-emerald-400">Abrir calculadora →</div>
          </Link>
        </div>

        <div className="mt-16 text-center text-xs text-zinc-500">
          Todas as fórmulas e lógicas de veredito foram reutilizadas do MilhasBot original.
        </div>
      </div>
    </div>
  );
}
