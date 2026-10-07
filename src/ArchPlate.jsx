/**
 * Procedural black-and-white architecture plates, drawn in the spirit of the
 * "Architecture Imagery" and "Mood and Abstract Imagery" pages of the brand guidelines.
 * They stand in for photography until real renders are supplied: pass `src` to
 * <ArchPlate> and it renders the image instead.
 */
import { useId } from 'react';

const Grain = ({ id, opacity = 0.22 }) => (
  <>
    <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer><feFuncA type="linear" slope={opacity} /></feComponentTransfer>
    </filter>
  </>
);

function Curve({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-ceil`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#141414" /><stop offset="1" stopColor="#2c2c2c" />
        </linearGradient>
        <linearGradient id={`${id}-conc`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f2f2" /><stop offset="0.6" stopColor="#d4d4d4" /><stop offset="1" stopColor="#9a9a9a" />
        </linearGradient>
        <Grain id={id} />
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-ceil)`} />
      {[60, 150, 250, 350, 460].map((y, i) => (
        <line key={i} x1="-20" y1={y} x2="420" y2={y - 140} stroke="#000" strokeOpacity="0.45" strokeWidth="1.2" />
      ))}
      <path d="M430 -10 C 250 30, 190 170, 215 300 C 235 400, 330 470, 430 520 Z" fill={`url(#${id}-conc)`} />
      <path d="M215 300 C 235 400, 330 470, 430 520" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="10" />
      {[[270, 120], [330, 90], [300, 210], [360, 180], [285, 320], [350, 290], [330, 400], [390, 380]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="#555" />
      ))}
      <line x1="250" y1="160" x2="430" y2="240" stroke="#8a8a8a" strokeWidth="0.8" />
      <rect width="400" height="500" filter={`url(#${id}-grain)`} />
    </>
  );
}

function Arches({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fafafa" /><stop offset="1" stopColor="#d0d0d0" />
        </linearGradient>
        <Grain id={id} opacity={0.28} />
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-sky)`} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const r = 420 - i * 62;
        const shade = 40 + i * 22;
        return (
          <path key={i}
            d={`M ${-60 + i * 8} 520 A ${r} ${r} 0 0 1 ${-60 + i * 8 + r * 1.4} ${520 - r * 0.2}`}
            fill="none" stroke={`rgb(${shade},${shade},${shade})`} strokeWidth={46 - i * 5} />
        );
      })}
      <rect width="400" height="500" filter={`url(#${id}-grain)`} />
    </>
  );
}

function Fins({ id }) {
  const fins = Array.from({ length: 14 }, (_, i) => i);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1a1a" /><stop offset="1" stopColor="#060606" />
        </linearGradient>
        <Grain id={id} />
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-bg)`} />
      {fins.map((i) => {
        const x = i * 30 - 10;
        const light = 120 + ((i * 37) % 90);
        return (
          <g key={i}>
            <polygon points={`${x},0 ${x + 10},0 ${x + 18},500 ${x + 6},500`} fill={`rgb(${light},${light},${light})`} />
            <polygon points={`${x + 10},0 ${x + 16},0 ${x + 26},500 ${x + 18},500`} fill="#000" fillOpacity="0.55" />
          </g>
        );
      })}
      <rect x="0" y="360" width="400" height="140" fill="#000" fillOpacity="0.55" />
      <rect width="400" height="500" filter={`url(#${id}-grain)`} />
    </>
  );
}

function Horizon({ id }) {
  return (
    <>
      <defs>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="38 3" />
        </filter>
        <Grain id={id} opacity={0.3} />
      </defs>
      <rect width="400" height="500" fill="#0c0c0c" />
      <g filter={`url(#${id}-blur)`}>
        <rect x="-40" y="40" width="480" height="120" fill="#e9e9e9" />
        <rect x="-40" y="150" width="300" height="24" fill="#bdbdbd" />
        <rect x="120" y="172" width="360" height="18" fill="#7a7a7a" />
        <rect x="-40" y="205" width="480" height="6" fill="#d8d8d8" />
        <rect x="-40" y="230" width="220" height="40" fill="#3a3a3a" />
        <rect x="200" y="300" width="260" height="30" fill="#2a2a2a" />
      </g>
      <rect x="0" y="206" width="400" height="1.5" fill="#fff" fillOpacity="0.7" />
      <rect width="400" height="500" filter={`url(#${id}-grain)`} />
    </>
  );
}

