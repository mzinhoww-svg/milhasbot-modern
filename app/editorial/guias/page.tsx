'use client';

const guias = [
  {
    titulo: 'Como emitir passagens com milhas em 2026',
    categoria: 'Emissão',
    tempoLeitura: '12 min',
    nivel: 'Intermediário',
  },
  {
    titulo: 'Guia completo de transferência de pontos 2026',
    categoria: 'Transferência',
    tempoLeitura: '18 min',
    nivel: 'Avançado',
  },
  {
    titulo: 'Melhores cartões para acumular milhas em 2026',
    categoria: 'Cartões',
    tempoLeitura: '10 min',
    nivel: 'Iniciante',
  },
];

export default function Guias() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Guias</h1>
      <p className="text-zinc-400 mb-8">Fase 5 • Conteúdo editorial aprofundado</p>

      <div className="grid md:grid-cols-2 gap-6">
        {guias.map((guia, index) => (
          <div key={index} className="border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 group">
            <div className="flex justify-between text-xs mb-4">
              <span className="px-3 py-1 bg-zinc-800 rounded-full">{guia.categoria}</span>
              <span className="text-zinc-500">{guia.tempoLeitura}</span>
            </div>
            <h3 className="text-2xl font-semibold leading-tight group-hover:text-emerald-400 transition-colors">
              {guia.titulo}
            </h3>
            <div className="mt-6 text-sm text-emerald-400">Ler guia completo →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
