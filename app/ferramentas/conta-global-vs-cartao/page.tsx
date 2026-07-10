'use client';

import { useState } from 'react';

export default function ContaGlobalVsCartao() {
  const [valor, setValor] = useState(5000);
  const [cambio, setCambio] = useState(5.25);
  const iof = 6.38; // IOF cartão

  const cartao = valor * cambio * (1 + iof / 100);
  const contaGlobal = valor * cambio * 1.01; // taxa aproximada 1%

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Conta Global vs Cartão no Exterior</h1>
      <p className="text-zinc-400 mb-8">Fase 4 • Compare o custo real</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label>Valor em dólar (USD)</label>
          <input type="number" value={valor} onChange={e => setValor(+e.target.value)} className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-2xl" />
        </div>
        <div>
          <label>Taxa de câmbio</label>
          <input type="number" step="0.01" value={cambio} onChange={e => setCambio(+e.target.value)} className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-2xl" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="text-sm text-zinc-400">Cartão de Crédito</div>
          <div className="text-5xl font-bold tracking-tight mt-4">R$ {cartao.toFixed(2)}</div>
          <div className="text-xs text-red-400 mt-2">IOF 6,38% + spread do banco</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="text-sm text-zinc-400">Conta Global / Wise / Nomad</div>
          <div className="text-5xl font-bold tracking-tight mt-4 text-emerald-400">R$ {contaGlobal.toFixed(2)}</div>
          <div className="text-xs text-emerald-400 mt-2">Taxa aproximada de 1%</div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-zinc-400">
        Economia usando Conta Global: <span className="text-emerald-400 font-medium">R$ {(cartao - contaGlobal).toFixed(2)}</span>
      </div>
    </div>
  );
}
