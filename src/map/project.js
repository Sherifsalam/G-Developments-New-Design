/** Shared projection for everything drawn from src/map/geo.json (Web-Mercator, 1000 units = 360°). */
import geo from './geo.json';
import govData from './governorates.json';

export { geo };
export const GOVERNORATES = govData.governorates;
export const MAP_W = geo.width;
export const MAP_H = geo.height;
export const PAPER = '#efeeea';
export const LAND = '#3d3d3d';
export const EGYPT = '#0b0b0b';

/** [lat, lon] → map units. */
export function toMap([lat, lon]) {
  return [MAP_W / 2 + (geo.scale * lon * Math.PI) / 180, geo.y0 - geo.scale * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))];
}

/** Map units → [lat, lon]. */
export function fromMap([x, y]) {
  return [
    (2 * Math.atan(Math.exp((geo.y0 - y) / geo.scale)) - Math.PI / 2) * (180 / Math.PI),
    ((x - MAP_W / 2) / geo.scale) * (180 / Math.PI),
  ];
}

/** A lon/lat box → SVG viewBox string. */
export function viewBoxFor({ west, east, south, north }) {
  const [x0, y0] = toMap([north, west]);
  const [x1, y1] = toMap([south, east]);
  return `${x0} ${y0} ${x1 - x0} ${y1 - y0}`;
}
