'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import LocalPicker from '@/components/flights/LocalPicker';
import RouteMap, { type Arco, type Marcador } from '@/components/flights/RouteMap';
import { airportByIata } from '@/lib/flights/airports';
import { ALIANCAS, type Alianca, PROGRAMAS, airlineByCode, airlines } from '@/lib/flights/airlines';
import { formatDuration } from '@/lib/flights/geo';
import {
  type Alvo,
  type Itinerario,
  TOTAL_AEROPORTOS,
  TOTAL_ROTAS,
  buscarItinerarios,
  resolverAlvo,
  rotuloAlvo,
} from '@/lib/flights/network';
import { ROUTES_REVISAO } from '@/lib/flights/routes';
import { chegadaLocal, formatHourMinute, parseHourMinute, rotuloFuso } from '@/lib/flights/time';

const SUGESTOES: { rotulo: string; origem: string; alvo: Alvo }[] = [
  { rotulo: 'Atlanta → Brasil', origem: 'ATL', alvo: { tipo: 'pais', valor: 'Brasil' } },
  { rotulo: 'São Paulo → Caribe', origem: 'GRU', alvo: { tipo: 'regiao', valor: 'Caribe' } },
  { rotulo: 'Rio → México', origem: 'GIG', alvo: { tipo: 'pais', valor: 'México' } },
  { rotulo: 'Recife → Estados Unidos', origem: 'REC', alvo: { tipo: 'pais', valor: 'Estados Unidos' } },
  { rotulo: 'Brasília → Colômbia', origem: 'BSB', alvo: { tipo: 'pais', valor: 'Colômbia' } },
];

interface Avaliado {
  itinerario: Itinerario;
  chegada: { minutos: number; diaSeguinte: number };
  dentroDoPrazo: boolean;
}

