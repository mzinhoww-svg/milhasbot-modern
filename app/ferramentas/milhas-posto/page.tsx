'use client';

import { useState } from 'react';
import {
  calcularQuantoValem,
  getVeredito,
  getVereditoColor,
  getVereditoLabel,
  VALORES_REFERENCIA,
  type Programa,
} from '@/lib/calculations/milheiro';

// Programas de posto (referência) → pontos por real gasto e programa de milhas destino
const programasPosto = [
  { nome: 'Shell Box → Esfera', pontosPorReal: 2, destino: 'Esfera' as Programa },
  { nome: 'Petrobras Premmia → Smiles', pontosPorReal: 1, destino: 'Smiles' as Programa },
  { nome: 'Ipiranga (abastece aí) → Km de Vantagens', pontosPorReal: 1.5, destino: 'Livelo' as Programa },
];

export default function MilhasPosto() {
  const [gastoMensal, setGastoMensal] = useState(600);
  const [idx, setIdx] = useState(0);

  const prog = programasPosto[idx];
  const pontosAno = Math.round(gastoMensal * 12 * prog.pontosPorReal);
  const ref = VALORES_REFERENCIA[prog.destino];
  const valorAno = calcularQuantoValem(pontosAno, ref.alto);
  const veredito = getVeredito(ref.alto, prog.destino);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Milhas de Posto de Combustível</h1>
      <p className="text-zinc-400 mb-8">
        Fase 1 • Quanto você acumula abastecendo, por ano, e quanto isso vale
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Gasto mensal em combustível (R$)</label>
          <input
            type="number"
            value={gastoMensal}
            onChange={(e) => setGastoMensal(+e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-2xl"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Programa do posto</label>
          <select
            value={idx}
            onChange={(e) => setIdx(+e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-lg"
          >
            {programasPosto.map((p, i) => (
              <option key={p.nome} value={i}>
                {p.nome} ({p.pontosPorReal} pts/R$)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-zinc-400">Pontos acumulados por ano</div>
            <div className="text-5xl font-bold tracking-tight mt-2">
              {pontosAno.toLocaleString('pt-BR')}
            </div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Valor estimado por ano</div>
            <div className="text-5xl font-bold tracking-tight mt-2 text-emerald-400">
              R$ {valorAno.toFixed(0)}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-800 flex items-center justify-between">
          <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${getVereditoColor(veredito)}`}>
            Milheiro {getVereditoLabel(veredito)} em {prog.destino}
          </div>
          <div className="text-sm text-zinc-400">
            Equivale a ~R$ {(valorAno / 12).toFixed(0)}/mês em milhas
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Pontos por real são de referência e variam conforme promoções, tipo de combustível e
        cadastro no programa.
      </p>
    </div>
  );
}
