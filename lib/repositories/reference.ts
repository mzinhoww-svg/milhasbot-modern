/**
 * Camada de acesso a dados de referência.
 * Lê do banco (Prisma/Supabase) quando DATABASE_URL está configurada;
 * caso contrário, cai no fallback estático de lib/data/.
 *
 * As ferramentas interativas (client components) seguem importando lib/data
 * diretamente; esta camada serve para renderização no servidor.
 */

import { getPrisma } from '@/lib/db';
import { bonusTransferencias as bonusStatic, type BonusTransferencia } from '@/lib/data/bonus';
import { passagens as passagensStatic, type Passagem } from '@/lib/data/passagens';
import type { Programa } from '@/lib/calculations/milheiro';

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getBonusTransferencias(): Promise<BonusTransferencia[]> {
  const prisma = getPrisma();
  if (!prisma) return bonusStatic;
  try {
    const rows = await prisma.bonusTransferencia.findMany();
    if (rows.length === 0) return bonusStatic;
    return rows.map((r) => ({
      origem: r.origem,
      destino: r.destino,
      percentual: r.percentual,
      inicio: iso(r.inicio),
      fim: iso(r.fim),
      ativo: r.ativo,
    }));
  } catch {
    return bonusStatic;
  }
}

export async function getPassagens(): Promise<Passagem[]> {
  const prisma = getPrisma();
  if (!prisma) return passagensStatic;
  try {
    const rows = await prisma.passagem.findMany({ include: { programa: true } });
    if (rows.length === 0) return passagensStatic;
    return rows.map((r) => ({
      destino: r.destino,
      origem: r.origem,
      programa: r.programa.nome as Programa,
      milhas: r.milhas,
      cabine: r.cabine as Passagem['cabine'],
      regiao: r.regiao as Passagem['regiao'],
    }));
  } catch {
    return passagensStatic;
  }
}
