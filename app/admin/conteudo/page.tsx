'use client';

import { guias, reviews } from '@/lib/data/editorial';
import { VALORES_REFERENCIA } from '@/lib/calculations/milheiro';

export default function AdminConteudo() {
  const totalProgramas = Object.keys(VALORES_REFERENCIA).length;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Gerenciar Conteúdo Editorial</h1>
      <p className="text-zinc-400 mb-8 text-sm">
        Área protegida. A edição via banco será habilitada quando o Supabase estiver conectado.
      </p>

      <div className="space-y-8">
        <div className="border border-zinc-800 rounded-3xl p-8">
          <h3 className="font-semibold mb-4">Reviews Publicados</h3>
          <div className="text-sm text-zinc-400">
            {reviews.length} reviews em lib/data/editorial.ts
          </div>
        </div>

        <div className="border border-zinc-800 rounded-3xl p-8">
          <h3 className="font-semibold mb-4">Guias Publicados</h3>
          <div className="text-sm text-zinc-400">{guias.length} guias em lib/data/editorial.ts</div>
        </div>

        <div className="border border-zinc-800 rounded-3xl p-8">
          <h3 className="font-semibold mb-4">Valores de Referência (Milheiro)</h3>
          <div className="text-sm text-zinc-400">
            {totalProgramas} programas • Julho 2026 • fonte: lib/calculations/milheiro.ts
          </div>
        </div>
      </div>
    </div>
  );
}
