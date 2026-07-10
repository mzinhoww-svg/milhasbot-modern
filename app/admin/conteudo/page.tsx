'use client';

export default function AdminConteudo() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Conteúdo Editorial</h1>

      <div className="space-y-8">
        <div className="border border-zinc-800 rounded-3xl p-8">
          <h3 className="font-semibold mb-4">Reviews Publicados</h3>
          <div className="text-sm text-zinc-400">12 reviews ativos • Última atualização: hoje</div>
          <button className="mt-6 px-6 py-2.5 bg-white text-black rounded-2xl text-sm">Adicionar novo review</button>
        </div>

        <div className="border border-zinc-800 rounded-3xl p-8">
          <h3 className="font-semibold mb-4">Guias Publicados</h3>
          <div className="text-sm text-zinc-400">8 guias ativos</div>
          <button className="mt-6 px-6 py-2.5 bg-white text-black rounded-2xl text-sm">Criar novo guia</button>
        </div>

        <div className="border border-zinc-800 rounded-3xl p-8">
          <h3 className="font-semibold mb-4">Valores de Referência (Milheiro)</h3>
          <div className="text-sm text-zinc-400">10 programas atualizados • Julho 2026</div>
          <button className="mt-6 px-6 py-2.5 bg-white text-black rounded-2xl text-sm">Atualizar valores</button>
        </div>
      </div>
    </div>
  );
}
