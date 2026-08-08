/**
 * Geometria do mapa de rotas.
 *
 * A projeção é Mercator recortada na janela das Américas. As constantes aqui
 * são as mesmas usadas para gerar lib/flights/land.ts — se alterar uma, o
 * contorno precisa ser regerado, senão o mapa e os aeroportos se descolam.
 */

export const LON_MIN = -172;
export const LON_MAX = -32;
export const LAT_MAX = 66;
export const LAT_MIN = -56;

export const MAP_WIDTH = 1000;

const rad = (deg: number) => (deg * Math.PI) / 180;

const mercY = (lat: number) =>
  Math.log(Math.tan(Math.PI / 4 + rad(Math.max(-85, Math.min(85, lat))) / 2));

const K = MAP_WIDTH / (rad(LON_MAX) - rad(LON_MIN));
const Y0 = mercY(LAT_MAX);

export const MAP_HEIGHT = (Y0 - mercY(LAT_MIN)) * K;

export interface Point {
  x: number;
  y: number;
}

/** Converte lat/lon em coordenadas do viewBox 0 0 MAP_WIDTH MAP_HEIGHT. */
export function project(lat: number, lon: number): Point {
  return {
    x: (rad(lon) - rad(LON_MIN)) * K,
    y: (Y0 - mercY(lat)) * K,
  };
}

const EARTH_RADIUS_KM = 6371;

/** Distância ortodrômica em quilômetros. */
export function distanceKm(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const dLat = rad(bLat - aLat);
  const dLon = rad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Estimativa de tempo de voo em minutos a partir da distância: velocidade de
 * cruzeiro média mais o tempo fixo de taxi/subida/descida. Não substitui o
 * horário real da companhia, serve para ordenar e comparar itinerários.
 */
export function flightMinutes(km: number): number {
  return Math.round(30 + (km / 820) * 60);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

/**
 * Caminho SVG da rota seguindo o círculo máximo (interpolação esférica), e não
 * a reta do Mercator. Em trechos longos a diferença é visível — GRU→LAX passa
 * bem mais ao norte do que a reta sugere.
 */
export function greatCirclePath(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
  segments = 48,
): string {
  const φ1 = rad(aLat);
  const λ1 = rad(aLon);
  const φ2 = rad(bLat);
  const λ2 = rad(bLon);

  const d =
    2 *
    Math.asin(
      Math.min(
        1,
        Math.sqrt(
          Math.sin((φ2 - φ1) / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
        ),
      ),
    );

  if (d < 1e-9) {
    const p = project(aLat, aLon);
    return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }

  const steps: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    const lat = (Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI;
    const lon = (Math.atan2(y, x) * 180) / Math.PI;
    const p = project(lat, lon);
    steps.push(`${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }

  return `M${steps.join('L')}`;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Caixa que envolve os pontos informados, com folga proporcional. */
export function boundsOf(points: Point[], padding = 0.18): BoundingBox | null {
  if (points.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const { x, y } of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  // Um único ponto (ou pontos colineares) não tem área: abre uma janela mínima
  // para não gerar um viewBox degenerado.
  const width = Math.max(maxX - minX, 120);
  const height = Math.max(maxY - minY, 120);
  const padX = width * padding;
  const padY = height * padding;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return {
    minX: cx - width / 2 - padX,
    minY: cy - height / 2 - padY,
    maxX: cx + width / 2 + padX,
    maxY: cy + height / 2 + padY,
  };
}

/** Serializa uma caixa como atributo viewBox, limitada ao mapa disponível. */
export function toViewBox(box: BoundingBox | null): string {
  if (!box) return `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;

  const width = box.maxX - box.minX;
  const height = box.maxY - box.minY;

  return `${box.minX.toFixed(1)} ${box.minY.toFixed(1)} ${width.toFixed(1)} ${height.toFixed(1)}`;
}
