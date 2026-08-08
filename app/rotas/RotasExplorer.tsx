'use client';

import { useCallback, useMemo, useState } from 'react';
import LocalPicker from '@/components/flights/LocalPicker';
import RouteMap, { type Arco, type Marcador } from '@/components/flights/RouteMap';
import { type Alvo, airportByIata, resolverAlvo, rotuloAlvo } from '@/lib/flights/airports';
import {
  PROGRAMAS_REVISAO,
  corDaCompanhia,
  nomeDaCompanhia,
  programasDoItinerario,
  temCompanhiaForaDaCuradoria,
} from '@/lib/flights/airlines';
import { formatDuration } from '@/lib/flights/geo';

interface Chegada {
  data: string;
  minutos: number;
}

interface Oferta {
  origem: string;
  destino: string;
  companhia: string;
  voo?: string;
  partida: string;
  chegada: Chegada | null;
  duracaoMin: number;
  paradas: number;
  preco: { total: number; moeda: string };
  link: string;
}

interface Resposta {
  fonte: string;
  consultados: string[];
  ignorados: string[];
  falhas: { destino: string; motivo: string }[];
  total: number;
  itinerarios: Oferta[];
}

interface Falha {
  mensagem: string;
  configurado?: boolean;
}

const horaLocalPartida = (iso: string) => iso.slice(11, 16);
const formatMoeda = (v: number, m: string) =>
  `${m} ${v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
const formatMin = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

export default function RotasExplorer() {
  const [origem, setOrigem] = useState<Alvo | null>({ tipo: 'aeroporto', valor: 'ATL' });
  const [destino, setDestino] = useState<Alvo | null>({ tipo: 'pais', valor: 'Brasil' });
  // Vazio de propósito: a Data API só tem tarifa em cache para datas esparsas,
  // então uma data fixa quase sempre vem vazia. Sem data, cada rota devolve a
  // melhor tarifa disponível (com a data dela). O campo serve para estreitar.
  const [data, setData] = useState('');
  const [chegarAte, setChegarAte] = useState('');
  const [selecionado, setSelecionado] = useState(0);

  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [falha, setFalha] = useState<Falha | null>(null);
  const [carregando, setCarregando] = useState(false);

  const origemIata = origem?.tipo === 'aeroporto' ? origem.valor : null;
  const podeBuscar = Boolean(origemIata && destino);

  const buscar = useCallback(async () => {
    if (!origemIata || !destino) return;

    setCarregando(true);
    setFalha(null);

    const params = new URLSearchParams({ de: origemIata, alvo: `${destino.tipo}:${destino.valor}` });
    if (data) params.set('data', data);
    if (chegarAte) params.set('chegarAte', chegarAte);

    try {
      const r = await fetch(`/api/rotas/itinerarios?${params}`);
      const corpo = await r.json();
      if (!r.ok) {
        setResposta(null);
        setFalha({ mensagem: corpo?.erro ?? `Falha na busca (HTTP ${r.status}).`, configurado: corpo?.configurado });
        return;
      }
      setResposta(corpo as Resposta);
      setSelecionado(0);
    } catch (e) {
      setResposta(null);
      setFalha({ mensagem: e instanceof Error ? e.message : 'Falha de rede na busca.' });
    } finally {
      setCarregando(false);
    }
  }, [origemIata, destino, data, chegarAte]);

  const itinerarios = resposta?.itinerarios ?? [];
  const foco = itinerarios[Math.min(selecionado, itinerarios.length - 1)];

  const { arcos, marcadores } = useMemo(() => {
    const arcos: Arco[] = [];
    const marcadores: Marcador[] = [];

    if (destino) {
      for (const a of resolverAlvo(destino, origemIata ? [origemIata] : [])) {
        if (a.grande) marcadores.push({ iata: a.iata, tipo: 'ponto' });
      }
    }

    for (const it of itinerarios) {
      arcos.push({ de: it.origem, para: it.destino, cor: '#3f3f46' });
    }

    if (foco) {
      arcos.push({ de: foco.origem, para: foco.destino, cor: corDaCompanhia(foco.companhia), destaque: true });
      marcadores.push({ iata: foco.origem, tipo: 'origem' });
      marcadores.push({ iata: foco.destino, tipo: 'destino' });
    } else if (origemIata) {
      marcadores.push({ iata: origemIata, tipo: 'origem' });
    }

    return { arcos, marcadores };
  }, [itinerarios, foco, destino, origemIata]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Busca de Voos nas Américas</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Tarifas e horários reais do Travelpayouts. Busque por aeroporto, <strong>país</strong> ou{' '}
          <strong>região inteira</strong> e filtre pelo horário em que precisa chegar — o horário é o
          real da partida mais a duração do voo, não uma estimativa por distância.
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
              <Campo rotulo="Data da ida" detalhe="vazio = melhores tarifas">
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
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

            <button
              type="button"
              onClick={() => void buscar()}
              disabled={!podeBuscar || carregando}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              {carregando ? 'Consultando o Travelpayouts…' : 'Buscar voos'}
            </button>

            {origem && origem.tipo !== 'aeroporto' && (
              <p className="text-xs text-amber-500">
                A origem precisa ser um aeroporto específico — a busca parte de um ponto só.
              </p>
            )}
          </div>

          {falha && <Erro falha={falha} />}
          {!falha && (
            <Resultados
              resposta={resposta}
              carregando={carregando}
              destino={destino}
              selecionado={selecionado}
              onSelecionar={setSelecionado}
            />
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <RouteMap arcos={arcos} marcadores={marcadores} altura="h-[560px]" />
          {foco && <Detalhe oferta={foco} chegarAte={chegarAte} />}
        </div>
      </div>
    </div>
  );
}

function Campo({
  rotulo,
  detalhe,
  children,
}: {
  rotulo: string;
  detalhe?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
        {rotulo} {detalhe && <span className="normal-case text-zinc-600">({detalhe})</span>}
      </label>
      {children}
    </div>
  );
}

function Erro({ falha }: { falha: Falha }) {
  const semCredencial = falha.configurado === false;

  return (
    <div
      className={`rounded-2xl border p-5 ${
        semCredencial ? 'border-amber-600/50 bg-amber-500/5' : 'border-red-800 bg-red-950/30'
      }`}
    >
      <h2 className="font-semibold text-white">
        {semCredencial ? 'Fonte de dados não configurada' : 'A busca falhou'}
      </h2>
      <p className="mt-1 text-sm text-zinc-400">{falha.mensagem}</p>

      {semCredencial && (
        <div className="mt-3 space-y-2 text-sm text-zinc-400">
          <p>
            Crie um token gratuito no{' '}
            <a
              href="https://www.travelpayouts.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 underline underline-offset-2"
            >
              Travelpayouts
            </a>{' '}
            e defina no ambiente:
          </p>
          <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
            {`TRAVELPAYOUTS_TOKEN=...\nTRAVELPAYOUTS_MARKER=...  # opcional, p/ comissão`}
          </pre>
        </div>
      )}
    </div>
  );
}

