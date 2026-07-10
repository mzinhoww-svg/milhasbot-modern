'use client';

export default function DestinosMaisBaratos() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Destinos Mais Baratos em Milhas</h1>
      <p className="text-zinc-400 mb-8">Fase 2 • Baseado em dados reais observados</p>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { destino: 'Brasília', milhas: 'a partir de 5.000', programa: 'Smiles' },
          { destino: 'Rio de Janeiro', milhas: 'a partir de 5.000', programa: 'LATAM' },
          { destino: 'Recife', milhas: 'a partir de 6.100', programa: 'Smiles' },
          { destino: 'Buenos Aires', milhas: 'a partir de 10.000', programa: 'LATAM' },
        ].map((d, i) => (
          <div key={i} className="border border-zinc-800 rounded-2xl p-6">
            <div className="font-semibold text-xl">{d.destino}</div>
            <div className="text-emerald-400 mt-2">{d.milhas}</div>
            <div className="text-sm text-zinc-500 mt-1">Melhor com {d.programa}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
