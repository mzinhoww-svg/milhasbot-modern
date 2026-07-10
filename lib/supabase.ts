import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase para leitura dos dados de referência (tabelas mb_*).
 * A URL e a chave publicável são públicas por design (a segurança é feita
 * por RLS no banco), por isso podem ficar versionadas. Podem ser
 * sobrescritas por variáveis de ambiente na Vercel.
 */
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://nwynoyqdrxaujlcratnx.supabase.co';
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_90Y5HFxZJbCydqbX3MA4Tw_oyOwzwnR';

export const hasSupabase = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = hasSupabase
  ? createClient(url, anonKey)
  : null;
