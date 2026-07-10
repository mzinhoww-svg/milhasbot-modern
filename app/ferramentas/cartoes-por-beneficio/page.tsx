'use client';

import { useMemo, useState } from 'react';
import { cartoes, beneficiosDisponiveis, type Beneficio } from '@/lib/data/cartoes';

export default function CartoesPorBeneficio() {
  const [filtros, setFiltros] = useState<Beneficio[]>([]);

  const toggle = (b: Beneficio) =>
    setFiltros((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const lista = useMemo(() => {
    return cartoes
      .filter((c) => filtros.every((f) => c.beneficios.includes(f)))
      .sort((a, b) => b.nota - a.nota);
  }, [filtros]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Cartões por Benefício</h1>
      <p className="text-zinc-400 mb-6">
        Fase 4 • Selecione os benefícios que importam e veja só os cartões que os oferecem
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {beneficiosDisponiveis.map((b) => (
          <button
            key={b}
            onClick={() => toggle(b)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              filtros.includes(b)
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600'
            }`}
          >
            {b}
          </button>
        ))}
        {filtros.length > 0 && (
          <button
            onClick={() => setFiltros([])}
            className="px-4 py-2 rounded-full text-sm text-zinc-400 hover:text-white"
          >
            Limpar
          </button>
        )}
      </div>

      {lista.length === 0 ? (
        <div className="text-zinc-400">Nenhum cartão reúne todos os benefícios selecionados.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {lista.map((cartao, index) => (
            <div
              key={index}
              className="border border-zinc-800 rounded-3xl p-6 hover:border-zinc-600 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-lg">{cartao.nome}</div>
                  <div className="text-sm text-zinc-400">{cartao.banco}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400">Nota</div>
                  <div className="text-2xl font-bold text-emerald-400">{cartao.nota}</div>
                </div>
              </div>

              <div className="my-6">
                <div className="text-sm text-zinc-400">Anuidade</div>
                <div className="text-3xl font-semibold mt-1">
                  {cartao.anuidade === 0 ? 'Grátis' : `R$ ${cartao.anuidade}`}
                </div>
              </div>

              <div>
                <div className="text-sm text-zinc-400 mb-2">Benefícios</div>
                <ul className="space-y-1.5 text-sm">
                  {cartao.beneficios.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-400">•</span> {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800 text-sm">
                <span className="font-mono text-emerald-400">{cartao.pontosPorDolar}</span> pontos por
                US$1 gasto
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
