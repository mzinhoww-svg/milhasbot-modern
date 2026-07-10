/**
 * Fonte única de passagens de referência (equivalente a wp_mb_passagens).
 * Substitui os arrays mockados duplicados em planejador, reversa e
 * destinos-baratos.
 */

import type { Programa } from '@/lib/calculations/milheiro';

export interface Passagem {
  destino: string;
  origem: string;
  programa: Programa;
  milhas: number;
  cabine: 'economica' | 'executiva';
  regiao: 'Doméstico' | 'América do Sul' | 'América do Norte' | 'Europa';
}

export const passagens: Passagem[] = [
  { destino: 'Brasília', origem: 'GRU', programa: 'Smiles', milhas: 5000, cabine: 'economica', regiao: 'Doméstico' },
  { destino: 'Rio de Janeiro', origem: 'GRU', programa: 'LATAM', milhas: 5000, cabine: 'economica', regiao: 'Doméstico' },
  { destino: 'Recife', origem: 'GRU', programa: 'Smiles', milhas: 6100, cabine: 'economica', regiao: 'Doméstico' },
  { destino: 'Foz do Iguaçu', origem: 'GRU', programa: 'Azul', milhas: 9000, cabine: 'economica', regiao: 'Doméstico' },
  { destino: 'Buenos Aires', origem: 'GRU', programa: 'LATAM', milhas: 10000, cabine: 'economica', regiao: 'América do Sul' },
  { destino: 'Santiago', origem: 'GRU', programa: 'LATAM', milhas: 11000, cabine: 'economica', regiao: 'América do Sul' },
  { destino: 'Montevidéu', origem: 'GRU', programa: 'Smiles', milhas: 10500, cabine: 'economica', regiao: 'América do Sul' },
  { destino: 'Madri', origem: 'GRU', programa: 'Iberia', milhas: 12800, cabine: 'economica', regiao: 'Europa' },
  { destino: 'Lisboa', origem: 'GRU', programa: 'TAP', milhas: 15000, cabine: 'economica', regiao: 'Europa' },
  { destino: 'Orlando', origem: 'GRU', programa: 'Aeroplan', milhas: 25800, cabine: 'economica', regiao: 'América do Norte' },
  { destino: 'Nova York', origem: 'GRU', programa: 'LATAM', milhas: 26000, cabine: 'economica', regiao: 'América do Norte' },
  { destino: 'Buenos Aires', origem: 'GRU', programa: 'LATAM', milhas: 22000, cabine: 'executiva', regiao: 'América do Sul' },
  { destino: 'Madri', origem: 'GRU', programa: 'Iberia', milhas: 36500, cabine: 'executiva', regiao: 'Europa' },
  { destino: 'Lisboa', origem: 'GRU', programa: 'TAP', milhas: 42000, cabine: 'executiva', regiao: 'Europa' },
  { destino: 'Nova York', origem: 'GRU', programa: 'LifeMiles', milhas: 63000, cabine: 'executiva', regiao: 'América do Norte' },
];

export const regioes = ['Doméstico', 'América do Sul', 'América do Norte', 'Europa'] as const;
