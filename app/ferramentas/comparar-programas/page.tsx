'use client';

import { useMemo, useState } from 'react';
import { programasInfo } from '@/lib/data/programas';
import { VALORES_REFERENCIA } from '@/lib/calculations/milheiro';

type Filtro = 'todos' | 'Companhia aérea' | 'Banco de pontos';

export default function CompararProgramas() {
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const linhas = useMemo(() => {
    return programasInfo
      .filter((p) => filtro === 'todos' || p.tipo === filtro)
      .map((p) => ({
        ...p,
        ref: VALORES_REFERENCIA[p.programa],
      }))
      .sort((a, b) => b.ref.alto - a.ref.alto);
  }, [filtro]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Comparador de Programas de Milhas</h1>
      <p className="text-zinc-400 mb-6">
        Fase 1 • Milheiro de referência (julho/2026), validade, clube e paridades — lado a lado
      </p>

      <div className="flex gap-2 mb-6">
        {(['todos', 'Companhia aérea', 'Banco de pontos'] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              filtro === f ? 'bg-emerald-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600'
            }`}
          >
            {f === 'todos' ? 'Todos' : f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900 text-zinc-400 text-left">
              <th className="px-4 py-3 font-medium">Programa</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Milheiro ref. (R$)</th>
              <th className="px-4 py-3 font-medium">Validade</th>
              <th className="px-4 py-3 font-medium">Clube</th>
              <th className="px-4 py-3 font-medium">Paridades</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((p) => (
              <tr key={p.programa} className="border-t border-zinc-800">
                <td className="px-4 py-3 font-semibold">{p.programa}</td>
                <td className="px-4 py-3 text-zinc-400">{p.tipo}</td>
                <td className="px-4 py-3 font-mono">
                  {p.ref.baixo} – <span className="text-emerald-400">{p.ref.alto}</span>
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  {p.validadeMeses === null ? 'Não expira' : `${p.validadeMeses} meses`}
                </td>
                <td className="px-4 py-3">{p.temClube ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {p.paridades.length > 0 ? p.paridades.join(', ') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Milheiro de referência = faixa de valor por 1.000 milhas observada no mercado. Quanto maior,
        mais valiosas as milhas do programa.
      </p>
    </div>
  );
}
