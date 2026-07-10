'use client';

import { useState } from 'react';

export default function CustoNoExterior() {
  const [valorUSD, setValorUSD] = useState(1000);
  const [cambio, setCambio] = useState(5.30);
  const iofCartao = 6.38;
  const spreadBanco = 4; // spread médio dos bancos
  const taxaContaGlobal = 1.5;

  const custoCartao = valorUSD * cambio * (1 + (iofCartao + spreadBanco) / 100);
  const custoContaGlobal = valorUSD * cambio * (1 + taxaContaGlobal / 100);
  const economia = custoCartao - custoContaGlobal;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Custo no Exterior (IOF e Câmbio)</h1>
      <p className="text-zinc-400 mb-8">Fase 4 • Entenda o impacto real das taxas</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label>Valor em dólar (USD)</label>
          <input type="number" value={valorUSD} onChange={e => setValorUSD(+e.target.value)} className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-2xl" />
        </div>
        <div>
          <label>Taxa de câmbio (R$/USD)</label>
          <input type="number" step="0.01" value={cambio} onChange={e => setCambio(+e.target.value)} className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-2xl" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-red-900/50 rounded-3xl p-8">
          <div className="text-sm text-red-400">Cartão de Crédito</div>
          <div className="text-6xl font-bold tracking-tight mt-4 text-red-400">R$ {custoCartao.toFixed(2)}</div>
          <div className="mt-4 text-xs text-zinc-400 space-y-1">
            <div>IOF: {iofCartao}%</div>
            <div>Spread médio banco: {spreadBanco}%</div>
            <div>Total de taxas: ~{iofCartao + spreadBanco}%</div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8">
          <div className="text-sm text-emerald-400">Conta Global / Wise / Nomad</div>
          <div className="text-6xl font-bold tracking-tight mt-4 text-emerald-400">R$ {custoContaGlobal.toFixed(2)}</div>
          <div className="mt-4 text-xs text-zinc-400">
            Taxa aproximada: {taxaContaGlobal}%
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="text-sm text-zinc-400">Economia usando Conta Global</div>
        <div className="text-4xl font-bold text-emerald-400 mt-1">R$ {economia.toFixed(2)}</div>
      </div>
    </div>
  );
}
