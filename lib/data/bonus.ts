/**
 * Fonte única de bônus de transferência (ativos + histórico).
 * Substitui os arrays duplicados que existiam em bonus-ativos,
 * analisador-transferencia e para-onde-transferir.
 *
 * Datas de referência: julho/2026. Atualize aqui e todas as
 * ferramentas refletem a mudança.
 */

export interface BonusTransferencia {
  origem: string;
  destino: string;
  percentual: number;
  inicio: string; // ISO
  fim: string; // ISO
  ativo: boolean;
}

export const bonusTransferencias: BonusTransferencia[] = [
  // Ativos no momento (julho/2026)
  { origem: 'Livelo', destino: 'Smiles', percentual: 80, inicio: '2026-07-05', fim: '2026-07-31', ativo: true },
  { origem: 'Esfera', destino: 'LATAM', percentual: 100, inicio: '2026-07-08', fim: '2026-07-25', ativo: true },
  { origem: 'Livelo', destino: 'Azul', percentual: 60, inicio: '2026-07-10', fim: '2026-08-05', ativo: true },
  { origem: 'Esfera', destino: 'TAP', percentual: 90, inicio: '2026-07-01', fim: '2026-07-20', ativo: true },
  // Histórico (encerrados)
  { origem: 'Livelo', destino: 'Smiles', percentual: 80, inicio: '2026-06-05', fim: '2026-06-12', ativo: false },
  { origem: 'Esfera', destino: 'LATAM', percentual: 100, inicio: '2026-05-20', fim: '2026-05-28', ativo: false },
  { origem: 'Livelo', destino: 'Azul', percentual: 65, inicio: '2026-04-10', fim: '2026-04-15', ativo: false },
  { origem: 'Esfera', destino: 'Smiles', percentual: 120, inicio: '2026-03-18', fim: '2026-03-22', ativo: false },
  { origem: 'Livelo', destino: 'LATAM', percentual: 75, inicio: '2026-02-05', fim: '2026-02-10', ativo: false },
  { origem: 'Livelo', destino: 'Smiles', percentual: 100, inicio: '2026-01-15', fim: '2026-01-22', ativo: false },
  { origem: 'Esfera', destino: 'LATAM', percentual: 80, inicio: '2025-12-10', fim: '2025-12-18', ativo: false },
];

export function bonusAtivos(list: BonusTransferencia[] = bonusTransferencias): BonusTransferencia[] {
  return list.filter((b) => b.ativo);
}

export function historicoRota(
  origem: string,
  destino: string,
  list: BonusTransferencia[] = bonusTransferencias,
): BonusTransferencia[] {
  return list
    .filter((b) => b.origem === origem && b.destino === destino)
    .sort((a, b) => (a.inicio < b.inicio ? 1 : -1));
}

export function mediaHistoricaRota(
  origem: string,
  destino: string,
  list: BonusTransferencia[] = bonusTransferencias,
): number | null {
  const hist = list.filter((b) => b.origem === origem && b.destino === destino);
  if (hist.length === 0) return null;
  return hist.reduce((sum, b) => sum + b.percentual, 0) / hist.length;
}

/**
 * Classifica um bônus atual contra a média histórica da rota.
 */
export function vereditoBonus(percentual: number, media: number | null): 'Excelente' | 'Bom' | 'Regular' {
  if (media === null) return percentual >= 90 ? 'Excelente' : percentual >= 60 ? 'Bom' : 'Regular';
  if (percentual >= media * 1.1) return 'Excelente';
  if (percentual >= media * 0.9) return 'Bom';
  return 'Regular';
}

export const origens = ['Livelo', 'Esfera'] as const;
export const destinos = ['Smiles', 'LATAM', 'Azul', 'TAP'] as const;
