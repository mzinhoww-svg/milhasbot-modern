/**
 * Fonte única de cartões de crédito de referência.
 * Usada pela ferramenta "Cartões por Benefício" e pela "Anuidade Líquida".
 */

export type Beneficio =
  | 'Sala VIP'
  | 'Seguro viagem'
  | 'Concierge'
  | 'Cashback'
  | 'Sem anuidade'
  | 'Pontos acelerados'
  | 'Investimentos';

export interface Cartao {
  nome: string;
  banco: string;
  anuidade: number; // anual, em R$
  pontosPorDolar: number; // pontos por US$1 gasto
  beneficios: Beneficio[];
  nota: number;
}

export const cartoes: Cartao[] = [
  {
    nome: 'Itaú Personnalité Visa Infinite',
    banco: 'Itaú',
    anuidade: 1200,
    pontosPorDolar: 2.2,
    beneficios: ['Sala VIP', 'Seguro viagem', 'Pontos acelerados'],
    nota: 8.7,
  },
  {
    nome: 'Bradesco Visa Infinite',
    banco: 'Bradesco',
    anuidade: 1500,
    pontosPorDolar: 2.5,
    beneficios: ['Sala VIP', 'Concierge', 'Cashback'],
    nota: 8.4,
  },
  {
    nome: 'Nubank Ultravioleta',
    banco: 'Nubank',
    anuidade: 0,
    pontosPorDolar: 1.0,
    beneficios: ['Cashback', 'Sem anuidade', 'Investimentos'],
    nota: 8.9,
  },
  {
    nome: 'C6 Carbon',
    banco: 'C6 Bank',
    anuidade: 1080,
    pontosPorDolar: 2.5,
    beneficios: ['Sala VIP', 'Seguro viagem', 'Pontos acelerados'],
    nota: 8.6,
  },
  {
    nome: 'Santander Unlimited',
    banco: 'Santander',
    anuidade: 0,
    pontosPorDolar: 1.6,
    beneficios: ['Sem anuidade', 'Pontos acelerados'],
    nota: 8.1,
  },
  {
    nome: 'Inter Black',
    banco: 'Inter',
    anuidade: 0,
    pontosPorDolar: 1.0,
    beneficios: ['Sala VIP', 'Cashback', 'Sem anuidade'],
    nota: 8.0,
  },
  {
    nome: 'BTG+ Black',
    banco: 'BTG Pactual',
    anuidade: 0,
    pontosPorDolar: 1.8,
    beneficios: ['Sala VIP', 'Sem anuidade', 'Investimentos'],
    nota: 8.5,
  },
  {
    nome: 'XP Visa Infinite',
    banco: 'XP',
    anuidade: 0,
    pontosPorDolar: 2.0,
    beneficios: ['Sala VIP', 'Seguro viagem', 'Sem anuidade', 'Investimentos'],
    nota: 8.8,
  },
];

export const beneficiosDisponiveis: Beneficio[] = [
  'Sala VIP',
  'Seguro viagem',
  'Concierge',
  'Cashback',
  'Sem anuidade',
  'Pontos acelerados',
  'Investimentos',
];
