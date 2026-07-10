'use client';

import { useMemo, useState } from 'react';
import { bonusAtivos, mediaHistoricaRota } from '@/lib/data/bonus';
import {
  calcularQuantoValem,
  VALORES_REFERENCIA,
  type Programa,
} from '@/lib/calculations/milheiro';

const destinos: Programa[] = ['Smiles', 'LATAM', 'Azul', 'TAP'];

function melhorBonus(origem: string, destino: string) {
  const ativos = bonusAtivos().filter((b) => b.origem === origem && b.destino === destino);
  if (ativos.length === 0) return null;
  return ativos.reduce((max, b) => (b.percentual > max.percentual ? b : max));
}

export default function LiveloVsEsfera() {
  const [pontos, setPontos] = useState(50000);
  const [destino, setDestino] = useState<Programa>('LATAM');

  const analise = useMemo(() => {
    const ref = VALORES_REFERENCIA[destino];
    return (['Livelo', 'Esfera'] as const).map((origem) => {
      const bonus = melhorBonus(origem, destino);
      const percentual = bonus?.percentual ?? 0;
      const milhasFinais = Math.round(pontos * (1 + percentual / 100));
      const valor = calcularQuantoValem(milhasFinais, ref.alto);
      return {
        origem,
        percentual,
        temBonus: bonus !== null,
        milhasFinais,
        valor,
        media: mediaHistoricaRota(origem, destino),
      };
    });
  }, [pontos, destino]);

  const vencedor = analise.reduce((a, b) => (b.valor > a.valor ? b : a));

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Livelo vs Esfera</h1>
      <p className="text-zinc-400 mb-8">
        Fase 1 • Com os bônus ativos, qual banco de pontos rende mais para o seu destino
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Quantos pontos você tem</label>
          <input
            type="number"
            value={pontos}
            onChange={(e) => setPontos(+e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-2xl font-mono"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Programa de destino</label>
          <select
            value={destino}
            onChange={(e) => setDestino(e.target.value as Programa)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-xl"
          >
            {destinos.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {analise.map((a) => {
          const isVencedor = a.origem === vencedor.origem && vencedor.valor > 0;
          return (
            <div
              key={a.origem}
              className={`rounded-3xl p-8 border ${
                isVencedor ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{a.origem}</div>
                {isVencedor && (
                  <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                    Melhor opção
                  </span>
                )}
              </div>

              <div className="mt-6">
                <div className="text-sm text-zinc-400">Bônus ativo para {destino}</div>
                <div className="text-4xl font-bold mt-1">
                  {a.temBonus ? `+${a.percentual}%` : '—'}
                </div>
                {!a.temBonus && (
                  <div className="text-xs text-zinc-500 mt-1">Sem campanha ativa nesta rota</div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-zinc-400">Milhas finais</div>
                  <div className="font-mono text-lg">{a.milhasFinais.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Valor estimado</div>
                  <div className="font-mono text-lg text-emerald-400">R$ {a.valor.toFixed(0)}</div>
                </div>
              </div>

              {a.media !== null && (
                <div className="mt-3 text-xs text-zinc-500">Média histórica: {a.media.toFixed(0)}%</div>
              )}
            </div>
          );
        })}
      </div>

      {vencedor.valor > 0 && (
        <p className="mt-6 text-center text-zinc-400">
          Para {destino}, <span className="text-emerald-400 font-medium">{vencedor.origem}</span> rende
          mais agora: {vencedor.milhasFinais.toLocaleString('pt-BR')} milhas (~R$ {vencedor.valor.toFixed(0)}).
        </p>
      )}
    </div>
  );
}
