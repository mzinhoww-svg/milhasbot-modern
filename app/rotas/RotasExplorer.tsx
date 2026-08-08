'use client';

import { useCallback, useMemo, useState } from 'react';
import LocalPicker from '@/components/flights/LocalPicker';
import RouteMap, { type Arco, type Marcador } from '@/components/flights/RouteMap';
import { type Alvo, airportByIata, resolverAlvo, rotuloAlvo } from '@/lib/flights/airports';
import {
  corDaCompanhia,
  nomeDaCompanhia,
  programasDoItinerario,
} from '@/lib/flights/airlines';
import { formatDuration } from '@/lib/flights/geo';

interface Passo {
  de: string;
  para: string;
  companhias: string[];
  km: number;
  minutos: number;
}

interface Itinerario {
  passos: Passo[];
  origem: string;
  destino: string;
  conexoes: string[];
  voos: number;
  kmTotal: number;
  minutosTotal: number;
  companhiasUnicas: string[];
  companhiasTodas: string[];
  chegadaEstimada: { minutos: number; diaSeguinte: number };
  dentroDoPrazo: boolean;
}

interface Resposta {
  fonte: string;
  total: number;
  itinerarios: Itinerario[];
}

const fmtMin = (m: number) =>
  `${String(Math.floor((((m % 1440) + 1440) % 1440) / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function RotasExplorer() {
  const [origem, setOrigem] = useState<Alvo | null>({ tipo: 'aeroporto', valor: 'ATL' });
  const [destino, setDestino] = useState<Alvo | null>({ tipo: 'aeroporto', valor: 'CGB' });
  const [partida, setPartida] = useState('13:00');
  const [chegarAte, setChegarAte] = useState('');
  const [maxVoos, setMaxVoos] = useState(3);
  const [selecionado, setSelecionado] = useState(0);

  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const origemIata = origem?.tipo === 'aeroporto' ? origem.valor : null;
  const podeBuscar = Boolean(origemIata && destino);

  const buscar = useCallback(async () => {
    if (!origemIata || !destino) return;
    setCarregando(true);
    setErro(null);

    const params = new URLSearchParams({
      de: origemIata,
      alvo: `${destino.tipo}:${destino.valor}`,
      partida,
      maxVoos: String(maxVoos),
    });
    if (chegarAte) params.set('chegarAte', chegarAte);

    try {
      const r = await fetch(`/api/rotas/criativo?${params}`);
      const corpo = await r.json();
      if (!r.ok) {
        setResposta(null);
        setErro(corpo?.erro ?? `Falha na busca (HTTP ${r.status}).`);
        return;
      }
      setResposta(corpo as Resposta);
      setSelecionado(0);
    } catch (e) {
      setResposta(null);
      setErro(e instanceof Error ? e.message : 'Falha de rede.');
    } finally {
      setCarregando(false);
    }
  }, [origemIata, destino, partida, chegarAte, maxVoos]);

  const itinerarios = useMemo(() => resposta?.itinerarios ?? [], [resposta]);
  const foco = itinerarios[Math.min(selecionado, itinerarios.length - 1)];

  const { arcos, marcadores } = useMemo(() => {
    const arcos: Arco[] = [];
    const marcadores: Marcador[] = [];

    if (destino) {
      for (const a of resolverAlvo(destino, origemIata ? [origemIata] : [])) {
        if (a.grande) marcadores.push({ iata: a.iata, tipo: 'ponto' });
      }
    }
    for (const it of itinerarios.slice(0, 12)) {
      for (const p of it.passos) {
        arcos.push({ de: p.de, para: p.para, cor: '#3f3f46' });
      }
    }
    if (foco) {
      for (const p of foco.passos) {
        arcos.push({ de: p.de, para: p.para, cor: corDaCompanhia(p.companhias[0]), destaque: true });
      }
      marcadores.push({ iata: foco.origem, tipo: 'origem' });
      for (const c of foco.conexoes) marcadores.push({ iata: c, tipo: 'conexao' });
      marcadores.push({ iata: foco.destino, tipo: 'destino' });
    } else if (origemIata) {
      marcadores.push({ iata: origemIata, tipo: 'origem' });
    }
    return { arcos, marcadores };
  }, [itinerarios, foco, destino, origemIata]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Rotas Criativas nas Américas</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Feito para viagem de staff: quando o voo direto está cheio, mostra os caminhos
          alternativos por hubs não óbvios e diz se dá para chegar no horário. Só voos — rotas reais
          do OpenFlights; horários estimados.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <LocalPicker label="Origem" valor={origem} onChange={setOrigem} />
              <LocalPicker
                label="Destino"
                valor={destino}
                onChange={setDestino}
                permitirGrupos
                placeholder="Aeroporto, país ou região"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Campo rotulo="Partida" detalhe="hora local da origem">
                <input
                  type="time"
                  value={partida}
                  onChange={(e) => setPartida(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </Campo>
              <Campo rotulo="Chegar até" detalhe="hora local do destino">
                <input
                  type="time"
                  value={chegarAte}
                  onChange={(e) => setChegarAte(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </Campo>
            </div>

            <div>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Máximo de voos
              </span>
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setMaxVoos(n)}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm transition-colors ${
                      maxVoos === n
                        ? 'bg-emerald-500 text-white'
                        : 'border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    {n === 1 ? 'Só direto' : `${n} voos`}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void buscar()}
              disabled={!podeBuscar || carregando}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              {carregando ? 'Traçando rotas…' : 'Traçar rotas'}
            </button>

            {origem && origem.tipo !== 'aeroporto' && (
              <p className="text-xs text-amber-500">
                A origem precisa ser um aeroporto específico.
              </p>
            )}
          </div>

          {erro ? (
            <div className="rounded-2xl border border-red-800 bg-red-950/30 p-5">
              <h2 className="font-semibold text-white">A busca falhou</h2>
              <p className="mt-1 text-sm text-zinc-400">{erro}</p>
            </div>
          ) : (
            <Resultados
              resposta={resposta}
              carregando={carregando}
              destino={destino}
              temPrazo={Boolean(chegarAte)}
              selecionado={selecionado}
              onSelecionar={setSelecionado}
            />
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <RouteMap arcos={arcos} marcadores={marcadores} altura="h-[560px]" />
          {foco && <Detalhe it={foco} chegarAte={chegarAte} />}
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-xs text-zinc-600">
        Rotas da malha do OpenFlights (voos diretos reais por companhia). Os horários são estimados a
        partir da distância e de tempos padrão de conexão — servem para comparar
        viabilidade, não são o horário publicado. Confirme disponibilidade com a companhia.
      </p>
    </div>
  );
}

function Campo({ rotulo, detalhe, children }: { rotulo: string; detalhe?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
        {rotulo} {detalhe && <span className="normal-case text-zinc-600">({detalhe})</span>}
      </label>
      {children}
    </div>
  );
}

function rotaTexto(it: Itinerario): string {
  return [it.origem, ...it.passos.map((p) => p.para)].join(' → ');
}

function Resultados({
  resposta,
  carregando,
  destino,
  temPrazo,
  selecionado,
  onSelecionar,
}: {
  resposta: Resposta | null;
  carregando: boolean;
  destino: Alvo | null;
  temPrazo: boolean;
  selecionado: number;
  onSelecionar: (i: number) => void;
}) {
  if (carregando && !resposta) {
    return <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">Traçando rotas…</div>;
  }
  if (!resposta) {
    return (
      <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
        Escolha origem e destino e clique em traçar.
      </div>
    );
  }

  const { itinerarios } = resposta;
  const dentro = itinerarios.filter((it) => it.dentroDoPrazo).length;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          {itinerarios.length} rota{itinerarios.length === 1 ? '' : 's'}
          {destino && ` para ${rotuloAlvo(destino)}`}
        </h2>
        {temPrazo && (
          <span className="text-xs text-zinc-600">{dentro} no prazo</span>
        )}
      </div>

      {itinerarios.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
          Nenhuma rota encontrada com esses limites. Tente aumentar o máximo de voos.
        </div>
      ) : (
        <ul className="max-h-[540px] space-y-2 overflow-auto pr-1">
          {itinerarios.map((it, i) => (
            <li key={rotaTexto(it) + i}>
              <button
                type="button"
                onClick={() => onSelecionar(i)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  i === selecionado
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : temPrazo && !it.dentroDoPrazo
                      ? 'border-zinc-800 bg-zinc-900/20 opacity-60 hover:opacity-100'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-mono text-sm text-white">{rotaTexto(it)}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {it.voos === 1 ? 'voo direto' : `${it.voos} voos`}
                      {it.conexoes.length > 0 && ` · via ${it.conexoes.join(', ')}`}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-sm text-white">{formatDuration(it.minutosTotal)}</div>
                    <div className={`text-xs ${it.dentroDoPrazo ? 'text-emerald-400' : 'text-amber-500'}`}>
                      ~{fmtMin(it.chegadaEstimada.minutos)}
                      {it.chegadaEstimada.diaSeguinte > 0 && `+${it.chegadaEstimada.diaSeguinte}`}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(it.companhiasUnicas.length ? it.companhiasUnicas : it.companhiasTodas)
                    .slice(0, 4)
                    .map((c) => (
                      <span
                        key={c}
                        className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                        style={{ backgroundColor: `${corDaCompanhia(c)}22`, color: corDaCompanhia(c) }}
                      >
                        {nomeDaCompanhia(c)}
                      </span>
                    ))}
                  {it.companhiasUnicas.length > 0 && (
                    <span className="text-[10px] text-emerald-500/80">bilhete único possível</span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Detalhe({ it, chegarAte }: { it: Itinerario; chegarAte: string }) {
  const destino = airportByIata.get(it.destino);
  const programas = it.companhiasUnicas.length ? programasDoItinerario(it.companhiasUnicas) : [];

  // Enriquecimento de preço opcional, via Travelpayouts, para o par O–D.
  const [preco, setPreco] = useState<{ total: number; moeda: string; link: string } | null>(null);
  const [buscandoPreco, setBuscandoPreco] = useState(false);
  const [semPreco, setSemPreco] = useState(false);

  const verPreco = async () => {
    setBuscandoPreco(true);
    setSemPreco(false);
    try {
      const r = await fetch(`/api/rotas/itinerarios?de=${it.origem}&alvo=aeroporto:${it.destino}`);
      const c = await r.json();
      const melhor = c?.itinerarios?.[0];
      if (melhor?.preco) setPreco({ ...melhor.preco, link: melhor.link });
      else setSemPreco(true);
    } catch {
      setSemPreco(true);
    } finally {
      setBuscandoPreco(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">
          {it.origem} → {destino?.cidade ?? it.destino} ({it.destino})
        </h3>
        <span className="font-mono text-sm text-zinc-400">
          {it.kmTotal.toLocaleString('pt-BR')} km · {formatDuration(it.minutosTotal)}
        </span>
      </div>

      {chegarAte && (
        <p className={`mt-1 text-sm ${it.dentroDoPrazo ? 'text-emerald-400' : 'text-amber-500'}`}>
          Chegada estimada ~{fmtMin(it.chegadaEstimada.minutos)}
          {it.chegadaEstimada.diaSeguinte > 0 && ' do dia seguinte'} —{' '}
          {it.dentroDoPrazo ? `dentro do limite de ${chegarAte}` : `depois do limite de ${chegarAte}`}.
        </p>
      )}

      <ol className="mt-3 space-y-2">
        {it.passos.map((p, i) => (
          <li key={`${p.de}-${p.para}-${i}`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-mono text-white">
                {p.de} → {p.para}
              </span>
              <span className="text-zinc-500">
                ~{formatDuration(p.minutos)} · {p.km.toLocaleString('pt-BR')} km
              </span>
            </div>
            <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500">
              {p.companhias.slice(0, 6).map((c) => (
                <span key={c} style={{ color: corDaCompanhia(c) }}>
                  {nomeDaCompanhia(c)}
                </span>
              ))}
              {p.companhias.length > 6 && <span>+{p.companhias.length - 6}</span>}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 border-t border-zinc-800 pt-3">
        {preco ? (
          <a
            href={preco.link}
            target="_blank"
            rel="noreferrer"
            className="block w-full rounded-xl bg-emerald-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-400"
          >
            {it.origem}→{it.destino} a partir de {preco.moeda}{' '}
            {preco.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} · reservar →
          </a>
        ) : (
          <button
            type="button"
            onClick={() => void verPreco()}
            disabled={buscandoPreco}
            className="w-full rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500 disabled:opacity-50"
          >
            {buscandoPreco
              ? 'Buscando tarifa…'
              : semPreco
                ? 'Sem tarifa em cache para o trecho direto'
                : `Ver tarifa ${it.origem}→${it.destino} (Travelpayouts)`}
          </button>
        )}
      </div>

      {programas.length > 0 && (
        <div className="mt-3">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Bilhete único emite com
          </span>
          <div className="mt-1 flex flex-wrap gap-1">
            {programas.map((p) => (
              <span key={p} className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
