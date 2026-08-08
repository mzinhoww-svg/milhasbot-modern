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

interface SegmentoReal {
  de: string;
  para: string;
  partida: string;
  chegada: string;
  companhia: string;
  companhiaNome?: string;
  operadoPor?: string;
  voo: string;
  aeronave?: string;
  duracaoMin: number;
}

interface ItinerarioReal {
  id: string;
  segmentos: SegmentoReal[];
  paradas: number;
  duracaoMin: number;
  destino: string;
  preco?: { total: number; moeda: string };
  companhias: string[];
  chegada: { data: string; minutos: number } | null;
}

interface Resposta {
  fonte: string;
  ambiente: string;
  consultados: string[];
  ignorados: string[];
  falhas: { destino: string; motivo: string }[];
  total: number;
  itinerarios: ItinerarioReal[];
}

interface Falha {
  mensagem: string;
  configurado?: boolean;
}

const hora = (iso: string) => iso.slice(11, 16);
const dia = (iso: string) => iso.slice(0, 10);

function emDias(partida: string, chegada: string): number {
  const a = Date.parse(`${dia(partida)}T00:00:00Z`);
  const b = Date.parse(`${dia(chegada)}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

function amanha(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function RotasExplorer() {
  const [origem, setOrigem] = useState<Alvo | null>({ tipo: 'aeroporto', valor: 'ATL' });
  const [destino, setDestino] = useState<Alvo | null>({ tipo: 'pais', valor: 'Brasil' });
  const [data, setData] = useState(amanha());
  const [chegarAte, setChegarAte] = useState('');
  const [maxParadas, setMaxParadas] = useState(1);
  const [selecionado, setSelecionado] = useState(0);

  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [falha, setFalha] = useState<Falha | null>(null);
  const [carregando, setCarregando] = useState(false);

  const origemIata = origem?.tipo === 'aeroporto' ? origem.valor : null;
  const podeBuscar = Boolean(origemIata && destino && data);

  const buscar = useCallback(async () => {
    if (!origemIata || !destino) return;

    setCarregando(true);
    setFalha(null);

    const params = new URLSearchParams({
      de: origemIata,
      alvo: `${destino.tipo}:${destino.valor}`,
      data,
      paradas: String(maxParadas),
    });
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
  }, [origemIata, destino, data, maxParadas, chegarAte]);

  // A busca é sempre explícita: cada consulta gasta cota da Amadeus, então
  // abrir a página não dispara requisição nenhuma.
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

    for (const it of itinerarios.slice(0, 10)) {
      for (const s of it.segmentos) arcos.push({ de: s.de, para: s.para, cor: '#3f3f46' });
    }

    if (foco) {
      for (const s of foco.segmentos) {
        arcos.push({ de: s.de, para: s.para, cor: corDaCompanhia(s.companhia), destaque: true });
      }
      marcadores.push({ iata: foco.segmentos[0].de, tipo: 'origem' });
      for (const s of foco.segmentos.slice(0, -1)) {
        marcadores.push({ iata: s.para, tipo: 'conexao' });
      }
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
          Voos e horários reais da API da Amadeus. Busque por aeroporto,{' '}
          <strong>país</strong> ou <strong>região inteira</strong> e filtre pelo horário em que você
          precisa chegar — o horário comparado é o publicado pela companhia, não uma estimativa.
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
              <Campo rotulo="Data da ida">
                <input
                  type="date"
                  value={data}
                  min={new Date().toISOString().slice(0, 10)}
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

            <div>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Conexões
              </span>
              <div className="flex gap-2">
                {[0, 1, 2].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setMaxParadas(n)}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm transition-colors ${
                      maxParadas === n
                        ? 'bg-emerald-500 text-white'
                        : 'border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    {n === 0 ? 'Só direto' : `Até ${n} parada${n > 1 ? 's' : ''}`}
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
              {carregando ? 'Consultando a Amadeus…' : 'Buscar voos'}
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
          {foco && <Detalhe itinerario={foco} chegarAte={chegarAte} />}
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
            Crie uma chave gratuita em{' '}
            <a
              href="https://developers.amadeus.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 underline underline-offset-2"
            >
              developers.amadeus.com
            </a>{' '}
            e defina no ambiente:
          </p>
          <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">
            {`AMADEUS_CLIENT_ID=...\nAMADEUS_CLIENT_SECRET=...\n# AMADEUS_HOSTNAME=production  # opcional`}
          </pre>
          <p className="text-xs text-zinc-500">
            Sem as credenciais a tela não mostra rota nenhuma — de propósito. É melhor não responder
            do que responder com dado que ninguém verificou.
          </p>
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
        Consultando voos reais…
      </div>
    );
  }

  if (!resposta) {
    return (
      <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
        Escolha origem, destino e data e clique em buscar.
      </div>
    );
  }

  const { itinerarios, consultados, ignorados, falhas } = resposta;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          {itinerarios.length} voo{itinerarios.length === 1 ? '' : 's'}
          {destino && ` para ${rotuloAlvo(destino)}`}
        </h2>
        <span className="text-xs text-zinc-600">
          {resposta.fonte} · {resposta.ambiente}
        </span>
      </div>

      {(ignorados.length > 0 || falhas.length > 0) && (
        <div className="mb-2 space-y-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-500">
          <p>
            Consultados: <span className="font-mono text-zinc-400">{consultados.join(', ')}</span>
          </p>
          {ignorados.length > 0 && (
            <p>
              Fora do limite desta busca:{' '}
              <span className="font-mono">{ignorados.join(', ')}</span> — cada destino é uma chamada
              à API, então a consulta é limitada de propósito.
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
          Nenhum voo atende a esses critérios nessa data. Tente aceitar mais uma parada, afrouxar o
          horário de chegada ou mudar a data.
        </div>
      ) : (
        <ul className="max-h-[520px] space-y-2 overflow-auto pr-1">
          {itinerarios.map((it, i) => (
            <li key={`${it.id}-${it.destino}`}>
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
                      {it.segmentos[0].de}
                      {it.segmentos.map((s) => ` → ${s.para}`)}
                    </div>
                    <div className="mt-1 truncate text-xs text-zinc-500">
                      {airportByIata.get(it.destino)?.cidade ?? it.destino} ·{' '}
                      {it.paradas === 0 ? 'voo direto' : `${it.paradas} parada${it.paradas > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-sm text-white">
                      {hora(it.segmentos[0].partida)} →{' '}
                      {hora(it.segmentos[it.segmentos.length - 1].chegada)}
                      {emDias(it.segmentos[0].partida, it.segmentos[it.segmentos.length - 1].chegada) >
                        0 && (
                        <sup className="text-amber-500">
                          +
                          {emDias(
                            it.segmentos[0].partida,
                            it.segmentos[it.segmentos.length - 1].chegada,
                          )}
                        </sup>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500">{formatDuration(it.duracaoMin)}</div>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {it.companhias.map((c) => (
                    <span
                      key={c}
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: `${corDaCompanhia(c)}22`, color: corDaCompanhia(c) }}
                    >
                      {nomeDaCompanhia(
                        c,
                        it.segmentos.find((s) => s.companhia === c)?.companhiaNome,
                      )}
                    </span>
                  ))}
                  {it.preco && (
                    <span className="ml-auto font-mono text-xs text-emerald-400">
                      {it.preco.moeda}{' '}
                      {it.preco.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
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

function Detalhe({ itinerario, chegarAte }: { itinerario: ItinerarioReal; chegarAte: string }) {
  const destino = airportByIata.get(itinerario.destino);
  const ultimo = itinerario.segmentos[itinerario.segmentos.length - 1];

  const programas = programasDoItinerario(itinerario.companhias);
  const foraDaCuradoria = temCompanhiaForaDaCuradoria(itinerario.companhias);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">
          {itinerario.segmentos[0].de} → {destino?.cidade ?? itinerario.destino} (
          {itinerario.destino})
        </h3>
        <span className="font-mono text-sm text-zinc-400">
          {formatDuration(itinerario.duracaoMin)}
          {itinerario.preco &&
            ` · ${itinerario.preco.moeda} ${itinerario.preco.total.toLocaleString('pt-BR', {
              maximumFractionDigits: 0,
            })}`}
        </span>
      </div>

      {chegarAte && (
        <p className="mt-1 text-sm text-emerald-400">
          Chega às {hora(ultimo.chegada)} em {destino?.cidade ?? itinerario.destino} — dentro do
          limite de {chegarAte}.
        </p>
      )}

      <ol className="mt-3 space-y-3">
        {itinerario.segmentos.map((s, i) => {
          const proximo = itinerario.segmentos[i + 1];
          const esperaMin = proximo
            ? Math.round(
                (Date.parse(`${proximo.partida}Z`) - Date.parse(`${s.chegada}Z`)) / 60_000,
              )
            : 0;

          return (
            <li key={`${s.voo}-${s.de}`}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-mono text-white">
                  {hora(s.partida)} {s.de} → {hora(s.chegada)} {s.para}
                </span>
                <span className="text-zinc-500">{formatDuration(s.duracaoMin)}</span>
              </div>
              <div className="mt-0.5 text-xs text-zinc-500">
                <span style={{ color: corDaCompanhia(s.companhia) }}>
                  {nomeDaCompanhia(s.companhia, s.companhiaNome)}
                </span>{' '}
                {s.voo}
                {s.aeronave && ` · ${s.aeronave}`}
                {s.operadoPor && ` · operado por ${nomeDaCompanhia(s.operadoPor)}`}
              </div>

              {proximo && (
                <div className="my-2 border-l-2 border-dashed border-zinc-700 pl-3 text-xs text-zinc-500">
                  Conexão em {s.para} · espera de {formatDuration(esperaMin)}
                </div>
              )}
            </li>
          );
        })}
      </ol>

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
              Parcerias de emissão são curadoria editorial, revisada em {PROGRAMAS_REVISAO} — o voo e
              o horário acima vêm da Amadeus.
            </p>
          </>
        ) : (
          <p className="mt-1 text-xs text-zinc-500">
            {foraDaCuradoria
              ? 'Alguma companhia deste trajeto está fora da nossa curadoria de programas — não dá para afirmar nada sobre emissão em milhas.'
              : 'Nenhum programa único cobre todos os trechos; provavelmente exige duas emissões separadas.'}
          </p>
        )}
      </div>
    </div>
  );
}
