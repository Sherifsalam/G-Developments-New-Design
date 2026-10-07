/**
 * /about/leadership: "Built on people".
 * The company drawn as one of its buildings: the chairman is the cornerstone, the board members
 * the columns, the executive team the floors (one per function, a window per person).
 * On desktop an elevation drawing on the left builds itself as you scroll and lights the part
 * that belongs to whoever you hover; each person opens a biography sheet.
 * /about/board and /about/executive-team land here, scrolled to that level.
 */
import {
  useEffect, useId, useMemo, useRef, useState,
} from 'react';
import {
  motion, useMotionValue, useScroll, useTransform,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  BTN_GHOST, BTN_LIGHT, Caption, CloseButton, Modal, ROUTES, cx, staggered, useLang, useLinkTo,
  useRevealProps, useTitle,
} from '../GDevelopments.jsx';
import { Elastic, useSmoothScroll } from '../elastic.jsx';
import { ABOUT_PAGES, LEADERSHIP, UI, isNamed } from '../content-pages.js';
import { AboutTabs } from './about.jsx';
import {
  CtaStrip, PageHero, SectionTitle, WRAP,
} from './shared.jsx';

const LS = LEADERSHIP;
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/* ───────── portrait / monogram ───────── */

function Portrait({ person, className = '', round = false }) {
  const { L } = useLang();
  const shape = round ? 'rounded-full' : 'rounded-[4px]';
  if (person.photo) return <img src={person.photo} alt="" className={cx('h-full w-full object-cover grayscale', shape, className)} />;
  const named = isNamed(person);
  return (
    <span
      aria-hidden="true"
      className={cx('grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#2a2a2a_0%,#111_62%,#0a0a0a_100%)] ring-1 ring-inset ring-white/10', shape, className)}
    >
      <span className="relative grid place-items-center">
        <span className="absolute h-[140%] w-[140%] rounded-full border border-white/10" />
        <span className="absolute h-[190%] w-[190%] rounded-full border border-white/[0.06]" />
        <span className="latin-display text-[clamp(1.35rem,1.87vw,1.7rem)] text-white/80">{named ? initials(L(person.name)) : 'G'}</span>
      </span>
    </span>
  );
}

/* ───────── elevation drawing ───────── */

const COLS = LS.board.length;
const FLOORS = LS.departments;
const G = { ground: 610, slabTop: 570, colTop: 330, beamTop: 310, floorH: 44, x0: 40, x1: 360 };
const colX = (i) => 72 + i * ((G.x1 - G.x0 - 64) / (COLS - 1));
const floorTop = (k) => G.beamTop - G.floorH * (k + 1);

