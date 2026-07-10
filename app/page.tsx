import Link from 'next/link';

interface Ferramenta {
  href: string;
  titulo: string;
  descricao: string;
}

interface Fase {
  numero: string;
  nome: string;
  ferramentas: Ferramenta[];
}

const fases: Fase[] = [
  {
    numero: 'Fase 0',
    nome: 'Calculadoras Essenciais',
    ferramentas: [
      {
        href: '/calculadora/milheiro',
        titulo: 'Calculadora do Milheiro',
        descricao: '4 modos completos • Vereditos automáticos • Valores de referência julho/2026',
      },
      {
        href: '/calculadora/reversa',
        titulo: 'Calculadora Reversa',
        descricao: 'Gasto mensal → Destinos possíveis • Bônus 1.8x • Busca em passagens',
      },
    ],
  },
  {
    numero: 'Fase 1',
    nome: 'Comparação e Custo',
    ferramentas: [
      {
        href: '/ferramentas/comparar-programas',
        titulo: 'Comparador de Programas de Milhas',
        descricao: 'Compare programas lado a lado com valores de referência atualizados',
      },
      {
        href: '/ferramentas/compras-bonificadas',
        titulo: 'Calculadora de Compras Bonificadas',
        descricao: 'Descubra se a compra bonificada vale a pena antes de gastar',
      },
      {
        href: '/ferramentas/custo-fabricar',
        titulo: 'Custo de Fabricar Milhas',
        descricao: 'Quanto custa gerar milhas via cartão e compras no dia a dia',
      },
    ],
  },
  {
    numero: 'Fase 2',
    nome: 'Planejamento',
    ferramentas: [
      {
        href: '/ferramentas/planejador',
        titulo: 'Planejador de Milhas',
        descricao: 'Onde você pode ir com suas milhas hoje, com base nos seus saldos',
      },
      {
        href: '/ferramentas/destinos-baratos',
        titulo: 'Destinos Mais Baratos em Milhas',
        descricao: 'Ranking de destinos com menor custo em milhas, por programa',
      },
    ],
  },
  {
    numero: 'Fase 3',
    nome: 'Transferências Bonificadas',
    ferramentas: [
      {
        href: '/ferramentas/analisador-transferencia',
        titulo: 'Analisador de Transferência Bonificada',
        descricao: 'Analise se a transferência com bônus vale a pena no seu caso',
      },
      {
        href: '/ferramentas/bonus-ativos',
        titulo: 'Bônus de Transferência Ativos',
        descricao: 'Acompanhe as campanhas de bônus em andamento agora',
      },
      {
        href: '/ferramentas/calendario-bonus',
        titulo: 'Calendário de Bônus de Transferência',
        descricao: 'Histórico e sazonalidade das campanhas de bônus por programa',
      },
      {
        href: '/ferramentas/para-onde-transferir',
        titulo: 'Para Onde Transferir?',
        descricao: 'Recomendações de destino dos seus pontos com base no objetivo',
      },
      {
        href: '/ferramentas/transferir-all-accor',
        titulo: 'Transferir para ALL Accor',
        descricao: 'Simule a conversão de pontos para o programa ALL Accor',
      },
    ],
  },
  {
    numero: 'Fase 4',
    nome: 'Cartões e Exterior',
    ferramentas: [
      {
        href: '/ferramentas/anuidade-liquida',
        titulo: 'Anuidade Líquida do Cartão',
        descricao: 'Calcule o custo real do cartão descontando benefícios e milhas',
      },
      {
        href: '/ferramentas/cartoes-por-beneficio',
        titulo: 'Cartões por Benefício',
        descricao: 'Encontre o cartão certo pelo benefício que importa para você',
      },
      {
        href: '/ferramentas/conta-global-vs-cartao',
        titulo: 'Conta Global vs Cartão no Exterior',
        descricao: 'Compare o que sai mais barato na sua próxima viagem internacional',
      },
      {
        href: '/ferramentas/custo-no-exterior',
        titulo: 'Custo no Exterior (IOF e Câmbio)',
        descricao: 'Calcule IOF, spread e custo total de gastar fora do Brasil',
      },
    ],
  },
  {
    numero: 'Fase 5',
    nome: 'Editorial',
    ferramentas: [
      {
        href: '/editorial/destinos',
        titulo: 'Melhores Destinos para Emitir',
        descricao: 'Conteúdo editorial com os destinos mais vantajosos do momento',
      },
      {
        href: '/editorial/guias',
        titulo: 'Guias',
        descricao: 'Guias completos para dominar o mundo das milhas',
      },
      {
        href: '/editorial/reviews',
        titulo: 'Reviews',
        descricao: 'Análises de cartões, programas e produtos de viagem',
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-6xl font-bold tracking-tighter">MilhasBot</h1>
            <p className="text-xl text-zinc-400 mt-2">Modernizado • Next.js + Supabase</p>
          </div>
          <div className="text-right text-sm text-zinc-500">
            Todas as fases • Reutilização máxima<br />
            das fórmulas originais
          </div>
        </div>

        {fases.map((fase) => (
          <section key={fase.numero} className="mb-14">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
                {fase.numero}
              </span>
              <h2 className="text-2xl font-semibold">{fase.nome}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {fase.ferramentas.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group block border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-all"
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                    {f.titulo}
                  </h3>
                  <p className="text-sm text-zinc-400">{f.descricao}</p>
                  <div className="mt-4 text-sm text-emerald-400">Abrir →</div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-16 flex items-center justify-between text-xs text-zinc-500">
          <span>Todas as fórmulas e lógicas de veredito foram reutilizadas do MilhasBot original.</span>
          <Link href="/admin" className="hover:text-zinc-300 transition-colors">
            Painel administrativo →
          </Link>
        </div>
      </div>
    </div>
  );
}
