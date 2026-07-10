'use client';

import { useMemo, useState } from 'react';
import { passagens, regioes } from '@/lib/data/passagens';
import {
  calcularQuantoValem,
  VALORES_REFERENCIA,
} from '@/lib/calculations/milheiro';

type Cabine = 'economica' | 'executiva';

export default function DestinosMaisBaratos() {
  const [cabine, setCabine] = useState<Cabine>('economica');
  const [regiao, setRegiao] = useState<string>('todas');

  const lista = useMemo(() => {
    return passagens
      .filter((p) => p.cabine === cabine)
      .filter((p) => regiao === 'todas' || p.regiao === regiao)
      .map((p) => ({
        ...p,
        valor: calcularQuantoValem(p.milhas, VALORES_REFERENCIA[p.programa].alto),
      }))
      .sort((a, b) => a.milhas - b.milhas);
  }, [cabine, regiao]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Destinos Mais Baratos em Milhas</h1>
      <p className="text-zinc-400 mb-6">Fase 2 • Ordenado pelo menor custo em milhas</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex gap-2">
          {(['economica', 'executiva'] as Cabine[]).map((c) => (
            <button
              key={c}
              onClick={() => setCabine(c)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                cabine === c ? 'bg-emerald-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              {c === 'economica' ? 'Econômica' : 'Executiva'}
            </button>
          ))}
        </div>
        <select
          value={regiao}
          onChange={(e) => setRegiao(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm"
        >
          <option value="todas">Todas as regiões</option>
          {regioes.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {lista.length === 0 ? (
        <div className="text-zinc-400">Nenhuma passagem para os filtros escolhidos.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {lista.map((d, i) => (
            <div key={i} className="border border-zinc-800 rounded-2xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-xl">{d.destino}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {d.origem} • {d.regiao}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-mono text-lg">
                    {d.milhas.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-zinc-500">milhas</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-sm text-zinc-400">
                <span>Melhor com {d.programa}</span>
                <span>~R$ {d.valor.toFixed(0)} em milhas</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
