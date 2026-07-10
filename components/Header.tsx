import Link from 'next/link';

const navGroups: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: 'Calculadoras',
    items: [
      { href: '/calculadora/milheiro', label: 'Milheiro' },
      { href: '/calculadora/reversa', label: 'Reversa' },
      { href: '/ferramentas/custo-fabricar', label: 'Custo de Fabricar' },
      { href: '/ferramentas/compras-bonificadas', label: 'Compras Bonificadas' },
      { href: '/ferramentas/milhas-posto', label: 'Milhas de Posto' },
    ],
  },
  {
    label: 'Programas',
    items: [
      { href: '/ferramentas/comparar-programas', label: 'Comparar Programas' },
      { href: '/ferramentas/livelo-vs-esfera', label: 'Livelo vs Esfera' },
      { href: '/ferramentas/planejador', label: 'Planejador' },
      { href: '/ferramentas/destinos-baratos', label: 'Destinos Baratos' },
      { href: '/ferramentas/buscador-passagens', label: 'Buscador de Passagens' },
    ],
  },
  {
    label: 'Transferências',
    items: [
      { href: '/ferramentas/analisador-transferencia', label: 'Analisador' },
      { href: '/ferramentas/bonus-ativos', label: 'Bônus Ativos' },
      { href: '/ferramentas/calendario-bonus', label: 'Calendário' },
      { href: '/ferramentas/para-onde-transferir', label: 'Para Onde Transferir' },
      { href: '/ferramentas/transferir-all-accor', label: 'ALL Accor' },
    ],
  },
  {
    label: 'Cartões & Viagem',
    items: [
      { href: '/ferramentas/cartoes-por-beneficio', label: 'Cartões por Benefício' },
      { href: '/ferramentas/anuidade-liquida', label: 'Anuidade Líquida' },
      { href: '/ferramentas/conta-global-vs-cartao', label: 'Conta Global vs Cartão' },
      { href: '/ferramentas/custo-no-exterior', label: 'Custo no Exterior' },
    ],
  },
  {
    label: 'Editorial',
    items: [
      { href: '/editorial/destinos', label: 'Destinos' },
      { href: '/editorial/guias', label: 'Guias' },
      { href: '/editorial/reviews', label: 'Reviews' },
    ],
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white">
            MilhasBot
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navGroups.map((group) => (
              <div key={group.label} className="group relative">
                <button className="px-3 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
                  {group.label}
                </button>
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all absolute right-0 top-full pt-2 min-w-56">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>
        <nav className="md:hidden flex gap-4 overflow-x-auto pb-3 text-sm text-zinc-400">
          {navGroups.map((group) => (
            <Link
              key={group.label}
              href={group.items[0].href}
              className="whitespace-nowrap hover:text-white transition-colors"
            >
              {group.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
