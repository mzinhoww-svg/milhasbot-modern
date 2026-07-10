'use client';

export default function ParaOndeTransferir() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Para Onde Transferir?</h1>
      <p className="text-zinc-400 mb-8">Fase 3 • Recomendações baseadas em paridades e bônus</p>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { origem: 'Livelo', destino: 'Smiles', bonus: '80%', veredito: 'Bom' },
          { origem: 'Esfera', destino: 'LATAM', bonus: '100%', veredito: 'Excelente' },
          { origem: 'Livelo', destino: 'Azul', bonus: '60%', veredito: 'Regular' },
        ].map((item, i) => (
          <div key={i} className="border border-zinc-800 rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-zinc-400">{item.origem} → {item.destino}</div>
                <div className="text-3xl font-semibold mt-2">+{item.bonus}</div>
              </div>
              <div className="text-emerald-400 font-medium">{item.veredito}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