function Elevation({ progress, hot, focus }) {
  const { L } = useLang();
  const uid = useId().replace(/:/g, ''); // each drawing needs its own pattern ids
  const p = progress;
  const found = useTransform(p, [0, 0.14], [0, 1]);
  const stone = useTransform(p, [0.08, 0.2], [0, 1]);
  const cols = useTransform(p, [0.24, 0.5], [0, 1]);
  const beam = useTransform(p, [0.46, 0.56], [0, 1]);
  const floorP = FLOORS.map((_, k) => useTransform(p, [0.56 + k * 0.07, 0.63 + k * 0.07], [0, 1])); // eslint-disable-line react-hooks/rules-of-hooks
  const roof = useTransform(p, [0.9, 0.98], [0, 1]);
  const lit = (kind, id) => hot && hot.kind === kind && (id === undefined || hot.id === id);
  const levelOn = (lvl) => !hot && focus === lvl;
  const stroke = (on) => (on ? '#fff' : 'rgba(255,255,255,0.55)');

  return (
    <svg viewBox="0 0 400 640" className="h-full w-full" role="img" aria-label={L(LS.hero.subtitle)}>
      <defs>
        <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" /></pattern>
        <pattern id={`${uid}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V8" stroke="rgba(255,255,255,0.18)" strokeWidth="1" /></pattern>
      </defs>
      <rect width="400" height="640" fill={`url(#${uid}-grid)`} />

      {/* ground + foundation */}
      <motion.line x1="10" x2="390" y1={G.ground} y2={G.ground} stroke="rgba(255,255,255,0.6)" strokeWidth="1" style={{ pathLength: found }} />
      <rect x="10" y={G.ground} width="380" height="18" fill={`url(#${uid}-hatch)`} />
      <motion.rect x={G.x0} y={G.slabTop} width={G.x1 - G.x0} height={G.ground - G.slabTop} fill="none" stroke={stroke(levelOn('cornerstone'))} strokeWidth="1" style={{ pathLength: found }} />

      {/* cornerstone */}
      <motion.g style={{ opacity: stone }}>
        <rect x={G.x0 + 8} y={G.slabTop + 7} width="84" height="27" fill={lit('chair') || levelOn('cornerstone') ? '#fff' : 'rgba(255,255,255,0.12)'} stroke="#fff" strokeWidth="1" />
        <rect x={G.x0 + 11} y={G.slabTop + 10} width="78" height="21" fill="none" stroke={lit('chair') || levelOn('cornerstone') ? '#000' : 'rgba(255,255,255,0.5)'} strokeWidth="0.5" />
        <text x={G.x0 + 50} y={G.slabTop + 24.5} textAnchor="middle" fontSize="8" letterSpacing="2" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fill={lit('chair') || levelOn('cornerstone') ? '#000' : '#fff'}>G · 1955</text>
      </motion.g>

      {/* columns */}
      {LS.board.map((m, i) => {
        const x = colX(i);
        const on = lit('board', m.id) || levelOn('board');
        const h = G.slabTop - G.colTop;
        return (
          <motion.g key={m.id} style={{ scaleY: cols, originY: 1, transformBox: 'fill-box' }}>
            <rect x={x - 12} y={G.slabTop - 8} width="24" height="8" fill="none" stroke={stroke(on)} strokeWidth="1" />
            <rect x={x - 8} y={G.colTop + 8} width="16" height={h - 16} fill={on ? 'rgba(255,255,255,0.9)' : 'none'} stroke={stroke(on)} strokeWidth="1" />
            {[-4, 0, 4].map((dx) => <line key={dx} x1={x + dx} x2={x + dx} y1={G.colTop + 12} y2={G.slabTop - 12} stroke={on ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.2)'} strokeWidth="0.6" />)}
            <rect x={x - 13} y={G.colTop} width="26" height="8" fill="none" stroke={stroke(on)} strokeWidth="1" />
          </motion.g>
        );
      })}

      {/* beam */}
      <motion.rect x={G.x0 + 6} y={G.beamTop} width={G.x1 - G.x0 - 12} height={G.colTop - G.beamTop} fill="none" stroke={stroke(levelOn('board'))} strokeWidth="1" style={{ pathLength: beam }} />

      {/* floors, bottom to top */}
      {FLOORS.map((d, k) => {
        const people = LS.executive.filter((e) => e.dept === d.id);
        const y = floorTop(k);
        const on = levelOn('executive') || (hot?.kind === 'exec' && people.some((e) => e.id === hot.id)) || hot?.dept === d.id;
        const w = G.x1 - G.x0 - 12;
        return (
          <motion.g key={d.id} style={{ opacity: floorP[k] }}>
            <rect x={G.x0 + 6} y={y} width={w} height={G.floorH} fill="none" stroke={stroke(on)} strokeWidth="1" />
            <line x1={G.x0 + 6} x2={G.x0 + 6 + w} y1={y + G.floorH - 3} y2={y + G.floorH - 3} stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
            {people.map((e, j) => {
              const ww = 26; const gap = (w - 40 - ww * people.length) / Math.max(1, people.length - 1);
              const wx = G.x0 + 26 + j * (ww + (people.length > 1 ? gap : 0)) + (people.length === 1 ? (w - 40 - ww) / 2 : 0);
              const lw = lit('exec', e.id);
              return <rect key={e.id} x={wx} y={y + 10} width={ww} height="22" fill={lw ? '#fff' : on ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.06)'} stroke={lw || on ? '#fff' : 'rgba(255,255,255,0.4)'} strokeWidth="0.8" />;
            })}
            <text x={G.x1 + 12} y={y + 26} fontSize="7" letterSpacing="1.2" fill={on ? '#fff' : 'rgba(255,255,255,0.45)'} fontFamily="Helvetica, Arial, sans-serif">L{String(k + 1).padStart(2, '0')}</text>
          </motion.g>
        );
      })}

      {/* roof */}
      <motion.g style={{ opacity: roof }}>
        <rect x={G.x0} y={floorTop(FLOORS.length - 1) - 10} width={G.x1 - G.x0} height="10" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <line x1="200" x2="200" y1={floorTop(FLOORS.length - 1) - 10} y2={floorTop(FLOORS.length - 1) - 44} stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <path d={`M200 ${floorTop(FLOORS.length - 1) - 44} h22 v12 h-22 z`} fill="#fff" />
        <text x="211" y={floorTop(FLOORS.length - 1) - 35} textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Helvetica, Arial, sans-serif" fill="#000">G</text>
      </motion.g>

      {/* dimension line */}
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.6">
        <line x1="22" x2="22" y1={floorTop(FLOORS.length - 1)} y2={G.ground} />
        <line x1="18" x2="26" y1={floorTop(FLOORS.length - 1)} y2={floorTop(FLOORS.length - 1)} />
        <line x1="18" x2="26" y1={G.ground} y2={G.ground} />
      </g>
    </svg>
  );
}

/* ───────── people ───────── */

function BioSheet({ person, onClose }) {
  const { L, lang } = useLang();
  return (
    <Modal open={!!person} onClose={onClose} labelledBy="bio-name" className="max-w-2xl">
      {person && (
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-[28px]"><Portrait person={person} className="rounded-none" /></div>
          <div className="absolute end-4 top-4"><CloseButton onClick={onClose} /></div>
          <div className="p-6 sm:p-8">
            <p className="caption text-g-50">{L(person.role)}</p>
            <h2 id="bio-name" className={cx('mt-2 font-display text-3xl', lang === 'en' && 'tracking-tightish')}>{L(person.name)}</h2>
            {person.title && <p className="mt-1 text-sm text-g-25">{L(person.title)}</p>}
            <p className="mt-6 leading-relaxed text-g-25">{person.bio ? L(person.bio) : L(LS.bioPending)}</p>
            {person.linkedin && (
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 border-b border-white/30 pb-1 font-medium hover:border-white">
                {L(UI.linkedin)} <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Cornerstone({ onOpen, onHot }) {
  const { L, lang } = useLang();
  const c = LS.chairman;
  const screw = 'absolute h-2 w-2 rounded-full border border-white/40 bg-white/10';
  return (
    <article
      className="relative border border-white/40 p-2"
      onMouseEnter={() => onHot({ kind: 'chair' })} onMouseLeave={() => onHot(null)}
    >
      <span className={cx(screw, 'start-3 top-3')} /><span className={cx(screw, 'end-3 top-3')} />
      <span className={cx(screw, 'bottom-3 start-3')} /><span className={cx(screw, 'bottom-3 end-3')} />
      <div className="grid gap-8 border border-white/15 bg-[radial-gradient(ellipse_at_30%_0%,#1c1c1c_0%,#0a0a0a_70%)] p-6 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:p-10">
        <button type="button" onClick={() => onOpen(c)} className="group relative block aspect-[4/5] overflow-hidden text-start" aria-label={`${L(UI.readBio)}: ${L(c.role)}`}>
          <Portrait person={c} className="transition duration-700 group-hover:scale-[1.03]" />
        </button>
        <div className="flex flex-col">
          <p className="caption text-g-50">{L(c.role)}</p>
          {c.message ? (
            <blockquote className={cx('mt-6 text-[clamp(1.12rem,2.02vw,1.75rem)] font-light leading-snug', lang === 'ar' && 'leading-[1.6]')}>“{L(c.message)}”</blockquote>
          ) : (
            <p aria-hidden="true" className="mt-6 select-none font-display text-[clamp(1.35rem,2.21vw,2.04rem)] uppercase leading-[1.05] tracking-[0.12em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.45)]">
              {L(c.engraving)}
            </p>
          )}
          <div className="mt-auto pt-8">
            <h3 className={cx('font-display text-3xl', lang === 'en' && 'tracking-tightish')}>{L(c.name)}</h3>
            <p className="mt-1 text-sm text-g-25">{L(c.title)}</p>
            <button type="button" onClick={() => onOpen(c)} className="btn-lux mt-6 inline-flex items-center gap-2 border-b border-white/30 pb-1 hover:border-white">
              {L(UI.readBio)} <ArrowRight size={15} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ColumnCard({ person, index, onOpen, onHot }) {
  const { L } = useLang();
  const reveal = useRevealProps({ y: 40, duration: 1, margin: '0px 0px -8% 0px' });
  return (
    <motion.li {...staggered(reveal, index % 3, 0.08)}>
      <button
        type="button" onClick={() => onOpen(person)}
        onMouseEnter={() => onHot({ kind: 'board', id: person.id })} onMouseLeave={() => onHot(null)}
        onFocus={() => onHot({ kind: 'board', id: person.id })} onBlur={() => onHot(null)}
        className="group flex w-full flex-col text-start"
      >
        {/* capital */}
        <span className="mx-auto h-3 w-full border border-white/40 transition-colors group-hover:border-white group-hover:bg-white" />
        <span className="mx-auto h-2 w-[86%] border-x border-b border-white/30" />
        {/* shaft */}
        <span className="relative mx-auto flex aspect-[1/1.35] w-[78%] flex-col items-center justify-center gap-4 border-x border-white/25 bg-[repeating-linear-gradient(90deg,transparent_0_14px,rgba(255,255,255,0.05)_14px_15px)] px-3 transition-colors group-hover:border-white/60">
          <span className="block aspect-square w-[62%]"><Portrait person={person} round /></span>
          <span dir="ltr" className="caption text-g-50">C{index + 1}</span>
        </span>
        {/* base */}
        <span className="mx-auto h-2 w-[86%] border-x border-t border-white/30" />
        <span className="mx-auto h-3 w-full border border-white/40 transition-colors group-hover:border-white" />
        <span className="mt-4 block font-display text-lg leading-tight">{L(person.name)}</span>
        <span className="mt-1 block text-[13px] text-g-50">{L(person.role)}</span>
      </button>
    </motion.li>
  );
}

function Floors({ onOpen, onHot, dept }) {
  const { L } = useLang();
  const floors = [...LS.departments].map((d, k) => ({ ...d, level: k + 1 })).reverse(); // top floor first
  return (
    <div className="border-y-2 border-white/60">
      {floors.map((d) => {
        const people = LS.executive.filter((e) => e.dept === d.id);
        const dim = dept !== 'all' && dept !== d.id;
        return (
          <section
            key={d.id} aria-label={L(d.name)}
            className={cx('grid gap-4 border-b border-white/15 py-6 transition-opacity duration-500 last:border-b-0 sm:grid-cols-[150px_minmax(0,1fr)]', dim && 'opacity-25')}
            onMouseEnter={() => onHot({ kind: 'floor', dept: d.id })} onMouseLeave={() => onHot(null)}
          >
            <div>
              <p dir="ltr" className="font-display text-3xl leading-none tabular-nums text-g-75 rtl:text-end">L{String(d.level).padStart(2, '0')}</p>
              <p className="caption mt-2 text-g-25">{L(d.name)}</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {people.map((e) => (
                <li key={e.id}>
                  <button
                    type="button" onClick={() => onOpen(e)} tabIndex={dim ? -1 : 0}
                    onMouseEnter={() => onHot({ kind: 'exec', id: e.id })} onFocus={() => onHot({ kind: 'exec', id: e.id })} onBlur={() => onHot(null)}
                    className="group flex h-full w-full items-center gap-3 rounded-[4px] border border-white/15 bg-white/[0.02] p-3 text-start transition-colors hover:border-white hover:bg-white hover:text-black"
                  >
                    <span className="block h-12 w-12 shrink-0"><Portrait person={e} className="group-hover:ring-black/20" /></span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium">{L(e.name)}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-g-50 group-hover:text-g-75">{L(e.role)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ───────── page ───────── */

export function LeadershipPage({ anchor }) {
  const { L, lang } = useLang();
  useTitle(L(ABOUT_PAGES[3].title));
  const linkTo = useLinkTo();
  const { scrollTo } = useSmoothScroll();
  const [bio, setBio] = useState(null);
  const [hot, setHot] = useState(null);
  const [focus, setFocus] = useState('cornerstone');
  const [dept, setDept] = useState('all');
  const contentRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: contentRef, offset: ['start 75%', 'end 70%'] });
  const progress = scrollYProgress; // Lenis already smooths the scroll
  const built = useMotionValue(1); // phones: the finished drawing, no scroll build-up

  // Land on the requested level after the router's scroll-to-top.
  useEffect(() => {
    if (!anchor) return undefined;
    const id = setTimeout(() => scrollTo(`#${anchor}`, { immediate: true }), 150);
    return () => clearTimeout(id);
  }, [anchor, scrollTo]);

  // Which level is in view (lights that part of the drawing when nothing is hovered).
  useEffect(() => {
    const els = ['cornerstone', 'board', 'executive'].map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setFocus(e.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const counts = useMemo(() => Object.fromEntries(LS.departments.map((d) => [d.id, LS.executive.filter((e) => e.dept === d.id).length])), []);
  const lv = LS.levels;
  const levelHead = (key, id) => (
    <div className="mb-8">
      <Caption>{L(lv[key].kicker)}</Caption>
      <SectionTitle id={id} className="mt-4" title={L(lv[key].title)} />
      <p className="mt-3 max-w-[52ch] text-[15px] text-g-25">{L(lv[key].text)}</p>
    </div>
  );

  return (
    <>
      <PageHero eyebrow={L(ABOUT_PAGES[3].title)} title={L(LS.hero.title)} subtitle={L(LS.hero.subtitle)} text={L(LS.hero.text)}>
        <div className="mt-8 h-[300px] max-w-[260px] lg:hidden" aria-hidden="true"><Elevation progress={built} hot={null} focus={null} /></div>
      </PageHero>
      <AboutTabs />

      <div className={cx(WRAP, 'grid gap-10 py-10 md:py-16 lg:grid-cols-12')}>
        {/* the drawing */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-24 h-[calc(100svh-8rem)] max-h-[760px] rounded-[6px] border border-white/10 bg-[#070707] p-6">
            <div className="flex items-center justify-between">
              <span className="caption text-g-50">G Developments · {lang === 'ar' ? 'مقطع رأسي' : 'Elevation'}</span>
              <span className="caption text-g-50">1:100</span>
            </div>
            <div className="h-[calc(100%-2rem)]"><Elevation progress={progress} hot={hot} focus={focus} /></div>
          </div>
        </div>

        {/* the people */}
        <div ref={contentRef} className="space-y-24 lg:col-span-7">
          <section id="cornerstone" aria-labelledby="lvl-chair" className="scroll-mt-28">
            {levelHead('cornerstone', 'lvl-chair')}
            <Cornerstone onOpen={setBio} onHot={setHot} />
          </section>

          <section id="board" aria-labelledby="lvl-board" className="scroll-mt-28">
            {levelHead('board', 'lvl-board')}
            <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
              {LS.board.map((m, i) => <ColumnCard key={m.id} person={m} index={i} onOpen={setBio} onHot={setHot} />)}
            </ul>
          </section>

          <section id="executive" aria-labelledby="lvl-exec" className="scroll-mt-28">
            {levelHead('executive', 'lvl-exec')}
            <div role="group" aria-label={L(lv.executive.title)} className="mb-6 flex flex-wrap gap-2">
              {[{ id: 'all', name: UI.all }, ...LS.departments].map((d) => (
                <button
                  key={d.id} type="button" aria-pressed={dept === d.id} onClick={() => setDept(d.id)}
                  className={cx('rounded-full border px-4 py-2 text-[13px] font-medium transition-colors', dept === d.id ? 'border-white bg-white text-black' : 'border-white/20 text-g-25 hover:border-white/50 hover:text-white')}
                >
                  {L(d.name)} <span className="opacity-50 tabular-nums">{d.id === 'all' ? LS.executive.length : counts[d.id]}</span>
                </button>
              ))}
            </div>
            <Floors onOpen={setBio} onHot={setHot} dept={dept} />
          </section>
        </div>
      </div>

      <CtaStrip title={L(LS.careers.title)} text={L(LS.careers.text)}>
        <Elastic as="a" {...linkTo(ROUTES.contact)} className={BTN_LIGHT}>{L(UI.getInTouch)} <ArrowRight size={16} className="rtl:rotate-180" /></Elastic>
        <Elastic as="a" {...linkTo(ROUTES.story)} className={BTN_GHOST}>{L(ABOUT_PAGES[1].title)}</Elastic>
      </CtaStrip>

      <BioSheet person={bio} onClose={() => setBio(null)} />
    </>
  );
}