function Water({ id }) {
  const lines = Array.from({ length: 34 }, (_, i) => i);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcdcdc" /><stop offset="0.45" stopColor="#8c8c8c" /><stop offset="1" stopColor="#161616" />
        </linearGradient>
        <Grain id={id} opacity={0.26} />
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-w)`} />
      {lines.map((i) => {
        const y = 150 + i * 10 + i * i * 0.18;
        const amp = 2 + i * 0.35;
        return (
          <path key={i}
            d={`M -10 ${y} Q 50 ${y - amp} 110 ${y} T 230 ${y} T 350 ${y} T 470 ${y}`}
            fill="none" stroke={i % 3 === 0 ? '#ffffff' : '#000000'} strokeOpacity={i % 3 === 0 ? 0.35 : 0.18} strokeWidth={0.6 + i * 0.05} />
        );
      })}
      <rect x="0" y="0" width="400" height="120" fill="#f5f5f5" fillOpacity="0.55" />
      <rect x="0" y="118" width="400" height="3" fill="#2a2a2a" />
      <rect width="400" height="500" filter={`url(#${id}-grain)`} />
    </>
  );
}

function Stair({ id }) {
  const steps = Array.from({ length: 9 }, (_, i) => i);
  return (
    <>
      <defs><Grain id={id} /></defs>
      <rect width="400" height="500" fill="#e6e6e6" />
      {steps.map((i) => (
        <g key={i}>
          <polygon points={`0,${120 + i * 44} ${400 - i * 20},${60 + i * 44} ${400 - i * 20},${80 + i * 44} 0,${140 + i * 44}`} fill="#2b2b2b" />
          <polygon points={`0,${140 + i * 44} ${400 - i * 20},${80 + i * 44} ${400 - i * 20},${104 + i * 44} 0,${164 + i * 44}`} fill="#bdbdbd" />
        </g>
      ))}
      <polygon points="0,0 240,0 0,300" fill="#000" fillOpacity="0.55" />
      <rect width="400" height="500" filter={`url(#${id}-grain)`} />
    </>
  );
}

function Tiles({ id }) {
  return (
    <>
      <defs>
        <pattern id={`${id}-tile`} width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <rect width="46" height="46" fill="#cfcfcf" />
          <path d="M0 0H46V46" fill="none" stroke="#8a8a8a" strokeWidth="1" />
        </pattern>
        <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18" /></filter>
        <Grain id={id} opacity={0.3} />
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-tile)`} />
      <g filter={`url(#${id}-soft)`} fill="#050505" fillOpacity="0.88">
        <path d="M-40 60 C 120 20, 260 140, 460 60 L 460 150 C 260 230, 120 110, -40 160 Z" />
        <path d="M-40 290 C 140 240, 250 380, 460 300 L 460 400 C 250 470, 140 350, -40 400 Z" />
      </g>
      <g transform="translate(250 170) rotate(-28)">
        <ellipse cx="0" cy="22" rx="16" ry="6" fill="#000" fillOpacity="0.5" />
        <rect x="-5" y="-18" width="10" height="34" rx="4" fill="#111" />
        <circle cx="0" cy="-24" r="6" fill="#111" />
      </g>
      <rect width="400" height="500" filter={`url(#${id}-grain)`} />
    </>
  );
}

const VARIANTS = { curve: Curve, arches: Arches, fins: Fins, horizon: Horizon, water: Water, stair: Stair, tiles: Tiles };

export default function ArchPlate({ variant = 'curve', src, alt = '', className = '' }) {
  const id = `p${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  if (src) return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  const Art = VARIANTS[variant] || Curve;
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={`block h-full w-full ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      <Art id={id} />
    </svg>
  );
}
