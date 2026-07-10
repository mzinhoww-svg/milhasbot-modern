/**
 * Metadados dos programas para o Comparador de Programas.
 * O milheiro de referência vem de VALORES_REFERENCIA (milheiro.ts),
 * mantendo uma única fonte para os valores julho/2026.
 */

import { VALORES_REFERENCIA, type Programa } from '@/lib/calculations/milheiro';

export interface ProgramaInfo {
  programa: Programa;
  tipo: 'Companhia aérea' | 'Banco de pontos';
  validadeMeses: number | null; // null = não expira
  temClube: boolean;
  paridades: string[]; // principais parceiros de transferência
}

export const programasInfo: ProgramaInfo[] = [
  { programa: 'LATAM', tipo: 'Companhia aérea', validadeMeses: null, temClube: true, paridades: ['Livelo', 'Esfera'] },
  { programa: 'Smiles', tipo: 'Companhia aérea', validadeMeses: 24, temClube: true, paridades: ['Livelo', 'Esfera'] },
  { programa: 'Azul', tipo: 'Companhia aérea', validadeMeses: 24, temClube: true, paridades: ['Livelo'] },
  { programa: 'TAP', tipo: 'Companhia aérea', validadeMeses: 36, temClube: true, paridades: ['Esfera'] },
  { programa: 'Iberia', tipo: 'Companhia aérea', validadeMeses: 36, temClube: false, paridades: ['Livelo'] },
  { programa: 'AAdvantage', tipo: 'Companhia aérea', validadeMeses: 24, temClube: false, paridades: [] },
  { programa: 'LifeMiles', tipo: 'Companhia aérea', validadeMeses: null, temClube: true, paridades: [] },
  { programa: 'Aeroplan', tipo: 'Companhia aérea', validadeMeses: 18, temClube: false, paridades: [] },
  { programa: 'Livelo', tipo: 'Banco de pontos', validadeMeses: 24, temClube: true, paridades: ['LATAM', 'Smiles', 'Azul', 'Iberia'] },
  { programa: 'Esfera', tipo: 'Banco de pontos', validadeMeses: 24, temClube: true, paridades: ['LATAM', 'Smiles', 'TAP'] },
];

export function milheiroReferencia(programa: Programa) {
  return VALORES_REFERENCIA[programa];
}
