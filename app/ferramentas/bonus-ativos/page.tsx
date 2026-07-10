import { getBonusTransferencias } from '@/lib/repositories/reference';
import { bonusAtivos, mediaHistoricaRota, vereditoBonus } from '@/lib/data/bonus';

export const metadata = { title: 'Bônus de Transferência Ativos' };

export default async function BonusAtivos() {
  const todos = await getBonusTransferencias();
  const ativos = bonusAtivos(todos)
    .map((b) => {
      const media = mediaHistoricaRota(b.origem, b.destino, todos);
      return { ...b, media, veredito: vereditoBonus(b.percentual, media) };
    })
    .sort((a, b) => b.percentual - a.percentual);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Bônus de Transferência Ativos</h1>
      <p className="text-zinc-400 mb-8">
        Fase 3 • Campanhas em andamento, comparadas com a média histórica de cada rota
      </p>

      <div className="space-y-4">
        {ativos.map((bonus, index) => (
          <div
            key={index}
            className="flex flex-wrap gap-4 justify-between items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5"
          >
            <div>
              <span className="font-semibold">{bonus.origem}</span>
              <span className="mx-2 text-zinc-500">→</span>
              <span className="font-semibold">{bonus.destino}</span>
              {bonus.media !== null && (
                <span className="ml-3 text-xs text-zinc-500">média {bonus.media.toFixed(0)}%</span>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="text-emerald-400 font-mono text-xl">+{bonus.percentual}%</div>
              <div className="text-sm text-zinc-400">até {bonus.fim}</div>
              <div
                className={`px-3 py-1 rounded-full text-xs ${
                  bonus.veredito === 'Excelente'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : bonus.veredito === 'Bom'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {bonus.veredito}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
