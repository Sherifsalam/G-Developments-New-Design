/**
 * "Where we build": a scroll-driven map scene on the homepage.
 *
 *   1. Unfold   a crumpled paper map opens, facet by facet, into a flat world map (scroll 2–40%)
 *   2. Lens     a magnifying glass slides in and settles over Egypt; inside it you see the map
 *               magnified, with the destinations pinned (scroll 45–65%). Drag it to look around.
 *   3. Zoom     pick a destination (pin or chip): the lens grows to fill the stage while the view
 *               flies into that area, with coastline, the Nile, towns and a project card.
 *
 * Everything shares one Mercator plane (src/map/geo.json, built by scripts/build-map.mjs), so the
 * flat paper, the lens and the close-up are the same map at different viewBoxes. Per-frame work
 * (tile transforms, lens clip, viewBox, pin positions) is written straight to the DOM in
 * `recompute()` rather than through React state.
 */
import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { animate, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  EGYPT, LAND, MAP_H as MH, MAP_W as MW, PAPER, fromMap, geo, toMap,
} from './map/project.js';
import {
  MAP_ANCHOR, MAP_AREAS, MAP_DELTA, MAP_LENS, MAP_NILE, MAP_PLACES, MAP_POINTS, MAP_SUEZ, MAP_TROPIC, PROJECTS,
} from './content.js';
import { projectImages } from './media.js';
import {
  BTN_LIGHT, Caption, Link, cx, priceLabel, projectPath, useLang,
} from './GDevelopments.jsx';

/* ───────── geometry ───────── */

const FLY = [0.65, 0, 0.35, 1];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);

const f3 = (n) => n.toFixed(3);
function smoothPath(points) {
  const p = points.map(toMap);
  let d = `M${f3(p[0][0])} ${f3(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i += 1) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    d += `C${f3(p1[0] + (p2[0] - p0[0]) / 6)} ${f3(p1[1] + (p2[1] - p0[1]) / 6)} ${f3(p2[0] - (p3[0] - p1[0]) / 6)} ${f3(p2[1] - (p3[1] - p1[1]) / 6)} ${f3(p2[0])} ${f3(p2[1])}`;
  }
  return d;
}
const NILE_D = MAP_NILE.map(smoothPath).join('');
const ANCHOR = toMap(MAP_ANCHOR);
const PROJECT_XY = Object.fromEntries(Object.entries(MAP_POINTS).map(([id, v]) => [id, toMap(v.at)]));
const AREA_XY = Object.fromEntries(MAP_AREAS.map((a) => {
  const pts = a.projects.map((id) => PROJECT_XY[id]);
  return [a.id, [pts.reduce((s, q) => s + q[0], 0) / pts.length, pts.reduce((s, q) => s + q[1], 0) / pts.length]];
}));
const PLACE_XY = MAP_PLACES.map((pl) => toMap(pl.at));

// Egypt detail, drawn into the shared map but only legible through the lens.
const LAKE_D = smoothPath(MAP_NILE[0].slice(0, 4)); // Lake Nasser: the Nile up to the High Dam, drawn wide
const SUEZ_D = smoothPath(MAP_SUEZ);
const DELTA_D = `M${MAP_DELTA.map((pt) => toMap(pt).map(f3).join(' ')).join('L')}Z`;
const TROPIC_Y = toMap([MAP_TROPIC, 0])[1];
const REGION_GRID = (() => {
  // 1° grid over Egypt's part of the map (the world map keeps its 15° graticule).
  let d = '';
  for (let lat = 21; lat <= 33; lat += 1) {
    const [x0, y] = toMap([lat, 23]);
    d += `M${f3(x0)} ${f3(y)}H${f3(toMap([lat, 38])[0])}`;
  }
  for (let lon = 23; lon <= 38; lon += 1) {
    const [x, y0] = toMap([33, lon]);
    d += `M${f3(x)} ${f3(y0)}V${f3(toMap([21, lon])[1])}`;
  }
  return d;
})();
const LENS_ITEMS = [
  ...MAP_LENS.labels,
  ...MAP_LENS.cities.map((c) => ({ ...c, kind: 'city' })),
];
const LENS_XY = LENS_ITEMS.map((it) => toMap(it.at));
/**
 * Map units across the lens. Egypt spans ~34 units (24.7°E–36.9°E), so this makes the country
 * reach both edges of the glass. Everything that is not Egypt is hidden while the lens is settled
 * (see `restRef`), leaving a clean cut-out of the country on blank paper.
 */
const LENS_SPAN = 34;
const km = (lat) => (40075 * Math.cos((lat * Math.PI) / 180)) / MW; // km per map unit
const formatLatLon = ([lat, lon]) => `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}  ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;

function layout(w, h) {
  const mobile = w < 768;
  const top = mobile ? 150 : 176;
  const bottom = mobile ? 132 : 120;
  const pw = Math.max(200, Math.min(w - (mobile ? 24 : 120), (h - top - bottom) * (MW / MH)));
  const ph = (pw * MH) / MW;
  const r = mobile ? Math.min(124, w * 0.32) : clamp(h * 0.25, 150, 235);
  return {
    mobile, pw, ph, r,
    pl: (w - pw) / 2,
    pt: top + (h - top - bottom - ph) / 2,
    ps: pw / MW,
    lensS: (2 * r) / LENS_SPAN, // pixels per map unit inside the lens
  };
}

