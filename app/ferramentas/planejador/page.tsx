'use client';

import { useState } from 'react';
import { calcularQuantoValem, getVeredito, getVereditoColor, getVereditoLabel, VALORES_REFERENCIA, type Programa } from '@/lib/calculations/milheiro';
import { passagens } from '@/lib/data/passagens';

interface SaldoPrograma {
  programa: Programa;
  saldo: number;
}

export default function Planejador() {
  const [saldos, setSaldos] = useState<SaldoPrograma[]>([
    { programa: 'LATAM', saldo: 45000 },
    { programa: 'Smiles', saldo: 32000 },
  ]);
  const [origem, setOrigem] = useState('GRU');
  const [classe, setClasse] = useState<'Econômica' | 'Executiva'>('Econômica');

  // Calcular total de milhas
  const totalMilhas = saldos.reduce((acc, s) => acc + s.saldo, 0);

  // Buscar destinos compatíveis (a partir da base central de passagens)
  const cabineAlvo = classe === 'Econômica' ? 'economica' : 'executiva';
  const destinosCompativeis = passagens
    .filter(p => p.cabine === cabineAlvo)
    .filter(p => p.milhas <= totalMilhas * 0.92)
    .map(passagem => {
      const melhorPrograma = saldos.find(s => s.saldo >= passagem.milhas)?.programa || passagem.programa;
      const valor = calcularQuantoValem(passagem.milhas, VALORES_REFERENCIA[melhorPrograma as Programa]?.alto || 25);
      const veredito = getVeredito(VALORES_REFERENCIA[melhorPrograma as Programa]?.alto || 25, melhorPrograma as Programa);

      return {
        destino: passagem.destino,
        milhas: passagem.milhas,
        classe,
        programaRecomendado: melhorPrograma,
        valorEstimado: valor,
        veredito,
      };
    })
    .sort((a, b) => a.milhas - b.milhas)
    .slice(0, 10);

  const adicionarSaldo = () => {
    setSaldos([...saldos, { programa: 'LATAM', saldo: 0 }]);
  };

  const atualizarSaldo = (index: number, field: 'programa' | 'saldo', value: string | number) => {
    const novos = [...saldos];
    if (field === 'programa') {
      novos[index].programa = value as Programa;
    } else {
      novos[index].saldo = Number(value);
    }
    setSaldos(novos);
  };

  const removerSaldo = (index: number) => {
    setSaldos(saldos.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Planejador de Milhas</h1>
      <p className="text-zinc-400 mb-8">Fase 2 • Onde você pode ir com suas milhas hoje</p>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar - Saldos */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Seus saldos atuais</h3>
              <button 
                onClick={adicionarSaldo}
                className="text-sm px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
              >
                + Adicionar
              </button>
            </div>

            <div className="space-y-4">
              {saldos.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <select 
                    value={item.programa} 
                    onChange={e => atualizarSaldo(index, 'programa', e.target.value)}
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 flex-1"
                  >
                    {Object.keys(VALORES_REFERENCIA).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    value={item.saldo} 
                    onChange={e => atualizarSaldo(index, 'saldo', +e.target.value)}
                    className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 w-32 font-mono"
                  />
                  <button 
                    onClick={() => removerSaldo(index)}
                    className="text-red-400 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total de milhas</span>
                <span className="font-mono text-xl font-semibold">{totalMilhas.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-7">
          <h3 className="font-semibold mb-4">Destinos que você consegue emitir</h3>
          
          {destinosCompativeis.length > 0 ? (
            <div className="space-y-3">
              {destinosCompativeis.map((dest, index) => (
                <div key={index} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4">
                  <div>
                    <div className="font-semibold text-lg">{dest.destino}</div>
                    <div className="text-sm text-zinc-400">{dest.classe} • via {dest.programaRecomendado}</div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-mono text-xl">{dest.milhas.toLocaleString('pt-BR')}</div>
                      <div className="text-xs text-zinc-500">milhas</div>
                    </div>
                    
                    <div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium text-center ${getVereditoColor(dest.veredito)}`}>
                        {getVereditoLabel(dest.veredito)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 border border-zinc-800 rounded-3xl">
              Nenhuma passagem compatível encontrada com seu saldo atual.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
