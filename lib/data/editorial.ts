/**
 * Conteúdo editorial (guias e reviews) com corpo real.
 * Fonte única usada pelas listagens e pelas páginas de detalhe.
 */

export interface Secao {
  titulo: string;
  paragrafos: string[];
}

export interface Guia {
  slug: string;
  titulo: string;
  categoria: string;
  tempoLeitura: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  resumo: string;
  secoes: Secao[];
}

export interface Review {
  slug: string;
  tipo: 'Cartão' | 'Programa';
  nome: string;
  nota: number;
  atualizado: string;
  resumo: string;
  pros: string[];
  contras: string[];
  secoes: Secao[];
}

export const guias: Guia[] = [
  {
    slug: 'como-emitir-passagens-com-milhas-2026',
    titulo: 'Como emitir passagens com milhas em 2026',
    categoria: 'Emissão',
    tempoLeitura: '12 min',
    nivel: 'Intermediário',
    resumo:
      'O passo a passo para transformar milhas em passagens sem pagar caro: quando emitir, onde procurar e como evitar as taxas que corroem o valor do seu milheiro.',
    secoes: [
      {
        titulo: 'Entenda o valor do seu milheiro antes de emitir',
        paragrafos: [
          'Antes de qualquer emissão, calcule quanto vale cada 1.000 milhas do seu programa. Uma emissão só é boa quando o valor do milheiro obtido supera a faixa de referência do programa — use a Calculadora do Milheiro para checar isso em segundos.',
          'A regra de ouro: emita quando o custo por milheiro ficar abaixo do que você pagaria para comprar aquelas milhas. Se a passagem "custa" 12 mil milhas + R$ 90 de taxas e essas milhas valem R$ 27/milheiro, o custo total precisa fazer sentido contra o preço em dinheiro.',
        ],
      },
      {
        titulo: 'Quando emitir: antecedência x última hora',
        paragrafos: [
          'Voos domésticos costumam ter as melhores tarifas em milhas com 2 a 4 meses de antecedência. Internacionais em classe executiva abrem os melhores assentos logo que o calendário é liberado (cerca de 330 dias antes) e, às vezes, em cima da hora, quando a cia libera assentos não vendidos.',
          'Evite datas de altíssima demanda (férias de julho, fim de ano). O mesmo destino pode custar o dobro de milhas em julho e metade em setembro.',
        ],
      },
      {
        titulo: 'Cuidado com as taxas',
        paragrafos: [
          'Taxas de embarque e "taxas de serviço" podem transformar uma boa emissão em um mau negócio, especialmente em programas parceiros. Sempre confira o valor final em reais antes de confirmar.',
          'Use a Calculadora Reversa e o Planejador para ver, a partir do seu saldo atual, quais destinos estão ao seu alcance com o melhor custo-benefício.',
        ],
      },
    ],
  },
  {
    slug: 'guia-transferencia-de-pontos-2026',
    titulo: 'Guia completo de transferência de pontos 2026',
    categoria: 'Transferência',
    tempoLeitura: '18 min',
    nivel: 'Avançado',
    resumo:
      'Transferir pontos com bônus é onde mora boa parte do valor das milhas. Aprenda a ler as campanhas, comparar Livelo e Esfera e não transferir na hora errada.',
    secoes: [
      {
        titulo: 'Nunca transfira sem bônus (quase nunca)',
        paragrafos: [
          'Transferir pontos de um banco (Livelo, Esfera) para um programa aéreo sem bônus é, na maioria das vezes, desperdiçar valor. Espere campanhas de bônus — 80% a 100% são comuns e mudam completamente a matemática.',
          'A exceção é quando você precisa completar um saldo para uma emissão específica e o custo de esperar é perder o assento.',
        ],
      },
      {
        titulo: 'Como saber se o bônus é bom',
        paragrafos: [
          'Um bônus só é "excelente" quando está acima da média histórica daquela rota. Um bônus de 80% Livelo→Smiles pode ser rotina, enquanto 80% em uma rota que costuma dar 60% é ótimo.',
          'O Analisador de Transferência e o Bônus Ativos comparam o percentual atual com a média histórica de cada rota para você não cair na urgência artificial das campanhas.',
        ],
      },
      {
        titulo: 'Livelo ou Esfera?',
        paragrafos: [
          'Depende do destino e da campanha do momento. Para um mesmo programa aéreo, o banco vencedor muda conforme quem está com o maior bônus ativo. A ferramenta Livelo vs Esfera resolve isso comparando o resultado final dos dois lado a lado.',
        ],
      },
    ],
  },
  {
    slug: 'melhores-cartoes-para-acumular-milhas-2026',
    titulo: 'Melhores cartões para acumular milhas em 2026',
    categoria: 'Cartões',
    tempoLeitura: '10 min',
    nivel: 'Iniciante',
    resumo:
      'Qual cartão escolher para acumular milhas sem pagar anuidade cara à toa. Como comparar pontos por dólar, benefícios e anuidade líquida.',
    secoes: [
      {
        titulo: 'Anuidade nominal x anuidade líquida',
        paragrafos: [
          'Um cartão de R$ 1.200 de anuidade pode ser mais barato, na prática, que um "sem anuidade" — se ele gerar milhas suficientes para compensar. O conceito-chave é a anuidade líquida: anuidade menos o valor das milhas que você acumula.',
          'Use a ferramenta Anuidade Líquida para simular isso com o seu gasto mensal real.',
        ],
      },
      {
        titulo: 'Pontos por dólar é o que mais importa',
        paragrafos: [
          'A métrica que mais influencia o acúmulo é quantos pontos o cartão dá por dólar gasto. Cartões premium costumam dar de 2 a 2,5 pontos/US$, enquanto os de entrada ficam em 1.',
          'Compare os cartões pelos benefícios que você realmente usa (sala VIP, seguro viagem) na ferramenta Cartões por Benefício.',
        ],
      },
    ],
  },
];

