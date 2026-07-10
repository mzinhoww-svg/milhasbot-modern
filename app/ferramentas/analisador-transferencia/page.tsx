'use client';

import { useState } from 'react';

interface BonusRecord {
  date: string;
  bonus: number;
  from: string;
  to: string;
}

const historicalBonuses: BonusRecord[] = [
  { date: '2026-06-12', bonus: 80, from: 'Livelo', to: 'Smiles' },
  { date: '2026-05-28', bonus: 100, from: 'Esfera', to: 'LATAM' },
  { date: '2026-04-15', bonus: 65, from: 'Livelo', to: 'Azul' },
  { date: '2026-03-22', bonus: 120, from: 'Esfera', to: 'Smiles' },
  { date: '2026-02-10', bonus: 75, from: 'Livelo', to: 'LATAM' },
];

export default function AnalisadorTransferencia() {
  const [fromProgram, setFromProgram] = useState('Livelo');
  const [toProgram, setToProgram] = useState('Smiles');
  const [points, setPoints] = useState(50000);
  const [currentBonus, setCurrentBonus] = useState(80);

  // Calculate historical average for this route
  const relevantHistory = historicalBonuses.filter(
    b => b.from === fromProgram && b.to === toProgram
  );
  
  const historicalAverage = relevantHistory.length > 0 
    ? relevantHistory.reduce((sum, b) => sum + b.bonus, 0) / relevantHistory.length 
    : 75; // default average

  const pointsNow = Math.floor(points * (1 + currentBonus / 100));
  const pointsHistorical = Math.floor(points * (1 + historicalAverage / 100));

  const difference = pointsNow - pointsHistorical;
  const isGoodDeal = currentBonus >= historicalAverage;

  const recommendation = isGoodDeal 
    ? "Bom momento para transferir" 
    : "Considere esperar por um bônus melhor";

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Analisador de Transferência Bonificada</h1>
      <p className="text-zinc-400 mb-8">Fase 3 • Compare o bônus atual com o histórico real</p>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="text-sm text-zinc-400">De qual programa</label>
            <select 
              value={fromProgram} 
              onChange={e => setFromProgram(e.target.value)}
              className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3"
            >
              <option>Livelo</option>
              <option>Esfera</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400">Para qual programa</label>
            <select 
              value={toProgram} 
              onChange={e => setToProgram(e.target.value)}
              className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3"
            >
              <option>Smiles</option>
              <option>LATAM</option>
              <option>Azul</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400">Quantos pontos deseja transferir</label>
            <input 
              type="number" 
              value={points} 
              onChange={e => setPoints(Number(e.target.value))}
              className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-2xl font-mono"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Bônus atual anunciado (%)</label>
            <input 
              type="number" 
              value={currentBonus} 
              onChange={e => setCurrentBonus(Number(e.target.value))}
              className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-2xl font-mono"
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 h-full">
            <div className="space-y-8">
              <div>
                <div className="text-sm text-zinc-400">Bônus atual vs Média histórica</div>
                <div className="flex items-end gap-4 mt-2">
                  <div>
                    <span className="text-6xl font-bold tracking-tighter">{currentBonus}</span>
                    <span className="text-2xl text-zinc-400">%</span>
                  </div>
                  <div className="text-emerald-400 text-xl pb-2">
                    vs {historicalAverage.toFixed(0)}% média
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-zinc-400">Pontos que você recebe agora</div>
                  <div className="text-4xl font-bold tracking-tight mt-1">{pointsNow.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Se usasse a média histórica</div>
                  <div className="text-4xl font-bold tracking-tight mt-1 text-zinc-400">{pointsHistorical.toLocaleString('pt-BR')}</div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl ${isGoodDeal ? 'bg-emerald-500/10' : 'bg-yellow-500/10'}`}>
                <div className={`font-semibold ${isGoodDeal ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {recommendation}
                </div>
                <div className="text-sm text-zinc-400 mt-1">
                  {difference > 0 
                    ? `Você ganha ${difference.toLocaleString('pt-BR')} pontos extras agora` 
                    : `Você perderia ${Math.abs(difference).toLocaleString('pt-BR')} pontos em relação à média histórica`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
