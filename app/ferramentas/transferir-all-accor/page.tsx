'use client';

export default function TransferirALLAccor() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Transferir para ALL Accor</h1>
      <p className="text-zinc-400 mb-8">Fase 3 • Paridade e bônus específicos</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-zinc-400">Paridade atual</div>
            <div className="text-6xl font-bold tracking-tight mt-2">1:1</div>
            <div className="text-emerald-400 mt-1">Sem bônus no momento</div>
          </div>
          <div className="text-sm text-zinc-400 space-y-3">
            <p>ALL Accor é uma boa opção para quem viaja frequentemente para hotéis Accor na Europa e América do Sul.</p>
            <p className="text-xs">Recomendado apenas quando houver bônus acima de 30% ou para quem tem necessidade específica de pontos ALL.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
