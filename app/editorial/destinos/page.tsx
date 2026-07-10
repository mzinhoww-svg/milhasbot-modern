'use client';

const destinos = [
  { nome: 'Paris', milhasMin: 31000, melhorPrograma: 'Flying Blue / LATAM', dificuldade: 'Média' },
  { nome: 'Nova York', milhasMin: 28000, melhorPrograma: 'LATAM / Smiles', dificuldade: 'Média' },
  { nome: 'Buenos Aires', milhasMin: 10000, melhorPrograma: 'LATAM', dificuldade: 'Fácil' },
  { nome: 'Madri', milhasMin: 12800, melhorPrograma: 'Iberia / LATAM', dificuldade: 'Fácil' },
];

export default function Destinos() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Melhores Destinos para Emitir</h1>
      <p className="text-zinc-400 mb-8">Fase 5 • Sweet spots e oportunidades reais</p>

      <div className="overflow-hidden border border-zinc-800 rounded-3xl">
        <table className="w-full">
          <thead className="bg-zinc-900 text-sm text-zinc-400">
            <tr>
              <th className="text-left py-4 px-6">Destino</th>
              <th className="text-left py-4 px-6">Milhas mínimas (ida e volta)</th>
              <th className="text-left py-4 px-6">Melhor programa</th>
              <th className="text-left py-4 px-6">Dificuldade</th>
            </tr>
          </thead>
          <tbody>
            {destinos.map((d, i) => (
              <tr key={i} className="border-t border-zinc-800 hover:bg-zinc-950">
                <td className="py-5 px-6 font-semibold">{d.nome}</td>
                <td className="py-5 px-6 font-mono text-emerald-400">{d.milhasMin.toLocaleString('pt-BR')}</td>
                <td className="py-5 px-6">{d.melhorPrograma}</td>
                <td className="py-5 px-6">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    d.dificuldade === 'Fácil' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {d.dificuldade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