function Resultados({
  resposta,
  carregando,
  destino,
  selecionado,
  onSelecionar,
}: {
  resposta: Resposta | null;
  carregando: boolean;
  destino: Alvo | null;
  selecionado: number;
  onSelecionar: (i: number) => void;
}) {
  if (carregando && !resposta) {
    return (
      <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
        Consultando tarifas reais…
      </div>
    );
  }

  if (!resposta) {
    return (
      <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
        Escolha origem e destino e clique em buscar.
      </div>
    );
  }

  const { itinerarios, consultados, ignorados, falhas } = resposta;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          {itinerarios.length} tarifa{itinerarios.length === 1 ? '' : 's'}
          {destino && ` para ${rotuloAlvo(destino)}`}
        </h2>
        <span className="text-xs text-zinc-600">{resposta.fonte}</span>
      </div>

      {(ignorados.length > 0 || falhas.length > 0) && (
        <div className="mb-2 space-y-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-500">
          <p>
            Consultados: <span className="font-mono text-zinc-400">{consultados.join(', ')}</span>
          </p>
          {ignorados.length > 0 && (
            <p>
              Fora do limite desta busca:{' '}
              <span className="font-mono">{ignorados.slice(0, 12).join(', ')}</span>
              {ignorados.length > 12 && ` +${ignorados.length - 12}`} — cada destino é uma chamada à
              API, então a consulta é limitada de propósito.
            </p>
          )}
          {falhas.map((f) => (
            <p key={f.destino} className="text-amber-500">
              {f.destino}: {f.motivo}
            </p>
          ))}
        </div>
      )}

      {itinerarios.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
          Nenhuma tarifa em cache atende a esses critérios. Tente outra data, afrouxar o horário de
          chegada ou um destino de maior movimento.
        </div>
      ) : (
        <ul className="max-h-[520px] space-y-2 overflow-auto pr-1">
          {itinerarios.map((it, i) => (
            <li key={`${it.origem}-${it.destino}-${it.partida}-${i}`}>
              <button
                type="button"
                onClick={() => onSelecionar(i)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  i === selecionado
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-sm text-white">
                      {it.origem} → {it.destino}
                    </div>
                    <div className="mt-1 truncate text-xs text-zinc-500">
                      {airportByIata.get(it.destino)?.cidade ?? it.destino} ·{' '}
                      {it.paradas === 0 ? 'voo direto' : `${it.paradas} parada${it.paradas > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-sm text-white">
                      {horaLocalPartida(it.partida)}
                      {it.chegada && (
                        <>
                          {' → '}
                          {formatMin(it.chegada.minutos)}
                          {it.chegada.data !== it.partida.slice(0, 10) && (
                            <sup className="text-amber-500">+1</sup>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-xs text-emerald-400">
                      {formatMoeda(it.preco.total, it.preco.moeda)}
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: `${corDaCompanhia(it.companhia)}22`, color: corDaCompanhia(it.companhia) }}
                  >
                    {nomeDaCompanhia(it.companhia)}
                  </span>
                  <span className="text-xs text-zinc-600">{it.partida.slice(0, 10)}</span>
                  {it.duracaoMin > 0 && (
                    <span className="ml-auto font-mono text-xs text-zinc-500">
                      {formatDuration(it.duracaoMin)}
                    </span>
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

function Detalhe({ oferta, chegarAte }: { oferta: Oferta; chegarAte: string }) {
  const destino = airportByIata.get(oferta.destino);
  const origem = airportByIata.get(oferta.origem);

  const programas = programasDoItinerario([oferta.companhia]);
  const foraDaCuradoria = temCompanhiaForaDaCuradoria([oferta.companhia]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">
          {origem?.cidade ?? oferta.origem} → {destino?.cidade ?? oferta.destino} ({oferta.destino})
        </h3>
        <span className="font-mono text-sm text-emerald-400">
          {formatMoeda(oferta.preco.total, oferta.preco.moeda)}
        </span>
      </div>

      <div className="mt-2 text-sm text-zinc-300">
        Parte {oferta.partida.slice(0, 10)} às{' '}
        <span className="font-mono">{horaLocalPartida(oferta.partida)}</span>
        {oferta.chegada && (
          <>
            {' '}
            e chega às <span className="font-mono">{formatMin(oferta.chegada.minutos)}</span> em{' '}
            {destino?.cidade ?? oferta.destino}
            {oferta.chegada.data !== oferta.partida.slice(0, 10) && (
              <span className="text-amber-500"> ({oferta.chegada.data})</span>
            )}
          </>
        )}
        .
      </div>

      {chegarAte && oferta.chegada && (
        <p className="mt-1 text-sm text-emerald-400">Dentro do limite de {chegarAte}.</p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
        <span>
          <span style={{ color: corDaCompanhia(oferta.companhia) }}>
            {nomeDaCompanhia(oferta.companhia)}
          </span>
          {oferta.voo && ` · ${oferta.voo}`}
        </span>
        {oferta.duracaoMin > 0 && <span>Duração {formatDuration(oferta.duracaoMin)}</span>}
        <span>
          {oferta.paradas === 0
            ? 'Voo direto'
            : `${oferta.paradas} parada${oferta.paradas > 1 ? 's' : ''}`}
        </span>
      </div>

      <a
        href={oferta.link}
        target="_blank"
        rel="noreferrer"
        className="mt-4 block w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-400"
      >
        Ver itinerário e reservar →
      </a>

      <div className="mt-4 border-t border-zinc-800 pt-3">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Emite com</span>
        {programas.length > 0 ? (
          <>
            <div className="mt-1 flex flex-wrap gap-1">
              {programas.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-zinc-600">
              Parcerias de emissão são curadoria editorial, revisada em {PROGRAMAS_REVISAO}. Tarifa,
              horário e link vêm do Travelpayouts.
            </p>
          </>
        ) : (
          <p className="mt-1 text-xs text-zinc-500">
            {foraDaCuradoria
              ? `${nomeDaCompanhia(oferta.companhia)} está fora da nossa curadoria de programas — não dá para afirmar nada sobre emissão em milhas.`
              : 'Sem programa de milhas mapeado para esta companhia.'}
          </p>
        )}
      </div>

      <p className="mt-3 text-[11px] text-zinc-600">
        A tarifa é a melhor em cache no Travelpayouts para esta rota; preço e disponibilidade mudam
        até a emissão. As conexões trecho a trecho aparecem na página de reserva.
      </p>
    </div>
  );
}
