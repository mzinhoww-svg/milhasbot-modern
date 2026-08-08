'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { airportByIata } from '@/lib/flights/airports';
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  boundsOf,
  greatCirclePath,
  project,
  toViewBox,
  type BoundingBox,
} from '@/lib/flights/geo';
import { AMERICAS_LAND_PATH } from '@/lib/flights/land';

export interface Arco {
  de: string;
  para: string;
  cor: string;
  /** Traço mais grosso e opaco para o itinerário em foco. */
  destaque?: boolean;
}

export type TipoMarcador = 'origem' | 'destino' | 'conexao' | 'ponto';

export interface Marcador {
  iata: string;
  tipo: TipoMarcador;
  rotulo?: string;
}

const ESTILO_MARCADOR: Record<TipoMarcador, { raio: number; cor: string; anel: string }> = {
  origem: { raio: 6, cor: '#10b981', anel: '#064e3b' },
  destino: { raio: 6, cor: '#f43f5e', anel: '#4c0519' },
  conexao: { raio: 4.5, cor: '#eab308', anel: '#422006' },
  ponto: { raio: 2.6, cor: '#71717a', anel: '#27272a' },
};

// Arcos curtos não precisam de 48 segmentos para parecerem curvos.
const segmentosPara = (km: number) => Math.max(2, Math.min(48, Math.round(km / 260)));

interface Props {
  arcos: Arco[];
  marcadores: Marcador[];
  /** Ajusta o enquadramento ao conteúdo em vez de mostrar todas as Américas. */
  enquadrar?: boolean;
  altura?: string;
  className?: string;
}

export default function RouteMap({
  arcos,
  marcadores,
  enquadrar = true,
  altura = 'h-[520px]',
  className = '',
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [arrastando, setArrastando] = useState(false);
  const arrasto = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const caminhos = useMemo(() => {
    return arcos.flatMap((arco) => {
      const a = airportByIata.get(arco.de);
      const b = airportByIata.get(arco.para);
      if (!a || !b) return [];

      // Aproximação barata só para escolher a resolução do arco.
      const km = Math.hypot(a.lat - b.lat, (a.lon - b.lon) * 0.85) * 111;

      return [
        {
          chave: `${arco.de}-${arco.para}-${arco.cor}`,
          d: greatCirclePath(a.lat, a.lon, b.lat, b.lon, segmentosPara(km)),
          cor: arco.cor,
          destaque: arco.destaque ?? false,
        },
      ];
    });
  }, [arcos]);

  const pontos = useMemo(() => {
    return marcadores.flatMap((m) => {
      const a = airportByIata.get(m.iata);
      if (!a) return [];
      const p = project(a.lat, a.lon);
      return [{ ...m, ...p, cidade: a.cidade }];
    });
  }, [marcadores]);

  const base: BoundingBox | null = useMemo(() => {
    if (!enquadrar) return null;
    return boundsOf(pontos.map(({ x, y }) => ({ x, y })));
  }, [enquadrar, pontos]);

  const viewBox = useMemo(() => {
    const caixa = base ?? {
      minX: 0,
      minY: 0,
      maxX: MAP_WIDTH,
      maxY: MAP_HEIGHT,
    };

    const largura = (caixa.maxX - caixa.minX) / zoom;
    const altura = (caixa.maxY - caixa.minY) / zoom;
    const cx = (caixa.minX + caixa.maxX) / 2 + pan.x;
    const cy = (caixa.minY + caixa.maxY) / 2 + pan.y;

    return toViewBox({
      minX: cx - largura / 2,
      minY: cy - altura / 2,
      maxX: cx + largura / 2,
      maxY: cy + altura / 2,
    });
  }, [base, zoom, pan]);

  // Escala do viewBox → pixels, para o arrasto acompanhar o cursor.
  const escala = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return 1;
    const [, , largura] = viewBox.split(' ').map(Number);
    return largura / svg.clientWidth;
  }, [viewBox]);

  const aoPressionar = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    arrasto.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    setArrastando(true);
  };

  const aoMover = (e: React.PointerEvent<SVGSVGElement>) => {
    const inicio = arrasto.current;
    if (!inicio) return;

    const k = escala();
    setPan({
      x: inicio.panX - (e.clientX - inicio.x) * k,
      y: inicio.panY - (e.clientY - inicio.y) * k,
    });
  };

  const aoSoltar = () => {
    arrasto.current = null;
    setArrastando(false);
  };

  const aplicarZoom = (fator: number) => {
    setZoom((z) => Math.min(12, Math.max(1, z * fator)));
  };

  const reenquadrar = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 ${altura} ${className}`}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="h-full w-full touch-none select-none"
        style={{ cursor: arrastando ? 'grabbing' : 'grab' }}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onWheel={(e) => aplicarZoom(e.deltaY < 0 ? 1.15 : 1 / 1.15)}
      >
        <path d={AMERICAS_LAND_PATH} fill="#18181b" stroke="#3f3f46" strokeWidth={0.6} />

        <g fill="none" strokeLinecap="round">
          {caminhos.map((c) => (
            <path
              key={c.chave}
              d={c.d}
              stroke={c.cor}
              strokeWidth={c.destaque ? 2.6 : 1.1}
              opacity={c.destaque ? 0.95 : 0.42}
            />
          ))}
        </g>

        <g>
          {pontos.map((p) => {
            const estilo = ESTILO_MARCADOR[p.tipo];
            return (
              <g key={`${p.iata}-${p.tipo}`}>
                <circle cx={p.x} cy={p.y} r={estilo.raio + 2} fill={estilo.anel} opacity={0.85} />
                <circle cx={p.x} cy={p.y} r={estilo.raio} fill={estilo.cor} />
                {p.tipo !== 'ponto' && (
                  <text
                    x={p.x + estilo.raio + 5}
                    y={p.y + 4}
                    fill="#e4e4e7"
                    fontSize={13}
                    fontWeight={600}
                    paintOrder="stroke"
                    stroke="#09090b"
                    strokeWidth={3.5}
                  >
                    {p.rotulo ?? p.iata}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => aplicarZoom(1.4)}
          className="h-8 w-8 rounded-lg border border-zinc-700 bg-zinc-900/90 text-lg leading-none text-zinc-200 hover:border-zinc-500"
          aria-label="Aproximar"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => aplicarZoom(1 / 1.4)}
          className="h-8 w-8 rounded-lg border border-zinc-700 bg-zinc-900/90 text-lg leading-none text-zinc-200 hover:border-zinc-500"
          aria-label="Afastar"
        >
          −
        </button>
        <button
          type="button"
          onClick={reenquadrar}
          className="h-8 w-8 rounded-lg border border-zinc-700 bg-zinc-900/90 text-xs leading-none text-zinc-200 hover:border-zinc-500"
          aria-label="Reenquadrar"
        >
          ⤢
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-3 text-[11px] text-zinc-600">
        Arraste para mover • role para aproximar
      </div>
    </div>
  );
}
