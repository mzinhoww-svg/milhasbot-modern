'use client';

const activeBonuses = [
  { from: 'Livelo', to: 'Smiles', bonus: 80, until: '2026-07-31', veredito: 'Bom' },
  { from: 'Esfera', to: 'LATAM', bonus: 100, until: '2026-07-25', veredito: 'Excelente' },
  { from: 'Livelo', to: 'Azul', bonus: 60, until: '2026-08-05', veredito: 'Regular' },
];

export default function BonusAtivos() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Bônus de Transferência Ativos</h1>
      <p className="text-zinc-400 mb-8">Fase 3 • Bônus em andamento no momento</p>

      <div className="space-y-4">
        {activeBonuses.map((bonus, index) => (
          <div key={index} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5">
            <div>
              <span className="font-semibold">{bonus.from}</span>
              <span className="mx-2 text-zinc-500">→</span>
              <span className="font-semibold">{bonus.to}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-emerald-400 font-mono text-xl">+{bonus.bonus}%</div>
              <div className="text-sm text-zinc-400">até {bonus.until}</div>
              <div className={`px-3 py-1 rounded-full text-xs ${bonus.veredito === 'Excelente' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {bonus.veredito}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
