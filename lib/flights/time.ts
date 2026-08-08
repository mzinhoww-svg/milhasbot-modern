/**
 * Horários locais e fusos.
 *
 * A base de rotas não tem horário de voo real — o que ela sabe é a duração
 * estimada de cada trecho. Isso já é suficiente para responder à pergunta que
 * de fato importa no planejamento: "saindo de X às 8h, dá para estar em Y antes
 * das 17h?". O cálculo é sempre estimativa e está rotulado como tal na tela.
 */

const offsetCache = new Map<string, number>();

/**
 * Deslocamento do fuso em minutos em relação ao UTC, na data informada.
 * Usa a tabela de fusos do próprio runtime, então respeita horário de verão.
 */
export function tzOffsetMinutes(tz: string, date: Date): number {
  const key = `${tz}|${date.toISOString().slice(0, 10)}`;
  const cached = offsetCache.get(key);
  if (cached !== undefined) return cached;

  // Formata o mesmo instante no fuso alvo e em UTC; a diferença é o offset.
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((p) => [p.type, p.value]),
  );

  // `hour` volta como "24" à meia-noite em alguns runtimes; normaliza para 0.
  const hour = Number(parts.hour) % 24;

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second),
  );

  const offset = Math.round((asUtc - date.getTime()) / 60000);
  offsetCache.set(key, offset);
  return offset;
}

/** Converte "HH:MM" em minutos desde a meia-noite. Retorna null se inválido. */
export function parseHourMinute(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;

  return h * 60 + m;
}

export function formatHourMinute(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export interface LocalInstant {
  /** Minutos desde a meia-noite no fuso local. */
  minutos: number;
  /** Quantos dias depois da partida — 0 = mesmo dia, 1 = dia seguinte. */
  diaSeguinte: number;
}

/**
 * Dado um embarque em `origemTz` no dia `data` às `partidaMin` (hora local) e
 * uma viagem de `duracaoMin`, devolve o horário local de chegada em `destinoTz`
 * e quantos dias virou.
 */
export function chegadaLocal(
  data: Date,
  origemTz: string,
  partidaMin: number,
  destinoTz: string,
  duracaoMin: number,
): LocalInstant {
  const diaBase = Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate());

  // Aproxima o instante da partida para descobrir o offset correto na data.
  const aproximado = new Date(diaBase + partidaMin * 60000);
  const offsetOrigem = tzOffsetMinutes(origemTz, aproximado);
  const partidaUtc = new Date(diaBase + (partidaMin - offsetOrigem) * 60000);

  const chegadaUtc = new Date(partidaUtc.getTime() + duracaoMin * 60000);
  const offsetDestino = tzOffsetMinutes(destinoTz, chegadaUtc);

  const localMs = chegadaUtc.getTime() + offsetDestino * 60000;
  const minutosDesdeBase = Math.round((localMs - diaBase) / 60000);

  return {
    minutos: ((minutosDesdeBase % 1440) + 1440) % 1440,
    diaSeguinte: Math.floor(minutosDesdeBase / 1440),
  };
}

/** Rótulo curto do fuso, ex.: "UTC−3". */
export function rotuloFuso(tz: string, data: Date): string {
  const offset = tzOffsetMinutes(tz, data);
  const sinal = offset < 0 ? '−' : '+';
  const abs = Math.abs(offset);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `UTC${sinal}${h}` : `UTC${sinal}${h}:${String(m).padStart(2, '0')}`;
}