export default function RotasExplorer() {
  const [origem, setOrigem] = useState<Alvo | null>({ tipo: 'aeroporto', valor: 'ATL' });
  const [destino, setDestino] = useState<Alvo | null>({ tipo: 'pais', valor: 'Brasil' });
  const [maxParadas, setMaxParadas] = useState(1);
  const [alianca, setAlianca] = useState<Alianca | ''>('');
  const [programa, setPrograma] = useState('');
  const [companhia, setCompanhia] = useState('');
  const [partida, setPartida] = useState('08:00');
  const [chegarAte, setChegarAte] = useState('');
  const [soDentroDoPrazo, setSoDentroDoPrazo] = useState(true);
  const [umPorDestino, setUmPorDestino] = useState(true);
  const [selecionado, setSelecionado] = useState(0);

  const origemIata = origem?.tipo === 'aeroporto' ? origem.valor : null;

  const resultados = useMemo<Avaliado[]>(() => {
    if (!origemIata || !destino) return [];

    const itinerarios = buscarItinerarios({
      origens: [origemIata],
      alvo: destino,
      maxParadas,
      aliancas: alianca ? [alianca] : undefined,
      programa: programa || undefined,
      companhias: companhia ? [companhia] : undefined,
      limite: 40,
    });

    const partidaMin = parseHourMinute(partida) ?? 8 * 60;
    const limite = parseHourMinute(chegarAte);
    const aeroportoOrigem = airportByIata.get(origemIata)!;

    // A data serve só para resolver horário de verão; o resultado é o horário
    // local estimado, não uma data de viagem específica.
    const hoje = new Date();
    const data = new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()));

    return itinerarios.map((itinerario) => {
      const aeroportoDestino = airportByIata.get(itinerario.destino)!;
      const chegada = chegadaLocal(
        data,
        aeroportoOrigem.tz,
        partidaMin,
        aeroportoDestino.tz,
        itinerario.minutosTotal,
      );

      const dentroDoPrazo =
        limite === null || (chegada.diaSeguinte === 0 && chegada.minutos <= limite);

      return { itinerario, chegada, dentroDoPrazo };
    });
  }, [origemIata, destino, maxParadas, alianca, programa, companhia, partida, chegarAte]);

  const buscaPorGrupo = destino !== null && destino.tipo !== 'aeroporto';

  const visiveis = useMemo(() => {
    let lista =
      soDentroDoPrazo && chegarAte ? resultados.filter((r) => r.dentroDoPrazo) : resultados;

    // Buscando um país ou região inteira, dezenas de caminhos até a mesma
    // cidade só empurram os outros destinos para fora da lista. Guarda o
    // melhor de cada — a lista já vem ordenada por tempo total.
    if (buscaPorGrupo && umPorDestino) {
      const melhores = new Map<string, Avaliado>();
      for (const r of lista) {
        if (!melhores.has(r.itinerario.destino)) melhores.set(r.itinerario.destino, r);
      }
      lista = [...melhores.values()];
    }

    return lista;
  }, [resultados, soDentroDoPrazo, chegarAte, buscaPorGrupo, umPorDestino]);

  const foco = visiveis[Math.min(selecionado, visiveis.length - 1)];

  const { arcos, marcadores } = useMemo(() => {
    const arcos: Arco[] = [];
    const marcadores: Marcador[] = [];

    // Contexto: todos os aeroportos que satisfazem o destino escolhido.
    if (destino) {
      for (const a of resolverAlvo(destino, origemIata ? [origemIata] : [])) {
        marcadores.push({ iata: a.iata, tipo: 'ponto' });
      }
    }

    // Malha de fundo com as demais opções encontradas.
    for (const { itinerario } of visiveis.slice(0, 12)) {
      for (const s of itinerario.segmentos) {
        arcos.push({ de: s.de, para: s.para, cor: '#3f3f46' });
      }
    }

    if (foco) {
      const { itinerario } = foco;
      for (const s of itinerario.segmentos) {
        const cor = airlineByCode.get(s.companhias[0])?.cor ?? '#10b981';
        arcos.push({ de: s.de, para: s.para, cor, destaque: true });
      }
      marcadores.push({ iata: itinerario.segmentos[0].de, tipo: 'origem' });
      for (const c of itinerario.conexoes) marcadores.push({ iata: c.iata, tipo: 'conexao' });
      marcadores.push({ iata: itinerario.destino, tipo: 'destino' });
    } else if (origemIata) {
      marcadores.push({ iata: origemIata, tipo: 'origem' });
    }

    return { arcos, marcadores };
  }, [visiveis, foco, destino, origemIata]);

  const fusoOrigem = origemIata
    ? rotuloFuso(airportByIata.get(origemIata)!.tz, new Date())
    : '';

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Mapa de Rotas das Américas</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          {TOTAL_ROTAS.toLocaleString('pt-BR')} rotas de {airlines.length} companhias entre{' '}
          {TOTAL_AEROPORTOS} aeroportos. Busque por aeroporto, <strong>país</strong> ou{' '}
          <strong>região inteira</strong>, filtre por horário de chegada e veja com qual programa de
          milhas dá para emitir cada itinerário.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {SUGESTOES.map((s) => (
          <button
            key={s.rotulo}
            type="button"
            onClick={() => {
              setOrigem({ tipo: 'aeroporto', valor: s.origem });
              setDestino(s.alvo);
              setSelecionado(0);
            }}
            className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-emerald-500 hover:text-white"
          >
            {s.rotulo}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <LocalPicker label="Origem" valor={origem} onChange={setOrigem} />
              <LocalPicker
                label="Destino"
                valor={destino}
                onChange={(v) => {
                  setDestino(v);
                  setSelecionado(0);
                }}
                permitirGrupos
                placeholder="Aeroporto, país ou região"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Partida {fusoOrigem && <span className="normal-case text-zinc-600">({fusoOrigem})</span>}
                </label>
                <input
                  type="time"
                  value={partida}
                  onChange={(e) => setPartida(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Chegar até <span className="normal-case text-zinc-600">(hora local)</span>
                </label>
                <input
                  type="time"
                  value={chegarAte}
                  onChange={(e) => setChegarAte(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              {chegarAte && (
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={soDentroDoPrazo}
                    onChange={(e) => setSoDentroDoPrazo(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  Esconder itinerários que chegam depois de {chegarAte}
                </label>
              )}
              {buscaPorGrupo && (
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={umPorDestino}
                    onChange={(e) => {
                      setUmPorDestino(e.target.checked);
                      setSelecionado(0);
                    }}
                    className="accent-emerald-500"
                  />
                  Mostrar só a melhor opção de cada cidade
                </label>
              )}
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
                    onClick={() => {
                      setMaxParadas(n);
                      setSelecionado(0);
                    }}
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

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Aliança
                </label>
                <select
                  value={alianca}
                  onChange={(e) => setAlianca(e.target.value as Alianca | '')}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Todas</option>
                  {(Object.keys(ALIANCAS) as Alianca[]).map((a) => (
                    <option key={a} value={a}>
                      {ALIANCAS[a].nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Companhia
                </label>
                <select
                  value={companhia}
                  onChange={(e) => setCompanhia(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Todas</option>
                  {airlines.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Programa
                </label>
                <select
                  value={programa}
                  onChange={(e) => setPrograma(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Qualquer</option>
                  {PROGRAMAS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <ResultadoLista
            resultados={visiveis}
            total={resultados.length}
            selecionado={selecionado}
            onSelecionar={setSelecionado}
            destino={destino}
            temPrazo={Boolean(chegarAte)}
          />
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <RouteMap arcos={arcos} marcadores={marcadores} altura="h-[560px]" />
          {foco && <DetalheItinerario avaliado={foco} chegarAte={chegarAte} />}
        </div>
      </div>

      <p className="mt-8 text-xs text-zinc-600">
        Base de referência revisada em {ROUTES_REVISAO}. Durações e horários de chegada são
        estimativas calculadas a partir da distância e do fuso de cada aeroporto — não são o horário
        publicado da companhia. Confirme o voo antes de emitir.
      </p>
    </div>
  );
}

function ResultadoLista({
  resultados,
  total,
  selecionado,
  onSelecionar,
  destino,
  temPrazo,
}: {
  resultados: Avaliado[];
  total: number;
  selecionado: number;
  onSelecionar: (i: number) => void;
  destino: Alvo | null;
  temPrazo: boolean;
}) {
  if (!destino) {
    return (
      <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
        Escolha um destino — pode ser um aeroporto, um país inteiro ou uma região.
      </div>
    );
  }

  if (resultados.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
        {total > 0
          ? 'Nenhum itinerário chega dentro do horário pedido. Tente sair mais cedo, aceitar mais uma parada ou afrouxar o limite.'
          : 'Nenhum itinerário com esses filtros. Tente aceitar mais uma parada ou remover o filtro de companhia/programa.'}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          {resultados.length} itinerário{resultados.length > 1 ? 's' : ''} para {rotuloAlvo(destino)}
        </h2>
        {temPrazo && total > resultados.length && (
          <span className="text-xs text-zinc-600">{total - resultados.length} fora do prazo</span>
        )}
      </div>

      <ul className="max-h-[520px] space-y-2 overflow-auto pr-1">
        {resultados.map((r, i) => (
          <li key={[r.itinerario.segmentos[0].de, ...r.itinerario.segmentos.map((s) => s.para)].join('-')}>
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
                    {r.itinerario.segmentos[0].de}
                    {r.itinerario.segmentos.map((s) => ` → ${s.para}`)}
                  </div>
                  <div className="mt-1 truncate text-xs text-zinc-500">
                    {airportByIata.get(r.itinerario.destino)?.cidade} ·{' '}
                    {r.itinerario.paradas === 0
                      ? 'voo direto'
                      : `${r.itinerario.paradas} parada${r.itinerario.paradas > 1 ? 's' : ''}`}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-sm text-emerald-400">
                    {formatDuration(r.itinerario.minutosTotal)}
                  </div>
                  <div
                    className={`text-xs ${r.dentroDoPrazo ? 'text-zinc-500' : 'text-amber-500'}`}
                  >
                    chega {formatHourMinute(r.chegada.minutos)}
                    {r.chegada.diaSeguinte > 0 && `+${r.chegada.diaSeguinte}`}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {[...new Set(r.itinerario.segmentos.flatMap((s) => s.companhias))]
                  .slice(0, 5)
                  .map((c) => (
                    <span
                      key={c}
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${airlineByCode.get(c)?.cor ?? '#71717a'}22`,
                        color: airlineByCode.get(c)?.cor ?? '#a1a1aa',
                      }}
                    >
                      {airlineByCode.get(c)?.nome ?? c}
                    </span>
                  ))}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetalheItinerario({
  avaliado,
  chegarAte,
}: {
  avaliado: Avaliado;
  chegarAte: string;
}) {
  const { itinerario, chegada, dentroDoPrazo } = avaliado;
  const destino = airportByIata.get(itinerario.destino)!;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">
          {itinerario.segmentos[0].de} → {destino.cidade} ({destino.iata})
        </h3>
        <span className="font-mono text-sm text-zinc-400">
          {itinerario.kmTotal.toLocaleString('pt-BR')} km ·{' '}
          {formatDuration(itinerario.minutosTotal)}
        </span>
      </div>

      {chegarAte && (
        <p className={`mt-1 text-sm ${dentroDoPrazo ? 'text-emerald-400' : 'text-amber-500'}`}>
          Chega às {formatHourMinute(chegada.minutos)}
          {chegada.diaSeguinte > 0 && ` do dia seguinte`} em {destino.cidade} —{' '}
          {dentroDoPrazo ? `dentro do limite de ${chegarAte}` : `depois do limite de ${chegarAte}`}.
        </p>
      )}

      <ol className="mt-3 space-y-2">
        {itinerario.segmentos.map((s, i) => (
          <li key={`${s.de}-${s.para}`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-mono text-white">
                {s.de} → {s.para}
              </span>
              <span className="text-zinc-500">
                {formatDuration(s.minutos)} · {s.km.toLocaleString('pt-BR')} km
              </span>
            </div>
            <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500">
              {s.companhias.map((c) => (
                <Link
                  key={c}
                  href={`/rotas/cia/${c}`}
                  className="hover:text-white"
                  style={{ color: airlineByCode.get(c)?.cor }}
                >
                  {airlineByCode.get(c)?.nome ?? c}
                </Link>
              ))}
            </div>

            {itinerario.conexoes[i] && (
              <div className="my-2 border-l-2 border-dashed border-zinc-700 pl-3 text-xs text-zinc-500">
                Conexão em {itinerario.conexoes[i].iata} · mínimo{' '}
                {formatDuration(itinerario.conexoes[i].minutos)}
                {itinerario.conexoes[i].trocaSemAcordo && (
                  <span className="text-amber-500">
                    {' '}
                    — companhias sem acordo, bagagem provavelmente não é despachada até o destino
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4 border-t border-zinc-800 pt-3">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Emite com
        </span>
        {itinerario.programas.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1">
            {itinerario.programas.map((p) => (
              <span
                key={p}
                className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400"
              >
                {p}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-xs text-zinc-500">
            Nenhum programa único cobre os dois trechos — provavelmente exige duas emissões
            separadas.
          </p>
        )}
      </div>
    </div>
  );
}
