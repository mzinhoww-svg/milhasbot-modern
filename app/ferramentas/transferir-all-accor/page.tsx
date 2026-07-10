'use client';

import { useState } from 'react';

// Paridade base de pontos bancários → ALL Accor (referência)
const PARIDADE_BASE = 2; // 2 pontos = 1 ponto ALL (1:0,5 aprox.)
const VALOR_PONTO_ALL = 0.02; // ~R$ 0,02 por ponto ALL (referência de resgate em diárias)

export default function TransferirALLAccor() {
  const [pontos, setPontos] = useState(60000);
  const [bonus, setBonus] = useState(0);

  const pontosAll = Math.round((pontos / PARIDADE_BASE) * (1 + bonus / 100));
  const valorEstimado = pontosAll * VALOR_PONTO_ALL;
  const valeApena = bonus >= 30;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Transferir para ALL Accor</h1>
      <p className="text-zinc-400 mb-8">Fase 3 • Simule a conversão e veja quando compensa</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Pontos a transferir</label>
          <input
            type="number"
            value={pontos}
            onChange={(e) => setPontos(+e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-2xl font-mono"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Bônus da campanha (%)</label>
          <input
            type="number"
            value={bonus}
            onChange={(e) => setBonus(+e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-2xl font-mono"
          />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-zinc-400">Pontos ALL Accor recebidos</div>
            <div className="text-5xl font-bold tracking-tight mt-2">
              {pontosAll.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              Paridade base ~{PARIDADE_BASE}:1 {bonus > 0 ? `+ ${bonus}% de bônus` : ''}
            </div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Valor estimado em diárias</div>
            <div className="text-5xl font-bold tracking-tight mt-2 text-emerald-400">
              R$ {valorEstimado.toFixed(0)}
            </div>
            <div className="text-xs text-zinc-500 mt-1">~R$ {VALOR_PONTO_ALL.toFixed(2)} por ponto ALL</div>
          </div>
        </div>

        <div
          className={`mt-8 p-4 rounded-2xl ${valeApena ? 'bg-emerald-500/10' : 'bg-yellow-500/10'}`}
        >
          <div className={`font-semibold ${valeApena ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {valeApena ? 'Momento interessante para transferir' : 'Considere esperar um bônus maior'}
          </div>
          <div className="text-sm text-zinc-400 mt-1">
            ALL Accor costuma valer a pena com bônus a partir de 30%, ou para quem tem estadias
            confirmadas na rede Accor.
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Valores de paridade e resgate são de referência e variam conforme a campanha e a diária do
        hotel.
      </p>
    </div>
  );
}
