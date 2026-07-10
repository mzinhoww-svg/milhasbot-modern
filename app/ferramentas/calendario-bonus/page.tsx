'use client';

import { bonusTransferencias } from '@/lib/data/bonus';

const meses = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

function rotuloMes(iso: string) {
  const [ano, mes] = iso.split('-');
  return `${meses[Number(mes) - 1]}/${ano.slice(2)}`;
}

export default function CalendarioBonus() {
  const ordenado = [...bonusTransferencias].sort((a, b) => (a.inicio < b.inicio ? 1 : -1));

  // Frequência de bônus por mês do ano (sazonalidade)
  const porMes = new Array(12).fill(0);
  for (const b of bonusTransferencias) {
    porMes[Number(b.inicio.split('-')[1]) - 1]++;
  }
  const maxMes = Math.max(...porMes, 1);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Calendário de Bônus de Transferência</h1>
      <p className="text-zinc-400 mb-8">Fase 3 • Histórico das campanhas e sazonalidade por mês</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Sazonalidade (frequência de campanhas por mês)</h2>
        <div className="grid grid-cols-12 gap-2 items-end h-32">
          {porMes.map((qtd, i) => (
            <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
              <div
                className="w-full bg-emerald-500/70 rounded-t"
                style={{ height: `${(qtd / maxMes) * 100}%` }}
                title={`${qtd} campanha(s)`}
              />
              <span className="text-[10px] text-zinc-500">{meses[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Linha do tempo de campanhas</h2>
        <div className="space-y-3">
          {ordenado.map((b, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-zinc-500 w-16">{rotuloMes(b.inicio)}</span>
                <span className="font-semibold">{b.origem}</span>
                <span className="text-zinc-500">→</span>
                <span className="font-semibold">{b.destino}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-emerald-400 text-lg">+{b.percentual}%</span>
                {b.ativo ? (
                  <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                    Ativo
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-400">
                    Encerrado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