/** Crumple parameters per facet, seeded so the ball looks the same every visit. */
function makeGrid(mobile) {
  const cols = mobile ? 5 : 8;
  const rows = mobile ? 3 : 5;
  let s = 20260930;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
  const out = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const dx = (c + 0.5) / cols - 0.5;
      const dy = (r + 0.5) / rows - 0.5;
      out.push({
        c, r, cols, rows,
        rx: (rnd() - 0.5) * 120, ry: (rnd() - 0.5) * 120, rz: (rnd() - 0.5) * 90, tz: (rnd() - 0.4) * 140,
        shade: 0.08 + rnd() * 0.3,
        delay: Math.hypot(dx, dy) / Math.hypot(0.5, 0.5) * 0.4 + rnd() * 0.05,
      });
    }
  }
  return { cols, rows, tiles: out };
}

/** Map view: world point (X, Y) at the stage centre, `s` pixels per map unit. */
const mixView = (a, b, t) => ({
  X: lerp(a.X, b.X, t),
  Y: lerp(a.Y, b.Y, t),
  s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), t)),
});

/** Egypt's bounding box (Salum in the west to the Halayeb corner, Lake Nasser to the Med). */
const EGYPT_BOX = { west: 24.6, east: 37.0, south: 21.8, north: 31.8 };

/**
 * The whole country fitted to the stage, kept clear of the heading above and the
 * destination chips below. This is what the magnifier opens out into.
 */
function countryView(w, h, mobile) {
  const [x0, y0] = toMap([EGYPT_BOX.north, EGYPT_BOX.west]);
  const [x1, y1] = toMap([EGYPT_BOX.south, EGYPT_BOX.east]);
  // The section heading has faded out by now, so only the site header needs clearing at the top,
  // and the chips at the bottom are translucent pills the map can run under.
  const top = mobile ? 76 : 80;
  const bottom = mobile ? 84 : 72;
  const sw = w - (mobile ? 20 : 48);
  const sh = h - top - bottom;
  const sc = Math.min(sw / (x1 - x0), sh / (y1 - y0)) * 0.98;
  return {
    X: (x0 + x1) / 2,
    Y: (y0 + y1) / 2 - (top + sh / 2 - h / 2) / sc,
    s: sc,
  };
}

/** Close-up view: the whole area on desktop; on phones, the chosen project and its surroundings. */
function areaView(area, w, h, mobile, point) {
  let [x0, y0] = toMap([area.view.north, area.view.west]);
  let [x1, y1] = toMap([area.view.south, area.view.east]);
  if (mobile && point) [x0, y0, x1, y1] = [point[0] - 1.1, point[1] - 0.55, point[0] + 1.1, point[1] + 0.55];
  // Keep the pins clear of the project card (right on desktop, bottom sheet on phones).
  const safe = mobile ? { x: 16, y: 80, w: w - 32, h: h * 0.52 - 80 } : { x: 0, y: 90, w: w - 440, h: h - 90 };
  const s = Math.min(safe.w / (x1 - x0), safe.h / (y1 - y0)) * 0.92;
  return {
    X: (x0 + x1) / 2 - (safe.x + safe.w / 2 - w / 2) / s,
    Y: (y0 + y1) / 2 - (safe.y + safe.h / 2 - h / 2) / s,
    s,
  };
}

/* ───────── paper art (rasterised once per layout) ───────── */

const CRINKLE_FILTER = `
  <filter id="crinkle" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.013 0.016" numOctaves="5" seed="11"/>
    <feDiffuseLighting surfaceScale="3.2" lighting-color="#fff"><feDistantLight azimuth="235" elevation="55"/></feDiffuseLighting>
    <feComponentTransfer>
      <feFuncR type="linear" slope="1.15" intercept="-0.39"/><feFuncG type="linear" slope="1.15" intercept="-0.39"/><feFuncB type="linear" slope="1.15" intercept="-0.39"/>
    </feComponentTransfer>
  </filter>`;