export const reviews: Review[] = [
  {
    slug: 'itau-personnalite-visa-infinite',
    tipo: 'Cartão',
    nome: 'Itaú Personnalité Visa Infinite',
    nota: 8.7,
    atualizado: 'Julho 2026',
    resumo:
      'Excelente custo-benefício para quem gasta acima de R$ 8 mil/mês. Sala VIP e um bom programa de pontos com transferências frequentes.',
    pros: ['Sala VIP (LoungeKey)', 'Bom acúmulo de pontos', 'Transferências com bônus frequentes'],
    contras: ['Exige relacionamento Personnalité', 'Anuidade alta sem gasto suficiente'],
    secoes: [
      {
        titulo: 'Para quem vale a pena',
        paragrafos: [
          'É um cartão para quem consegue concentrar o gasto e manter o relacionamento Personnalité. Com gasto mensal acima de R$ 8 mil, a anuidade líquida tende a ficar próxima de zero ou negativa quando você aproveita bem os pontos.',
        ],
      },
    ],
  },
  {
    slug: 'latam-pass',
    tipo: 'Programa',
    nome: 'LATAM Pass',
    nota: 8.8,
    atualizado: 'Julho 2026',
    resumo:
      'Melhor programa doméstico do Brasil atualmente. Bom custo de milheiro e ampla rede de parceiros.',
    pros: ['Ótima malha doméstica', 'Milheiro de referência alto', 'Parcerias com Livelo e Esfera'],
    contras: ['Taxas em alguns parceiros', 'Disponibilidade variável em datas de pico'],
    secoes: [
      {
        titulo: 'Por que se destaca',
        paragrafos: [
          'O LATAM Pass combina uma malha doméstica forte com um milheiro de referência entre os mais altos do mercado, o que faz as emissões renderem bem. As campanhas de transferência com Livelo e Esfera aparecem com regularidade.',
        ],
      },
    ],
  },
  {
    slug: 'nubank-ultravioleta',
    tipo: 'Cartão',
    nome: 'Nubank Ultravioleta',
    nota: 8.9,
    atualizado: 'Julho 2026',
    resumo:
      'Melhor opção sem anuidade. Cashback alto e experiência digital impecável. Ideal para quem não viaja com frequência.',
    pros: ['Sem anuidade', 'Cashback que rende', 'Experiência digital'],
    contras: ['Acúmulo de pontos menor que premium', 'Sala VIP limitada'],
    secoes: [
      {
        titulo: 'O melhor "sem anuidade"',
        paragrafos: [
          'Para quem não gasta o suficiente para justificar um cartão premium, o Ultravioleta entrega valor sem custo fixo: o cashback rende no próprio Nubank e a experiência é simples. Não é o melhor para acumular milhas em volume, mas é imbatível em custo.',
        ],
      },
    ],
  },
];

export function getGuia(slug: string) {
  return guias.find((g) => g.slug === slug) ?? null;
}

export function getReview(slug: string) {
  return reviews.find((r) => r.slug === slug) ?? null;
}
