'use client';

import { useState } from 'react';
import { calcularQuantoValem, getVeredito, getVereditoColor, getVereditoLabel, VALORES_REFERENCIA, type Programa } from '@/lib/calculations/milheiro';

const programas: Programa[] = ['LATAM', 'Smiles', 'Livelo', 'Esfera'];

export default function ComprasBonificadas() {
  const [valorCompra, setValorCompra] = useState(500);
  const [percentualMilhas, setPercentualMilhas] = useState(2.5);
  const [programa, setPrograma] = useState<Programa>('LATAM');

  const milhasGeradas = Math.floor(valorCompra * (percentualMilhas / 100));
  const valorMilheiro = VALORES_REFERENCIA[programa].alto;
  const valorDesconto = calcularQuantoValem(milhasGeradas, valorMilheiro);
  const veredito = getVeredito(valorMilheiro, programa);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Calculadora de Compras Bonificadas</h1>
      <p className="text-zinc-400 mb-8">Fase 1 • Descubra o desconto real da sua compra</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Valor da compra (R$)</label>
          <input
            type="number"
            value={valorCompra}
            onChange={e => setValorCompra(+e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-2xl"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">% de milhas/pontos gerados</label>
          <input
            type="number"
            step="0.1"
            value={percentualMilhas}
            onChange={e => setPercentualMilhas(+e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-2xl"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Programa</label>
          <select
            value={programa}
            onChange={e => setPrograma(e.target.value as Programa)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-xl"
          >
            {programas.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-zinc-400">Milhas geradas</div>
            <div className="text-5xl font-bold tracking-tighter mt-2">{milhasGeradas}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Desconto real obtido</div>
            <div className="text-5xl font-bold tracking-tighter mt-2 text-emerald-400">
              R$ {valorDesconto.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-400">Veredito do milheiro</div>
            <div className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-medium ${getVereditoColor(veredito)}`}>
              {getVereditoLabel(veredito)}
            </div>
          </div>
          <div className="text-right text-sm text-zinc-400">
            Usando valor alto de referência<br />de {programa}
          </div>
        </div>
      </div>
    </div>
  );
}
