'use client';

import { useState } from 'react';
import { cartoes } from '@/lib/data/cartoes';
import {
  calcularQuantoValem,
  getVeredito,
  getVereditoColor,
  getVereditoLabel,
  VALORES_REFERENCIA,
  type Programa,
} from '@/lib/calculations/milheiro';

const programas: Programa[] = ['LATAM', 'Smiles', 'Livelo', 'Esfera', 'Azul'];

export default function AnuidadeLiquida() {
  const [cartaoIdx, setCartaoIdx] = useState(0);
  const [gastoMensal, setGastoMensal] = useState(4000);
  const [cambio, setCambio] = useState(5.3);
  const [programa, setPrograma] = useState<Programa>('LATAM');

  const cartao = cartoes[cartaoIdx];

  // Pontos gerados no ano: gasto anual convertido em dólar × pontos por dólar
  const gastoAnualUSD = (gastoMensal * 12) / cambio;
  const pontosAno = Math.round(gastoAnualUSD * cartao.pontosPorDolar);
  const valorPontos = calcularQuantoValem(pontosAno, VALORES_REFERENCIA[programa].alto);
  const anuidadeLiquida = cartao.anuidade - valorPontos;
  const veredito = getVeredito(VALORES_REFERENCIA[programa].alto, programa);
  const sePagaSozinho = anuidadeLiquida <= 0;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Anuidade Líquida do Cartão</h1>
      <p className="text-zinc-400 mb-8">
        Fase 4 • Desconte o valor das milhas geradas para saber o custo real do cartão
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Cartão</label>
          <select
            value={cartaoIdx}
            onChange={(e) => setCartaoIdx(+e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-lg"
          >
            {cartoes.map((c, i) => (
              <option key={c.nome} value={i}>
                {c.nome} — {c.anuidade === 0 ? 'sem anuidade' : `R$ ${c.anuidade}/ano`}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Gasto mensal no cartão (R$)</label>
            <input
              type="number"
              value={gastoMensal}
              onChange={(e) => setGastoMensal(+e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-2xl"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Câmbio de pontuação (R$/US$)</label>
            <input
              type="number"
              step="0.01"
              value={cambio}
              onChange={(e) => setCambio(+e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-2xl"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Programa para avaliar as milhas</label>
          <select
            value={programa}
            onChange={(e) => setPrograma(e.target.value as Programa)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-lg"
          >
            {programas.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-zinc-400">Milhas geradas por ano</div>
            <div className="text-4xl font-bold tracking-tight mt-2">{pontosAno.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-zinc-500 mt-1">valem R$ {valorPontos.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Anuidade líquida (custo real)</div>
            <div
              className={`text-4xl font-bold tracking-tight mt-2 ${
                sePagaSozinho ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {sePagaSozinho ? '-' : ''}R$ {Math.abs(anuidadeLiquida).toFixed(2)}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {sePagaSozinho ? 'as milhas cobrem a anuidade' : 'ainda sobra a pagar'}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 flex items-center justify-between">
          <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${getVereditoColor(veredito)}`}>
            Milheiro {getVereditoLabel(veredito)} para {programa}
          </div>
          <div className="text-right text-sm text-zinc-400">
            {cartao.anuidade === 0
              ? 'Cartão sem anuidade — tudo que gera é lucro'
              : sePagaSozinho
              ? 'Vale manter: as milhas pagam a anuidade'
              : 'Reavalie: as milhas não cobrem a anuidade'}
          </div>
        </div>
      </div>
    </div>
  );
}
