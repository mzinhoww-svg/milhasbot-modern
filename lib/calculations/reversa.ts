/**
 * Calculadora Reversa de Milhas
 * Reutiliza a lógica original do MilhasBot (gasto mensal → destinos)
 */

import { VALORES_REFERENCIA, type Programa } from './milheiro';

export interface DestinoCompativel {
  destino: string;
  milhasNecessarias: number;
  programa: Programa;
  classe: 'economica' | 'executiva';
  veredito: string;
}

/**
 * Calcula o acúmulo anual estimado
 * Fórmula reutilizada: gasto_mensal × 12 × câmbio × multiplicador × 1.8 (bônus 80%)
 */
export function calcularAcumuloAnual(
  gastoMensal: number,
  taxaCambio: number = 5.2,
  multiplicadorCartao: number = 1.5 // exemplo médio
): number {
  const acumuloBase = gastoMensal * 12 * taxaCambio * multiplicadorCartao;
  const comBonus = acumuloBase * 1.8; // 80% de bônus simulado
  return Math.round(comBonus);
}

/**
 * Busca destinos compatíveis (simulação da query em wp_mb_passagens)
 * Na versão real, isso viria do banco de dados
 */
export function buscarDestinosCompativeis(
  milhasDisponiveis: number,
  classe: 'economica' | 'executiva' = 'economica'
): DestinoCompativel[] {
  // Dados de exemplo baseados no que existia no MilhasBot
  const destinosBase = [
    { destino: 'Brasília', milhasEco: 5000, milhasExec: 12000, programa: 'Smiles' as Programa },
    { destino: 'Rio de Janeiro', milhasEco: 5000, milhasExec: 11000, programa: 'LATAM' as Programa },
    { destino: 'Recife', milhasEco: 6100, milhasExec: 15000, programa: 'Smiles' as Programa },
    { destino: 'Foz do Iguaçu', milhasEco: 9000, milhasExec: 18000, programa: 'Azul' as Programa },
    { destino: 'Buenos Aires', milhasEco: 10000, milhasExec: 22000, programa: 'LATAM' as Programa },
    { destino: 'Santiago', milhasEco: 11000, milhasExec: 25000, programa: 'Iberia' as Programa },
    { destino: 'Madri', milhasEco: 12800, milhasExec: 36500, programa: 'Iberia' as Programa },
    { destino: 'Paris', milhasEco: 31000, milhasExec: 58000, programa: 'Flying Blue' as Programa },
  ];

  return destinosBase
    .map(d => {
      const milhas = classe === 'economica' ? d.milhasEco : d.milhasExec;
      const programa = d.programa;
      const ref = VALORES_REFERENCIA[programa] || { baixo: 20, alto: 30 };

      return {
        destino: d.destino,
        milhasNecessarias: milhas,
        programa,
        classe,
        veredito: milhas <= milhasDisponiveis * 0.9 ? 'excelente' : 
                  milhas <= milhasDisponiveis ? 'bom' : 'limitrofe'
      };
    })
    .filter(d => d.milhasNecessarias <= milhasDisponiveis * 1.1) // permite um pouco acima
    .sort((a, b) => a.milhasNecessarias - b.milhasNecessarias);
}