function creases(grid) {
  let out = `<defs>
    <linearGradient id="cv" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.45" stop-color="#000" stop-opacity="0.16"/><stop offset="0.55" stop-color="#fff" stop-opacity="0.45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="ch" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.45" stop-color="#000" stop-opacity="0.14"/><stop offset="0.55" stop-color="#fff" stop-opacity="0.4"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
  for (let c = 1; c < grid.cols; c += 1) out += `<rect x="${(MW * c) / grid.cols - 2}" y="0" width="4" height="${MH}" fill="url(#cv)"/>`;
  for (let r = 1; r < grid.rows; r += 1) out += `<rect x="0" y="${(MH * r) / grid.rows - 2}" width="${MW}" height="4" fill="url(#ch)"/>`;
  return out;
}

function mapLayers({ stroke }) {
  const [bx, by, bw, bh] = geo.region.box;
  return `
    <mask id="outside" maskUnits="userSpaceOnUse" x="-10" y="-10" width="${MW + 20}" height="${MH + 20}">
      <rect x="-10" y="-10" width="${MW + 20}" height="${MH + 20}" fill="#fff"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#000"/>
    </mask>
    <path d="${geo.world.graticule}" fill="none" stroke="#000" stroke-opacity="0.13" stroke-width="${stroke * 0.7}"/>
    <g mask="url(#outside)"><path d="${geo.world.land}" fill="${LAND}"/><path d="${geo.world.borders}" fill="none" stroke="${PAPER}" stroke-opacity="0.55" stroke-width="${stroke * 0.6}"/></g>
    <path d="${geo.region.land}" fill="${LAND}"/>
    <path d="${geo.region.egypt}" fill="${EGYPT}"/>
    <path d="${geo.region.borders}" fill="none" stroke="${PAPER}" stroke-opacity="0.55" stroke-width="${stroke * 0.6}"/>
    <path d="${NILE_D}" fill="none" stroke="${PAPER}" stroke-opacity="0.8" stroke-width="${stroke * 0.8}" stroke-linecap="round"/>`;
}

function paperArt(grid) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MW} ${MH}" width="${MW}" height="${MH}">
    <defs>${CRINKLE_FILTER}</defs>
    <rect width="${MW}" height="${MH}" fill="${PAPER}"/>
    ${mapLayers({ stroke: 1 })}
    <rect x="10" y="10" width="${MW - 20}" height="${MH - 20}" fill="none" stroke="#000" stroke-opacity="0.5" stroke-width="0.8"/>
    <rect x="14" y="14" width="${MW - 28}" height="${MH - 28}" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="0.4"/>
    <text x="28" y="${MH - 28}" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="3" fill="#000">G DEVELOPMENTS</text>
    <text x="28" y="${MH - 16}" font-family="Helvetica, Arial, sans-serif" font-size="6.5" letter-spacing="2.4" fill="#000" fill-opacity="0.6">WHERE WE BUILD · EST. 2006</text>
    <g transform="translate(${MW - 50} ${MH - 50})" fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="0.7">
      <circle r="18"/><circle r="13" stroke-opacity="0.3"/><path d="M0 -24 L4 0 L0 24 L-4 0 Z M-24 0 L0 4 L24 0 L0 -4 Z" fill="#000" fill-opacity="0.08"/>
      <text y="-27" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="7" stroke="none" fill="#000">N</text>
    </g>
    <rect width="${MW}" height="${MH}" filter="url(#crinkle)" style="mix-blend-mode:soft-light"/>
    ${creases(grid)}
  </svg>`;
}

