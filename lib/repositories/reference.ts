/**
 * Camada de acesso a dados de referência.
 * Lê do Supabase (tabelas mb_*) quando disponível; caso contrário,
 * cai no fallback estático de lib/data/.
 *
 * As ferramentas interativas (client components) seguem importando lib/data
 * diretamente; esta camada serve para renderização no servidor.
 */

import { supabase } from '@/lib/supabase';
import { bonusTransferencias as bonusStatic, type BonusTransferencia } from '@/lib/data/bonus';
import { passagens as passagensStatic, type Passagem } from '@/lib/data/passagens';
import type { Programa } from '@/lib/calculations/milheiro';

export async function getBonusTransferencias(): Promise<BonusTransferencia[]> {
  if (!supabase) return bonusStatic;
  try {
    const { data, error } = await supabase
      .from('mb_bonus')
      .select('origem,destino,percentual,inicio,fim,ativo');
    if (error || !data || data.length === 0) return bonusStatic;
    return data.map((r) => ({
      origem: r.origem,
      destino: r.destino,
      percentual: Number(r.percentual),
      inicio: r.inicio,
      fim: r.fim,
      ativo: r.ativo,
    }));
  } catch {
    return bonusStatic;
  }
}

export async function getPassagens(): Promise<Passagem[]> {
  if (!supabase) return passagensStatic;
  try {
    const { data, error } = await supabase
      .from('mb_passagem')
      .select('destino,origem,programa,milhas,cabine,regiao');
    if (error || !data || data.length === 0) return passagensStatic;
    return data.map((r) => ({
      destino: r.destino,
      origem: r.origem,
      programa: r.programa as Programa,
      milhas: r.milhas,
      cabine: r.cabine as Passagem['cabine'],
      regiao: r.regiao as Passagem['regiao'],
    }));
  } catch {
    return passagensStatic;
  }
}
