'use client';

import { useMemo, useState } from 'react';
import { passagens, regioes } from '@/lib/data/passagens';
import { calcularQuantoValem, VALORES_REFERENCIA } from '@/lib/calculations/milheiro';

type Cabine = 'todas' | 'economica' | 'executiva';

export default function BuscadorPassagens() {
  const [destino, setDestino] = useState('');
  const [regiao, setRegiao] = useState('todas');
  const [cabine, setCabine] = useState<Cabine>('todas');
  const [maxMilhas, setMaxMilhas] = useState(0);

  const resultados = useMemo(() => {
    return passagens
      .filter((p) => (destino ? p.destino.toLowerCase().includes(destino.toLowerCase()) : true))
      .filter((p) => (regiao === 'todas' ? true : p.regiao === regiao))
      .filter((p) => (cabine === 'todas' ? true : p.cabine === cabine))
      .filter((p) => (maxMilhas > 0 ? p.milhas <= maxMilhas : true))
      .map((p) => ({ ...p, valor: calcularQuantoValem(p.milhas, VALORES_REFERENCIA[p.programa].alto) }))
      .sort((a, b) => a.milhas - b.milhas);
  }, [destino, regiao, cabine, maxMilhas]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Buscador de Passagens em Milhas</h1>
      <p className="text-zinc-400 mb-8">Fase 2 • Filtre a base de passagens de referência</p>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2">
          <label className="block text-sm text-zinc-400 mb-2">Destino</label>
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Ex.: Madri, Buenos Aires…"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Região</label>
          <select
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3"
          >
            <option value="todas">Todas</option>
            {regioes.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Máx. de milhas</label>
          <input
            type="number"
            value={maxMilhas || ''}
            onChange={(e) => setMaxMilhas(+e.target.value)}
            placeholder="sem limite"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['todas', 'economica', 'executiva'] as Cabine[]).map((c) => (
          <button
            key={c}
            onClick={() => setCabine(c)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              cabine === c
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600'
            }`}
          >
            {c === 'todas' ? 'Todas as cabines' : c === 'economica' ? 'Econômica' : 'Executiva'}
          </button>
        ))}
      </div>

      <div className="text-sm text-zinc-500 mb-4">{resultados.length} passagem(ns) encontrada(s)</div>

      {resultados.length === 0 ? (
        <div className="text-zinc-400">Nenhuma passagem para os filtros escolhidos.</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900 text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium">Destino</th>
                <th className="px-4 py-3 font-medium">Origem</th>
                <th className="px-4 py-3 font-medium">Cabine</th>
                <th className="px-4 py-3 font-medium">Programa</th>
                <th className="px-4 py-3 font-medium">Milhas</th>
                <th className="px-4 py-3 font-medium">Valor est.</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  <td className="px-4 py-3 font-semibold">{r.destino}</td>
                  <td className="px-4 py-3 text-zinc-400">{r.origem}</td>
                  <td className="px-4 py-3 text-zinc-400 capitalize">{r.cabine}</td>
                  <td className="px-4 py-3">{r.programa}</td>
                  <td className="px-4 py-3 font-mono text-emerald-400">
                    {r.milhas.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-400">R$ {r.valor.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