function textureArt(grid) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MW} ${MH}" width="${MW}" height="${MH}">
    <defs>${CRINKLE_FILTER}</defs><rect width="${MW}" height="${MH}" filter="url(#crinkle)"/>${creases(grid)}</svg>`;
}

async function rasterize(svg, width) {
  const src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = Math.round((width * MH) / MW);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.9));
    if (!blob) throw new Error('toBlob');
    URL.revokeObjectURL(src);
    return URL.createObjectURL(blob);
  } catch {
    return src; // fall back to the SVG itself
  }
}

/* ───────── magnifier ───────── */

function Glass() {
  return (
    <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="mj-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9a9a9a" /><stop offset="0.35" stopColor="#1c1c1c" /><stop offset="0.6" stopColor="#5a5a5a" /><stop offset="1" stopColor="#0d0d0d" />
        </linearGradient>
        <linearGradient id="mj-handle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3a" /><stop offset="0.5" stopColor="#0e0e0e" /><stop offset="1" stopColor="#262626" />
        </linearGradient>
        <radialGradient id="mj-vignette" r="0.5">
          <stop offset="0.72" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </radialGradient>
        <linearGradient id="mj-glare" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" /><stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="rotate(45)">
        <rect x="96" y="-13" width="26" height="26" rx="3" fill="url(#mj-rim)" />
        <rect x="118" y="-11" width="96" height="22" rx="11" fill="url(#mj-handle)" />
        <rect x="124" y="-7" width="84" height="3" rx="1.5" fill="#fff" fillOpacity="0.12" />
      </g>
      <circle r="95" fill="url(#mj-vignette)" />
      {/* reading scale etched on the inside of the rim */}
      <g stroke="#fff" strokeLinecap="round">
        {Array.from({ length: 72 }, (_, i) => {
          const major = i % 6 === 0;
          const a = (i * 5 * Math.PI) / 180;
          const r0 = major ? 83 : 87;
          return (
            <line
              key={i}
              x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * 90} y2={Math.sin(a) * 90}
              strokeOpacity={major ? 0.5 : 0.25} strokeWidth={major ? 0.9 : 0.5}
            />
          );
        })}
      </g>
      <path d="M-70 -30 A76 76 0 0 1 -28 -72" fill="none" stroke="url(#mj-glare)" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="-38" cy="-44" rx="34" ry="16" transform="rotate(-38 -38 -44)" fill="#fff" fillOpacity="0.045" />
      <circle r="96" fill="none" stroke="url(#mj-rim)" strokeWidth="9" />
      <circle r="91" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="0.8" />
      <circle r="100.5" fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="1" />
    </svg>
  );
}

/* ───────── component ───────── */

export default function MapJourney({ openConcierge }) {
  const { t, L, lang } = useLang();
  const m = t.map;
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const paperRef = useRef(null);
  const shadowRef = useRef(null);
  const tileRefs = useRef([]);
  const shadeRefs = useRef([]);
  const clipRef = useRef(null);
  const svgRef = useRef(null);
  const glassRef = useRef(null);
  const detailRef = useRef(null);
  const restRef = useRef(null);
  const headingRef = useRef(null);
  const hintRef = useRef(null);
  const areaPinRefs = useRef({});
  const projectPinRefs = useRef({});
  const placeRefs = useRef([]);
  const lensRefs = useRef([]);
  const readoutRef = useRef(null);
  const coordsRef = useRef(null);
  const scaleRef = useRef(null);
  const scaleLabelRef = useRef(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [reduced] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const [focus, setFocus] = useState(null);
  const [selected, setSelected] = useState(null);
  const [art, setArt] = useState({ paper: null, texture: null });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const zoom = useMotionValue(0);
  const travel = useMotionValue(0);
  const drag = useRef({ x: 0, y: 0 });
  const focusRef = useRef(null);
  const focusProject = useRef(null);
  const baseView = useRef('lens');
  const currentView = useRef(null);
  const backToken = useRef(0);
  const leaving = useRef(false);

  const lay = useMemo(() => layout(size.w, size.h), [size]);
  const grid = useMemo(() => makeGrid(lay.mobile), [lay.mobile]);
  const live = useRef({ lay, size, grid, reduced });

  /* ── per-frame DOM update ── */
  const recompute = useCallback(() => {
    const { lay: ly, size: { w, h }, grid: gr, reduced: rm } = live.current;
    if (!w || !paperRef.current || !svgRef.current) return;
    const focused = !!focusRef.current;
    const p = scrollYProgress.get();
    const unfold = focused || rm ? 1 : clamp01((p - 0.02) / 0.38);
    const lensIn = focused || rm ? 1 : easeInOut(clamp01((p - 0.45) / 0.15));
    // Past the settled glass, the lens opens out until the whole country fills the stage.
    const openE = focused || rm ? 1 : easeInOut(clamp01((p - 0.66) / 0.18));
    const z = zoom.get();

    // 1. paper: crumpled ball → flat sheet, facets open from the centre outwards
    const u = easeOut(unfold);
    const sc = lerp(0.5, 1, u); // scale3d: a 2D scale would leave the facets' depth full-size and warp them
    paperRef.current.style.transform = `translate3d(0, ${lerp(30, 0, u)}px, 0) scale3d(${sc}, ${sc}, ${sc}) rotate(${lerp(-16, 0, u)}deg)`;
    // Once the glass is over Egypt the surrounding paper map fades out, so the magnified
    // country is all that is left on screen.
    const paperOut = 1 - easeInOut(clamp01((lensIn - 0.55) / 0.45));
    paperRef.current.style.opacity = String(paperOut);
    shadowRef.current.style.opacity = String(lerp(0.2, 1, u) * (1 - z) * paperOut);
    gr.tiles.forEach((g, i) => {
      const el = tileRefs.current[i];
      if (!el) return;
      const k = 1 - easeOut(clamp01((unfold - g.delay) / 0.55));
      const tx = (0.5 - (g.c + 0.5) / g.cols) * ly.pw * 0.8 * k;
      const ty = (0.5 - (g.r + 0.5) / g.rows) * ly.ph * 0.8 * k;
      el.style.transform = k < 0.001 ? 'none' : `translate3d(${tx}px, ${ty}px, ${g.tz * k}px) rotateX(${g.rx * k}deg) rotateY(${g.ry * k}deg) rotateZ(${g.rz * k}deg)`;
      shadeRefs.current[i].style.opacity = String(k * g.shade);
    });

    // 2. lens: slides in from the bottom corner and settles over Egypt (plus any drag)
    const ax = ly.pl + ANCHOR[0] * ly.ps;
    const ay = ly.pt + ANCHOR[1] * ly.ps;
    const dx = clamp(drag.current.x, ly.pl - ax, ly.pl + ly.pw - ax);
    const dy = clamp(drag.current.y, ly.pt - ay, ly.pt + ly.ph - ay);
    drag.current = { x: dx, y: dy };
    const cx = lerp(w + ly.r * 1.6, ax + dx, lensIn);
    const cy = lerp(h + ly.r * 1.3, ay + dy, lensIn);
    const s = ly.lensS;
    const lensView = { X: (cx - ly.pl) / ly.ps + (w / 2 - cx) / s, Y: (cy - ly.pt) / ly.ps + (h / 2 - cy) / s, s };

    // 3. open: the glass grows into the full view of Egypt, then flies to a chosen area
    const stage = openE > 0.001 ? mixView(lensView, countryView(w, h, ly.mobile), openE) : lensView;
    const area = MAP_AREAS.find((a) => a.id === focusRef.current);
    const target = area ? areaView(area, w, h, ly.mobile, PROJECT_XY[focusProject.current]) : stage;
    const from = baseView.current === 'lens' ? stage : baseView.current;
    const view = mixView(from, target, travel.get());
    currentView.current = view;
    const vw = w / view.s;
    const vh = h / view.s;
    svgRef.current.setAttribute('viewBox', `${view.X - vw / 2} ${view.Y - vh / 2} ${vw} ${vh}`);
    const R = lerp(ly.r, Math.hypot(w, h) + 40, Math.max(openE, easeInOut(z)));
    clipRef.current.style.clipPath = `circle(${R}px at ${cx}px ${cy}px)`;
    clipRef.current.style.visibility = lensIn > 0.001 ? 'visible' : 'hidden';
    const g = glassRef.current;
    g.style.transform = `translate3d(${cx - ly.r}px, ${cy - ly.r}px, 0) rotate(${lerp(-50, 0, lensIn)}deg) scale(${1 + z * 0.6})`;
    g.style.opacity = String(lensIn > 0.001 ? clamp01(1 - z * 2.5) * clamp01(1 - openE * 1.6) : 0);
    g.style.pointerEvents = lensIn > 0.98 && openE < 0.05 && !focused ? 'auto' : 'none';

    // 4. pins and labels, placed in stage pixels
    const toScreen = ([X, Y]) => [(X - view.X) * view.s + w / 2, (Y - view.Y) * view.s + h / 2];
    const place = (el, pos, opacity) => {
      if (!el) return;
      el.style.transform = `translate3d(${pos[0]}px, ${pos[1]}px, 0)`;
      el.style.opacity = String(opacity);
      el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
      el.style.pointerEvents = opacity > 0.9 ? 'auto' : 'none';
    };
    const lensReady = lensIn > 0.98 ? 1 : 0;
    MAP_AREAS.forEach((a) => {
      const pos = toScreen(AREA_XY[a.id]);
      const inside = Math.hypot(pos[0] - cx, pos[1] - cy) < R - 14 ? 1 : 0;
      place(areaPinRefs.current[a.id], pos, lensReady * inside * clamp01(1 - z * 4));
    });
    const close = clamp01((z - 0.6) / 0.3);
    Object.entries(PROJECT_XY).forEach(([id, xy]) => place(projectPinRefs.current[id], toScreen(xy), close));
    PLACE_XY.forEach((xy, i) => place(placeRefs.current[i], toScreen(xy), close * 0.9));

    // 5. through the lens: Egypt's names (clipped to the glass with the map) and a live readout
    const detail = clamp01((lensIn - 0.9) / 0.1) * clamp01(1 - z * 4);
    detailRef.current.style.opacity = String(1 - clamp01(z * 1.5));
    // Only Egypt inside the glass; neighbours and the graticule return as the view flies in.
    const restIn = Math.max(1 - lensIn, clamp01((z - 0.12) / 0.3));
    restRef.current.style.opacity = String(restIn);
    LENS_XY.forEach((xy, i) => place(lensRefs.current[i], toScreen(xy), LENS_ITEMS[i].outside ? detail * restIn : detail));
    // hangs just under the rim, clear of the handle; gone once the glass opens out
    place(readoutRef.current, [cx, Math.min(cy + ly.r + 24, h - 110)], detail * clamp01(1 - openE * 1.6));

    // 6. the section heading gives way as the opened map takes the stage, and the hint
    //    follows the same scroll value the scene is drawn from
    headingRef.current.style.opacity = String(1 - openE);
    const hint = focused ? ''
      : p < 0.42 ? m.hintUnfold
        : p < 0.6 ? m.hintLens
          : p < 0.66 ? m.hintDrag
            : p < 0.86 ? m.hintOpen : m.hintReady;
    if (hintRef.current.textContent !== hint) hintRef.current.textContent = hint;
    if (detail > 0.01) {
      const at = fromMap([(cx - ly.pl) / ly.ps, (cy - ly.pt) / ly.ps]);
      const text = formatLatLon(at);
      if (coordsRef.current.textContent !== text) coordsRef.current.textContent = text;
      const bar = ly.mobile ? 100 : 200;
      scaleRef.current.style.width = `${(bar / km(at[0])) * s}px`;
      scaleLabelRef.current.textContent = `${bar} km`;
    }
  }, [m, scrollYProgress, zoom, travel]);

  /* ── navigation between lens and close-up ── */
  const goTo = useCallback((areaId, projectId) => {
    const area = MAP_AREAS.find((a) => a.id === areaId);
    if (!area) return;
    backToken.current += 1;
    leaving.current = false;
    const pid = projectId || area.projects[0];
    setSelected(pid);
    // Phones frame one project at a time, so switching project there is a short flight too.
    const same = focusRef.current === areaId && (!live.current.lay.mobile || focusProject.current === pid);
    focusProject.current = pid;
    if (same && zoom.get() > 0.99) return;
    const dur = reduced ? 0 : 1;
    if (focusRef.current && zoom.get() > 0.99) {
      baseView.current = currentView.current; // fly from here to the other area
      travel.set(0);
    } else {
      baseView.current = 'lens';
    }
    focusRef.current = areaId;
    setFocus(areaId);
    animate(zoom, 1, { duration: 1.5 * dur, ease: FLY });
    animate(travel, 1, { duration: 1.5 * dur, ease: FLY });
  }, [reduced, travel, zoom]);

  const back = useCallback(() => {
    if (!focusRef.current || leaving.current) return;
    leaving.current = true;
    const token = ++backToken.current;
    const dur = reduced ? 0 : 1;
    if (baseView.current !== 'lens') { baseView.current = 'lens'; } // travel=1 → view stays on the area
    animate(travel, 0, { duration: 1.2 * dur, ease: FLY });
    animate(zoom, 0, { duration: 1.2 * dur, ease: FLY }).then(() => {
      if (token !== backToken.current) return;
      leaving.current = false;
      focusRef.current = null;
      focusProject.current = null;
      setFocus(null);
      setSelected(null);
      recompute();
    });
  }, [reduced, recompute, travel, zoom]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (focusRef.current && v < 0.5) back();
    recompute();
  });
  useEffect(() => {
    const a = zoom.on('change', recompute);
    const b = travel.on('change', recompute);
    return () => { a(); b(); };
  }, [zoom, travel, recompute]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    live.current = { lay, size, grid, reduced };
    recompute();
  });

  // Paper art for the current facet grid and paper size.
  const artWidth = Math.round(Math.min(2800, Math.max(1200, lay.pw * Math.min(2, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1))));
  useEffect(() => {
    let alive = true;
    const made = [];
    Promise.all([rasterize(paperArt(grid), artWidth), rasterize(textureArt(grid), 1600)]).then(([paper, texture]) => {
      made.push(paper, texture);
      if (alive) setArt({ paper, texture });
      else made.forEach((u) => URL.revokeObjectURL(u));
    });
    return () => { alive = false; made.forEach((u) => URL.revokeObjectURL(u)); };
  }, [grid, artWidth]);

  /* ── drag the magnifier ── */
  const onGlassDown = (e) => {
    if (focusRef.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const start = { x: e.clientX, y: e.clientY, dx: drag.current.x, dy: drag.current.y };
    const move = (ev) => { drag.current = { x: start.dx + ev.clientX - start.x, y: start.dy + ev.clientY - start.y }; recompute(); };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  const area = MAP_AREAS.find((a) => a.id === focus);
  const project = PROJECTS.find((p) => p.id === selected);
  const tileW = lay.pw / grid.cols;
  const tileH = lay.ph / grid.rows;

  return (
    <section ref={sectionRef} aria-labelledby="map-title" className="relative bg-black" style={{ height: reduced ? '100svh' : '420vh' }}>
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_at_center,#1a1a1a_0%,#000_70%)]">
        {/* heading — steps aside as the opened lens fills the stage with pale paper */}
        <div ref={headingRef} className={cx('pointer-events-none absolute inset-x-0 top-0 z-50 px-4 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] transition-opacity duration-500 sm:px-6', focus && 'opacity-0')}>
          <div className="mx-auto max-w-[1320px]">
            <Caption>G Developments | {m.eyebrow}</Caption>
            <h2 id="map-title" className={cx('mt-3 font-display text-[clamp(1.55rem,2.65vw,2.34rem)] leading-[1]', lang === 'en' ? 'tracking-tightish' : 'leading-[1.25]')}>
              {m.title} <span className="text-g-50">{m.subtitle(PROJECTS.length)}</span>
            </h2>
          </div>
        </div>

        {/* 1. the paper */}
        <div className="absolute inset-0 [perspective:1600px]" aria-hidden="true">
          <div
            ref={shadowRef}
            className="absolute rounded-[4px] shadow-[0_40px_90px_-10px_rgba(0,0,0,0.9)]"
            style={{ left: lay.pl, top: lay.pt, width: lay.pw, height: lay.ph }}
          />
          <div
            ref={paperRef}
            className="absolute will-change-transform [transform-style:preserve-3d]"
            style={{ left: lay.pl, top: lay.pt, width: lay.pw, height: lay.ph }}
          >
            {grid.tiles.map((g, i) => (
              <div
                key={`${grid.cols}-${i}`}
                ref={(el) => { tileRefs.current[i] = el; }}
                className="absolute overflow-hidden will-change-transform"
                style={{
                  left: g.c * tileW, top: g.r * tileH, width: tileW + 0.6, height: tileH + 0.6,
                  backgroundColor: PAPER,
                  backgroundImage: art.paper ? `url(${art.paper})` : undefined,
                  backgroundSize: `${lay.pw}px ${lay.ph}px`,
                  backgroundPosition: `${-g.c * tileW}px ${-g.r * tileH}px`,
                }}
              >
                <div ref={(el) => { shadeRefs.current[i] = el; }} className="absolute inset-0 bg-black" style={{ opacity: 0 }} />
              </div>
            ))}
          </div>
        </div>

        {/* 2–3. what the lens sees (and, zoomed in, the whole stage) */}
        <div ref={clipRef} className="absolute inset-0 z-20" style={{ visibility: 'hidden' }} aria-hidden="true">
          <svg ref={svgRef} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox={`0 0 ${MW} ${MH}`}>
            <rect x={-MW} y={-MH} width={MW * 3} height={MH * 3} fill={PAPER} />
            <defs>
              <mask id="mj-outside" maskUnits="userSpaceOnUse" x={-10} y={-10} width={MW + 20} height={MH + 20}>
                <rect x={-10} y={-10} width={MW + 20} height={MH + 20} fill="#fff" />
                <rect x={geo.region.box[0]} y={geo.region.box[1]} width={geo.region.box[2]} height={geo.region.box[3]} fill="#000" />
              </mask>
            </defs>
            <defs>
              <clipPath id="mj-egypt"><path d={geo.region.egypt} /></clipPath>
            </defs>

            {/* Everything that is not Egypt. Hidden while the glass sits over the country, and
                faded back in as you fly into a destination, where the coastline is the context. */}
            <g ref={restRef}>
              <path d={geo.world.graticule} fill="none" stroke="#000" strokeOpacity="0.13" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
              <g mask="url(#mj-outside)">
                <path d={geo.world.land} fill={LAND} />
                <path d={geo.world.borders} fill="none" stroke={PAPER} strokeOpacity="0.55" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
              </g>
              <path d={geo.region.land} fill={LAND} />
              <path d={geo.region.borders} fill="none" stroke={PAPER} strokeOpacity="0.55" strokeWidth="0.9" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
              <path d={NILE_D} fill="none" stroke={PAPER} strokeOpacity="0.85" strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </g>

            {/* Egypt itself, always drawn */}
            <path d={geo.region.egypt} fill={EGYPT} />
            <g clipPath="url(#mj-egypt)">
              <path d={DELTA_D} fill="#fff" fillOpacity="0.09" />
              <path d={NILE_D} fill="none" stroke="#fff" strokeOpacity="0.09" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
              {/* map furniture that only reads at lens magnification */}
              <g ref={detailRef}>
                <path d={REGION_GRID} fill="none" stroke="#8c8c8c" strokeOpacity="0.3" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                <path d={`M0 ${f3(TROPIC_Y)}H${MW}`} fill="none" stroke="#9a9a9a" strokeOpacity="0.7" strokeWidth="0.8" strokeDasharray="7 5" vectorEffect="non-scaling-stroke" />
              </g>
              <path d={LAKE_D} fill="none" stroke={PAPER} strokeOpacity="0.85" strokeWidth="0.42" strokeLinecap="round" strokeLinejoin="round" />
              <path d={NILE_D} fill="none" stroke={PAPER} strokeOpacity="0.85" strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path d={SUEZ_D} fill="none" stroke={PAPER} strokeOpacity="0.75" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </g>
            {art.texture && (
              <image href={art.texture} x={0} y={0} width={MW} height={MH} preserveAspectRatio="none" style={{ mixBlendMode: 'soft-light' }} />
            )}
          </svg>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.18)_100%)]" />

          {/* names read through the lens (clipped to the glass along with the map) */}
          {LENS_ITEMS.map((it, i) => (lay.mobile && !it.phone ? null : (
            <div
              key={it.id}
              ref={(el) => { lensRefs.current[i] = el; }}
              className="pointer-events-none absolute left-0 top-0"
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              {it.kind === 'city' ? (
                <>
                  <span className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white ring-1 ring-black/70" />
                  <span className={cx(
                    'absolute top-0 -translate-y-1/2 whitespace-nowrap rounded-[4px] bg-black/75 px-1.5 py-0.5 text-[10px] leading-none text-white/90',
                    it.side === 'left' ? 'right-2' : 'left-2',
                  )}
                  >
                    {L(it.name)}
                  </span>
                </>
              ) : it.kind === 'country' ? (
                <span className={cx(
                  'absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-white/25',
                  lang === 'en' ? 'text-[clamp(0.95rem,1.75vw,1.47rem)] uppercase tracking-[0.55em]' : 'text-[clamp(1.35rem,1.95vw,1.7rem)]',
                )}
                >
                  {L(it.name)}
                </span>
              ) : (
                <span className={cx(
                  'absolute w-max max-w-[6.5rem] -translate-x-1/2 -translate-y-1/2 text-center text-[9.5px] italic leading-[1.25]',
                  lang === 'en' && 'uppercase tracking-[0.2em]',
                  it.kind === 'water' ? 'text-black/50' : 'text-white/55',
                )}
                >
                  {L(it.name)}
                </span>
              )}
            </div>
          )))}
        </div>

        {/* lens readout: where the glass is and its scale */}
        <div
          ref={readoutRef}
          className="pointer-events-none absolute left-0 top-0 z-30"
          style={{ opacity: 0, visibility: 'hidden' }}
          aria-hidden="true"
        >
          <div dir="ltr" className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-black/80 px-3 py-1.5 text-[10px] tabular-nums tracking-[0.12em] text-white/85 shadow-lg backdrop-blur-md">
            <span ref={coordsRef} />
            <span className="flex items-center gap-1.5 text-white/60">
              <span ref={scaleRef} className="h-1.5 border-x border-b border-white/80" />
              <span ref={scaleLabelRef} />
            </span>
          </div>
        </div>

        {/* magnifier body (drag to look around) */}
        <div
          ref={glassRef}
          onPointerDown={onGlassDown}
          className="absolute left-0 top-0 z-30 cursor-grab touch-none rounded-full [filter:drop-shadow(16px_24px_18px_rgba(0,0,0,0.45))] active:cursor-grabbing"
          style={{ width: lay.r * 2, height: lay.r * 2, opacity: 0 }}
          aria-hidden="true"
        >
          <Glass />
        </div>

        {/* area pins (inside the lens) */}
        {MAP_AREAS.map((a) => (
          <button
            key={a.id}
            ref={(el) => { areaPinRefs.current[a.id] = el; }}
            type="button"
            onClick={() => goTo(a.id)}
            aria-label={`${L(a.name)}, ${m.projects(a.projects.length)}`}
            className="group absolute left-0 top-0 z-40 -ml-3 -mt-3 flex h-6 w-6 items-center justify-center"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <span className="absolute h-6 w-6 animate-ping rounded-full bg-white/60" />
            <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-black" />
            <span className={cx(
              'absolute top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-black px-3 py-1.5 text-[12px] font-medium text-white shadow-lg transition group-hover:bg-white group-hover:text-black',
              // Cairo and Ain Sokhna sit one pin-width apart; on a phone Cairo's label goes the other way.
              (lay.mobile && a.id === 'cairo') || a.label === 'left' ? 'right-7' : 'left-7',
            )}
            >
              {L(a.name)} <span className="tabular-nums text-g-50 group-hover:text-g-75">{a.projects.length}</span>
            </span>
          </button>
        ))}

        {/* close-up: places and project pins */}
        {MAP_PLACES.map((pl, i) => (
          <div
            key={pl.id}
            ref={(el) => { placeRefs.current[i] = el; }}
            className="pointer-events-none absolute left-0 top-0 z-30"
            style={{ opacity: 0, visibility: 'hidden' }}
            aria-hidden="true"
          >
            {pl.kind === 'city' ? (
              <>
                <span className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full border border-black bg-white" />
                <span className="caption absolute left-2.5 top-1.5 whitespace-nowrap rounded-[4px] bg-black/70 px-1.5 py-0.5 text-[9.5px] text-white/85">{L(pl.name)}</span>
              </>
            ) : (
              <span className={cx('absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] italic tracking-[0.3em]', pl.tone === 'light' ? 'text-white/55' : 'text-black/45')}>{L(pl.name)}</span>
            )}
          </div>
        ))}
        {PROJECTS.filter((p) => PROJECT_XY[p.id]).map((p) => {
          const side = MAP_POINTS[p.id].label;
          const on = selected === p.id;
          const owner = MAP_AREAS.find((a) => a.projects.includes(p.id));
          return (
            <button
              key={p.id}
              ref={(el) => { projectPinRefs.current[p.id] = el; }}
              type="button"
              onClick={() => goTo(owner.id, p.id)}
              aria-pressed={on}
              aria-label={p.name}
              className="group absolute left-0 top-0 z-40 -ml-4 -mt-4 flex h-8 w-8 items-center justify-center"
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              {on && <span className="absolute h-8 w-8 animate-ping rounded-full bg-white/50 ring-1 ring-black/40" />}
              <span className={cx('relative rounded-full border-2 border-black bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.6)] transition-all', on ? 'h-5 w-5 border-[5px]' : 'h-3.5 w-3.5 group-hover:scale-125')} />
              <span
                dir="ltr"
                className={cx(
                  'latin-display absolute whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] tracking-tightish shadow-lg transition-colors',
                  on ? 'bg-black text-white' : 'bg-white text-black group-hover:bg-black group-hover:text-white',
                  side === 'left' && 'right-8 top-1/2 -translate-y-1/2',
                  side === 'right' && 'left-8 top-1/2 -translate-y-1/2',
                  side === 'top' && 'bottom-8 left-1/2 -translate-x-1/2',
                  side === 'bottom' && 'left-1/2 top-8 -translate-x-1/2',
                )}
              >
                {p.name}
              </span>
            </button>
          );
        })}

        {/* project card (close-up) */}
        {area && project && (
          <aside
            aria-live="polite"
            className={cx(
              'absolute z-50 flex flex-col overflow-y-auto border border-white/15 bg-black/85 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl',
              lay.mobile ? 'inset-x-3 bottom-3 max-h-[46%] rounded-[20px] p-4' : 'bottom-6 end-6 top-24 w-[400px] rounded-[24px] p-6',
            )}
            data-lenis-prevent
          >
            <button type="button" onClick={back} className="caption inline-flex items-center gap-2 self-start text-g-25 transition hover:text-white">
              <ArrowLeft size={14} className="rtl:rotate-180" /> {m.back}
            </button>
            <p className="caption mt-4 text-g-50">{L(area.name)} · {m.projects(area.projects.length)}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {area.projects.map((id) => {
                const p = PROJECTS.find((x) => x.id === id);
                return (
                  <button
                    key={id} type="button" onClick={() => goTo(area.id, id)} aria-pressed={selected === id}
                    className={cx('rounded-full border px-3 py-1.5 text-[12px] font-medium transition', selected === id ? 'border-white bg-white text-black' : 'border-white/20 text-g-25 hover:border-white/50 hover:text-white')}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
            <div className={cx('relative mt-4 shrink-0 overflow-hidden rounded-[10px] bg-g-ink', lay.mobile ? 'hidden' : 'aspect-[4/3]')}>
              {projectImages(project.id).card
                ? <img src={projectImages(project.id).card} alt={project.name} className="h-full w-full object-cover" />
                : <div className="grid h-full place-items-center text-g-50"><span className="latin-display text-3xl">{project.name}</span></div>}
            </div>
            <h3 dir="ltr" className="latin-display mt-4 text-[clamp(1.38rem,2.04vw,1.87rem)] leading-none tracking-brand rtl:text-end">{project.name}</h3>
            <p className="mt-2 text-sm text-g-25">{L(project.loc)}</p>
            <p dir="ltr" className="mt-1 text-sm text-white rtl:text-end">{priceLabel(project, t)}</p>
            <ul className={cx('mt-4 space-y-1.5 text-sm text-g-25', lay.mobile && 'hidden')}>
              {project.highlights.slice(0, 3).map((hl) => <li key={hl.en} className="flex gap-2"><span className="text-g-50">—</span>{L(hl)}</li>)}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <Link to={projectPath(project)} className={cx(BTN_LIGHT, 'inline-flex items-center gap-2 px-5 py-3 text-[13px]')}>
                {m.discover} <ArrowRight size={15} className="rtl:rotate-180" />
              </Link>
              <button type="button" onClick={() => openConcierge?.({ intent: 'unit', project: project.id })} className="rounded-full border border-white/25 px-5 py-3 text-[13px] font-medium transition hover:bg-white hover:text-black">
                {m.inquire}
              </button>
            </div>
            <p className="mt-3 text-[11px] text-g-50">{m.approx}</p>
          </aside>
        )}

        {/* hint + destination chips */}
        <div className={cx('absolute inset-x-0 bottom-0 z-50 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] transition-opacity duration-500 sm:px-6 lg:pb-[calc(1rem+env(safe-area-inset-bottom,0px))]', focus && 'pointer-events-none opacity-0')}>
          <div className="mx-auto flex max-w-[1320px] flex-col gap-3">
            {/* a pill, so the hint stays readable over the black stage and over the opened map alike */}
            <p ref={hintRef} role="status" className="caption mx-auto w-fit rounded-full bg-black/60 px-4 py-1.5 text-center text-g-25 backdrop-blur-md" />
            <nav aria-label={m.choose} className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <ul className="mx-auto flex w-max gap-2">
                {MAP_AREAS.flatMap((a) => a.projects.map((id) => {
                  const p = PROJECTS.find((x) => x.id === id);
                  return (
                    <li key={id}>
                      <button
                        type="button" onClick={() => goTo(a.id, id)}
                        className="whitespace-nowrap rounded-full border border-white/20 bg-black/60 px-4 py-2 text-[13px] text-g-25 backdrop-blur-md transition hover:border-white hover:bg-white hover:text-black"
                      >
                        {p.name}
                      </button>
                    </li>
                  );
                }))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
