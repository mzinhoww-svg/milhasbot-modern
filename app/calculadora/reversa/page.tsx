'use client';

import { useState } from 'react';
import { calcularAcumuloAnual, buscarDestinosCompativeis } from '@/lib/calculations/reversa';

export default function CalculadoraReversa() {
  const [gasto, setGasto] = useState(4500);
  const [cambio, setCambio] = useState(5.2);

  const milhasAnuais = calcularAcumuloAnual(gasto, cambio);
  const destinos = buscarDestinosCompativeis(milhasAnuais, 'economica');

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Calculadora Reversa de Milhas</h1>
      <p className="text-gray-600 mb-8">Descubra para onde você pode ir com o que acumula todo mês (reutiliza lógica original + 1.8x bônus)</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label>Gasto mensal no cartão (R$)</label>
            <input type="number" value={gasto} onChange={e => setGasto(+e.target.value)} className="w-full border rounded-lg px-4 py-3 text-2xl mt-1" />
          </div>
          <div>
            <label>Taxa de câmbio (USD)</label>
            <input type="number" step="0.1" value={cambio} onChange={e => setCambio(+e.target.value)} className="w-full border rounded-lg px-4 py-3 text-2xl mt-1" />
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-8">
          <div className="text-sm text-gray-500">Milhas estimadas por ano (com bônus 80%)</div>
          <div className="text-6xl font-bold tracking-tight mt-2">{milhasAnuais.toLocaleString('pt-BR')}</div>
          <p className="text-xs text-gray-500 mt-4">Fórmula: Gasto × 12 × Câmbio × Multiplicador × 1.8</p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-semibold mb-4">Destinos possíveis com esse acúmulo (Econômica)</h3>
        <div className="grid gap-3">
          {destinos.slice(0, 8).map((d, i) => (
            <div key={i} className="flex justify-between items-center border rounded-2xl px-6 py-4">
              <div>
                <span className="font-medium">{d.destino}</span>
                <span className="ml-3 text-sm text-gray-500">{d.programa}</span>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg">{d.milhasNecessarias.toLocaleString()} milhas</div>
                <div className="text-xs text-emerald-600">{d.veredito}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
