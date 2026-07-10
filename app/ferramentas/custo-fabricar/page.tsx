'use client';

import { useState } from 'react';
import { calcularCustoFabricar, getVeredito, getVereditoColor, getVereditoLabel, type Programa } from '@/lib/calculations/milheiro';

const programas: Programa[] = ['LATAM', 'Smiles', 'Livelo', 'Esfera'];

export default function CustoFabricar() {
  const [custo, setCusto] = useState(1200);
  const [pontos, setPontos] = useState(50000);
  const [bonus, setBonus] = useState(80);
  const [programa, setPrograma] = useState<Programa>('LATAM');

  const valor = calcularCustoFabricar(custo, pontos, bonus);
  const veredito = getVeredito(valor, programa);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Custo de Fabricar Milhas</h1>
      <p className="text-zinc-400 mb-8">Fase 1 • Fórmula reutilizada do original</p>

      <div className="space-y-6">
        <div>
          <label>Custo Total (R$)</label>
          <input type="number" value={custo} onChange={e => setCusto(+e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 mt-2" />
        </div>
        <div>
          <label>Pontos adquiridos</label>
          <input type="number" value={pontos} onChange={e => setPontos(+e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 mt-2" />
        </div>
        <div>
          <label>Bônus de transferência (%)</label>
          <input type="number" value={bonus} onChange={e => setBonus(+e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 mt-2" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mt-8">
          <div className="text-sm text-zinc-400">Custo efetivo por milheiro</div>
          <div className="text-6xl font-bold tracking-tighter mt-2">R$ {valor.toFixed(2)}</div>
          <div className={`inline-block mt-4 px-4 py-1 rounded-full text-sm ${getVereditoColor(veredito)}`}>
            {getVereditoLabel(veredito)}
          </div>
        </div>
      </div>
    </div>
  );
}
