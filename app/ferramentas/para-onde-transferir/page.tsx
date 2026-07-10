'use client';

import { useMemo, useState } from 'react';
import { bonusAtivos, mediaHistoricaRota, vereditoBonus } from '@/lib/data/bonus';
import {
  calcularQuantoValem,
  VALORES_REFERENCIA,
  type Programa,
} from '@/lib/calculations/milheiro';

const origens = ['Livelo', 'Esfera'];

export default function ParaOndeTransferir() {
  const [origem, setOrigem] = useState('Livelo');
  const [pontos, setPontos] = useState(50000);

  const recomendacoes = useMemo(() => {
    return bonusAtivos()
      .filter((b) => b.origem === origem)
      .map((b) => {
        const milhasFinais = Math.round(pontos * (1 + b.percentual / 100));
        const ref = VALORES_REFERENCIA[b.destino as Programa];
        const valor = ref ? calcularQuantoValem(milhasFinais, ref.alto) : 0;
        const media = mediaHistoricaRota(b.origem, b.destino);
        return {
          ...b,
          milhasFinais,
          valor,
          media,
          veredito: vereditoBonus(b.percentual, media),
        };
      })
      .sort((a, b) => b.valor - a.valor);
  }, [origem, pontos]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Para Onde Transferir?</h1>
      <p className="text-zinc-400 mb-8">
        Fase 3 • Com base nos bônus ativos, veja onde seus pontos rendem mais
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">De qual programa</label>
          <select
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-xl"
          >
            {origens.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Quantos pontos você tem</label>
          <input
            type="number"
            value={pontos}
            onChange={(e) => setPontos(+e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-2xl font-mono"
          />
        </div>
      </div>

      {recomendacoes.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-zinc-400">
          Nenhum bônus ativo saindo de {origem} no momento. Fique de olho no Calendário de Bônus.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {recomendacoes.map((r, i) => (
            <div key={i} className="border border-zinc-800 rounded-3xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-zinc-400">
                    {r.origem} → {r.destino}
                  </div>
                  <div className="text-3xl font-semibold mt-1">+{r.percentual}%</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    r.veredito === 'Excelente'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : r.veredito === 'Bom'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {r.veredito}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-zinc-400">Milhas finais</div>
                  <div className="font-mono text-lg">{r.milhasFinais.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Valor estimado</div>
                  <div className="font-mono text-lg text-emerald-400">R$ {r.valor.toFixed(0)}</div>
                </div>
              </div>
              {r.media !== null && (
                <div className="mt-3 text-xs text-zinc-500">
                  Média histórica desta rota: {r.media.toFixed(0)}%
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
