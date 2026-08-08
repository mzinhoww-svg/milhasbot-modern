'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { REGIOES, airports } from '@/lib/flights/airports';
import { type Alvo, aeroportosPorMovimento, paises, rotuloAlvo } from '@/lib/flights/network';

interface Opcao {
  alvo: Alvo;
  titulo: string;
  detalhe: string;
  /** Texto normalizado usado na busca. */
  busca: string;
  /** Quanto maior, mais acima aparece com buscas equivalentes. */
  peso: number;
}

const semAcento = (texto: string) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function construirOpcoes(permitirGrupos: boolean): Opcao[] {
  const rotasPorIata = new Map(
    aeroportosPorMovimento.map(({ aeroporto, rotas }) => [aeroporto.iata, rotas]),
  );

  const deAeroportos: Opcao[] = airports.map((a) => ({
    alvo: { tipo: 'aeroporto', valor: a.iata },
    titulo: `${a.cidade} · ${a.iata}`,
    detalhe: `${a.nome} — ${a.pais}`,
    busca: semAcento(`${a.iata} ${a.cidade} ${a.nome} ${a.pais}`),
    peso: rotasPorIata.get(a.iata) ?? 0,
  }));

  if (!permitirGrupos) return deAeroportos;

  const deRegioes: Opcao[] = REGIOES.map((r) => ({
    alvo: { tipo: 'regiao', valor: r },
    titulo: r,
    detalhe: `Região inteira — ${airports.filter((a) => a.regiao === r).length} aeroportos`,
    busca: semAcento(`${r} regiao`),
    // Grupos vêm antes de aeroportos individuais quando o texto casa com os dois.
    peso: 10_000,
  }));

  const dePaises: Opcao[] = paises.map((p) => ({
    alvo: { tipo: 'pais', valor: p.pais },
    titulo: p.pais,
    detalhe: `País inteiro — ${p.aeroportos} aeroporto${p.aeroportos > 1 ? 's' : ''}`,
    busca: semAcento(`${p.pais} pais`),
    peso: 5_000 + p.aeroportos,
  }));

  return [...deRegioes, ...dePaises, ...deAeroportos];
}

interface Props {
  valor: Alvo | null;
  onChange: (alvo: Alvo | null) => void;
  label: string;
  /** Habilita escolher um país ou uma região inteira, não só um aeroporto. */
  permitirGrupos?: boolean;
  placeholder?: string;
}

export default function LocalPicker({
  valor,
  onChange,
  label,
  permitirGrupos = false,
  placeholder = 'Cidade, aeroporto ou código',
}: Props) {
  const [texto, setTexto] = useState('');
  const [aberto, setAberto] = useState(false);
  const [destacado, setDestacado] = useState(0);
  const container = useRef<HTMLDivElement>(null);

  const opcoes = useMemo(() => construirOpcoes(permitirGrupos), [permitirGrupos]);

  const resultados = useMemo(() => {
    const termo = semAcento(texto.trim());

    if (termo === '') {
      return opcoes
        .slice()
        .sort((a, b) => b.peso - a.peso)
        .slice(0, 8);
    }

    return opcoes
      .filter((o) => o.busca.includes(termo))
      .sort((a, b) => {
        // Quem começa com o termo digitado vem primeiro.
        const inicioA = a.busca.startsWith(termo) ? 0 : 1;
        const inicioB = b.busca.startsWith(termo) ? 0 : 1;
        return inicioA - inicioB || b.peso - a.peso;
      })
      .slice(0, 10);
  }, [opcoes, texto]);

  useEffect(() => {
    const aoClicarFora = (e: MouseEvent) => {
      if (!container.current?.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, []);

  const selecionar = (opcao: Opcao) => {
    onChange(opcao.alvo);
    setTexto('');
    setAberto(false);
  };

  const aoTeclar = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAberto(true);
      setDestacado((i) => Math.min(i + 1, resultados.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDestacado((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const escolhido = resultados[destacado];
      if (escolhido) selecionar(escolhido);
    } else if (e.key === 'Escape') {
      setAberto(false);
    }
  };

  return (
    <div ref={container} className="relative">
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </label>

      {valor ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
          <span className="truncate text-sm text-white">{rotuloAlvo(valor)}</span>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setAberto(true);
            }}
            className="shrink-0 text-xs text-zinc-500 hover:text-white"
          >
            trocar
          </button>
        </div>
      ) : (
        <input
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAberto(true);
            setDestacado(0);
          }}
          onFocus={() => setAberto(true)}
          onKeyDown={aoTeclar}
          placeholder={placeholder}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
        />
      )}

      {aberto && !valor && resultados.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-zinc-700 bg-zinc-900 py-1 shadow-2xl">
          {resultados.map((o, i) => (
            <li key={`${o.alvo.tipo}:${o.alvo.valor}`}>
              <button
                type="button"
                onMouseEnter={() => setDestacado(i)}
                onClick={() => selecionar(o)}
                className={`flex w-full flex-col items-start px-3 py-2 text-left transition-colors ${
                  i === destacado ? 'bg-zinc-800' : ''
                }`}
              >
                <span className="flex items-center gap-2 text-sm text-white">
                  {o.titulo}
                  {o.alvo.tipo !== 'aeroporto' && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-400">
                      {o.alvo.tipo === 'pais' ? 'país' : 'região'}
                    </span>
                  )}
                </span>
                <span className="text-xs text-zinc-500">{o.detalhe}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
