'use client';

const cartoes = [
  {
    nome: 'Itaú Personnalité',
    banco: 'Itaú',
    anuidade: 1200,
    beneficios: ['Sala VIP', 'Seguro viagem', 'Pontos dobrados em supermercado'],
    milhasMes: 2500,
    nota: 8.7,
  },
  {
    nome: 'Bradesco Visa Infinite',
    banco: 'Bradesco',
    anuidade: 1500,
    beneficios: ['Sala VIP ilimitada', 'Concierge', 'Cashback em viagens'],
    milhasMes: 3000,
    nota: 8.4,
  },
  {
    nome: 'Nubank Ultravioleta',
    banco: 'Nubank',
    anuidade: 0,
    beneficios: ['Cashback 1%', 'Investimentos', 'Sem anuidade'],
    milhasMes: 1200,
    nota: 8.9,
  },
];

export default function CartoesPorBeneficio() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Cartões por Benefício</h1>
      <p className="text-zinc-400 mb-8">Fase 4 • Compare cartões pelo que realmente importa para você</p>

      <div className="grid md:grid-cols-3 gap-6">
        {cartoes.map((cartao, index) => (
          <div key={index} className="border border-zinc-800 rounded-3xl p-6 hover:border-zinc-600 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-xl">{cartao.nome}</div>
                <div className="text-sm text-zinc-400">{cartao.banco}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-400">Nota</div>
                <div className="text-2xl font-bold text-emerald-400">{cartao.nota}</div>
              </div>
            </div>

            <div className="my-6">
              <div className="text-sm text-zinc-400">Anuidade</div>
              <div className="text-3xl font-semibold mt-1">
                {cartao.anuidade === 0 ? 'Grátis' : `R$ ${cartao.anuidade}`}
              </div>
            </div>

            <div>
              <div className="text-sm text-zinc-400 mb-2">Principais benefícios</div>
              <ul className="space-y-1.5 text-sm">
                {cartao.beneficios.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-emerald-400">•</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800 text-sm">
              Gera aproximadamente <span className="font-mono text-emerald-400">{cartao.milhasMes}</span> milhas/mês
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
