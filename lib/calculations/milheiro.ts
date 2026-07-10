/**
 * MilhasBot - Cálculos da Calculadora do Milheiro
 * Reutilização máxima das fórmulas originais validadas
 */

// ============================================
// TIPOS
// ============================================

export type Programa =
  | 'AAdvantage'
  | 'Iberia'
  | 'LATAM'
  | 'LifeMiles'
  | 'Aeroplan'
  | 'Livelo'
  | 'Smiles'
  | 'Esfera'
  | 'TAP'
  | 'Azul';

export type Veredito = 'excelente' | 'bom' | 'limitrofe' | 'caro';

export interface ValoresReferencia {
  baixo: number;
  alto: number;
}

// Valores de referência (julho/2026) - reutilizados do original
export const VALORES_REFERENCIA: Record<Programa, ValoresReferencia> = {
  AAdvantage: { baixo: 30, alto: 45 },
  Iberia: { baixo: 30, alto: 42 },
  LATAM: { baixo: 27, alto: 33 },
  LifeMiles: { baixo: 25, alto: 38 },
  Aeroplan: { baixo: 24, alto: 36 },
  Livelo: { baixo: 23, alto: 29 },
  Smiles: { baixo: 21, alto: 27 },
  Esfera: { baixo: 21, alto: 27 },
  TAP: { baixo: 20, alto: 26 },
  Azul: { baixo: 17, alto: 21 },
};

// ============================================
// FUNÇÕES DE CÁLCULO (Reutilizadas do original)
// ============================================

/**
 * Modo 1: Milhas ou Dinheiro
 * Fórmula original: (preço − taxas) ÷ milhas × 1.000
 */
export function calcularMilheiroEmissao(
  preco: number,
  taxas: number,
  milhas: number
): number {
  if (milhas <= 0) return 0;
  return ((preco - taxas) / milhas) * 1000;
}

/**
 * Modo 2: Custo de Fabricar
 * Fórmula original: custo ÷ (pontos × (1 + bônus/100)) × 1.000
 */
export function calcularCustoFabricar(
  custoTotal: number,
  pontos: number,
  bonusPercentual: number
): number {
  if (pontos <= 0) return 0;
  const fatorBonus = 1 + bonusPercentual / 100;
  return (custoTotal / (pontos * fatorBonus)) * 1000;
}

/**
 * Modo 3: Quanto Valem
 */
export function calcularQuantoValem(
  saldo: number,
  valorReferencia: number
): number {
  return (saldo / 1000) * valorReferencia;
}

/**
 * Modo 4: Minha Carteira (soma por programa)
 */
export function calcularCarteira(
  saldos: Array<{ programa: Programa; saldo: number }>
): { total: number; porPrograma: Record<Programa, number> } {
  const porPrograma: Record<Programa, number> = {} as any;
  let total = 0;

  for (const { programa, saldo } of saldos) {
    const ref = VALORES_REFERENCIA[programa];
    const valor = calcularQuantoValem(saldo, ref.alto); // usa o valor alto como referência
    porPrograma[programa] = valor;
    total += valor;
  }

  return { total, porPrograma };
}

// ============================================
// VEREDITO (Lógica reutilizada do original)
// ============================================

export function getVeredito(valorMilheiro: number, programa: Programa): Veredito {
  const ref = VALORES_REFERENCIA[programa];
  
  if (valorMilheiro >= ref.alto) return 'excelente';
  if (valorMilheiro >= ref.baixo) return 'bom';
  if (valorMilheiro >= ref.baixo * 0.85) return 'limitrofe';
  return 'caro';
}

export function getVereditoColor(veredito: Veredito): string {
  switch (veredito) {
    case 'excelente': return 'bg-green-500 text-white';
    case 'bom': return 'bg-emerald-500 text-white';
    case 'limitrofe': return 'bg-yellow-500 text-black';
    case 'caro': return 'bg-red-500 text-white';
  }
}

export function getVereditoLabel(veredito: Veredito): string {
  const labels: Record<Veredito, string> = {
    excelente: 'Excelente',
    bom: 'Bom',
    limitrofe: 'Limítrofe',
    caro: 'Caro',
  };
  return labels[veredito];
}
