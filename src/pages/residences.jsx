/**
 * Residences section.
 *   /residences                   all communities: location, status, unit type, lifestyle filters; grid or map
 *   /residences/latest-launches   newest launch, all recent launches, register-interest form
 *   /residences/:slug             one community: key facts, concept + call-back card, gallery/plans, location
 *   /residences/:slug/units       unit types and starting prices, filterable; payment plan
 */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Check, Download, LayoutGrid, Map as MapIcon, Phone, X,
} from 'lucide-react';
import {
  AmenityList, BTN_GHOST, BTN_LIGHT, Caption, CtaBand, EASE, Field, GalleryViewer, Link, MasterplanSVG, Photo,
  ROUTES, ReelCard, Reveal, SectionHeading, Segmented, UnitInspector, cx, inputCls, priceLabel, projectPath,
  unitsPath, useLang, useLinkTo, useTitle,
} from '../GDevelopments.jsx';
import { Elastic } from '../elastic.jsx';
import Masterplan, { PlanLightbox } from './masterplan.jsx';
import { JOURNAL, MAP_POINTS, PROJECTS } from '../content.js';
import {
  LAUNCH_PAGE, MASTERPLANS, MASTERPLAN_UI, PAYMENT_PLANS, PROJECT_PHASES, PROJECT_STATUS, RESIDENCES,
  UNITS_PAGE, UNIT_TABLES,
} from '../content-pages.js';
import { HERO_BANNER, PROJECT_MEDIA, mediaUrl, projectImages } from '../media.js';
import {
  EGYPT, GOVERNORATES, LAND, PAPER, fromMap, geo, toMap, viewBoxFor,
} from '../map/project.js';
import {
  CtaStrip, NotFound, PageHero, RiseItem, SectionNav, SectionTitle, TILE, TILE_GRID, WRAP, formatDate, selectCls,
} from './shared.jsx';

const statusOf = (p) => PROJECT_STATUS[p.id] || null;

/**
 * A view that shows a whole governorate with some of its neighbours around it. Never tighter than
 * the default ±1.6° x ±0.62° window, so a small governorate (Cairo) is framed, not zoomed into.
 */
function governorateView(id) {
  const g = id && GOVERNORATES.find((x) => x.id === id);
  if (!g) return null;
  const [north, west] = fromMap([g.box[0], g.box[1]]);
  const [south, east] = fromMap([g.box[2], g.box[3]]);
  const cx = (west + east) / 2;
  const cy = (south + north) / 2;
  const halfW = Math.max(((east - west) / 2) * 1.2, 1.6);
  const halfH = Math.max(((north - south) / 2) * 1.2, 0.62);
  return { west: cx - halfW, east: cx + halfW, south: cy - halfH, north: cy + halfH };
}
const lifestyleOf = (p) => (p.cats.includes('coastal') ? 'coastal' : 'urban');
const egp = (m) => `EGP ${(m * 1e6).toLocaleString('en-US')}`;

function ResidencesTabs() {
  const { L } = useLang();
  return (
    <SectionNav
      label={L(RESIDENCES.tabs.all)}
      items={[
        { to: ROUTES.residences, label: L(RESIDENCES.tabs.all) },
        { to: ROUTES.launches, label: L(RESIDENCES.tabs.launches) },
      ]}
    />
  );
}

function StatusChip({ status, className = '' }) {
  const { L } = useLang();
  if (!status) return null;
  return (
    <span className={cx('caption inline-flex items-center gap-1.5 rounded-full px-2.5 py-1', status === 'ready' ? 'bg-white text-black' : 'border border-white/40 text-white', className)}>
      <span className={cx('h-1.5 w-1.5 rounded-full', status === 'ready' ? 'bg-black' : 'bg-white')} />
      {L(RESIDENCES.statuses[status])}
    </span>
  );
}

/* ───────── Egypt map (listing map view + project location) ───────── */

const NORTH_EGYPT = { west: 26.9, east: 32.4, south: 29.45, north: 31.75 };

export function EgyptMap({
  projects, active, onHover, onSelect, view = NORTH_EGYPT, labels = false, governorate = null, className = '',
}) {
  const { L } = useLang();
  const vb = viewBoxFor(view);
  const gov = governorate && GOVERNORATES.find((g) => g.id === governorate);
  const [vx, vy, vw, vh] = vb.split(' ').map(Number);
  const pos = (p) => {
    const [x, y] = toMap(MAP_POINTS[p.id].at);
    return [((x - vx) / vw) * 100, ((y - vy) / vh) * 100];
  };
  return (
    <div className={cx('relative overflow-hidden rounded-[6px] bg-[#efeeea]', className)} style={{ aspectRatio: `${vw} / ${vh}` }}>
      <svg viewBox={vb} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <rect x={vx - 5} y={vy - 5} width={vw + 10} height={vh + 10} fill={PAPER} />
        <path d={geo.region.land} fill={LAND} />
        <path d={geo.region.egypt} fill={EGYPT} />
        <path d={geo.region.borders} fill="none" stroke={PAPER} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
        {gov && (
          <>
            {/* every governorate line for context, then the project's own governorate lifted out */}
            {GOVERNORATES.map((g) => (
              <path key={g.id} d={g.d} fill="none" stroke={PAPER} strokeOpacity="0.22" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
            ))}
            <path d={gov.d} fill="#2e2e2e" stroke={PAPER} strokeOpacity="0.95" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>
      {gov && (
        <span className="caption absolute start-4 top-4 z-[4] inline-flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-white backdrop-blur-md">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm border border-white bg-[#2e2e2e]" />
          {L(gov.name)}
        </span>
      )}
      {projects.map((p, i) => {
        const [left, top] = pos(p);
        const on = active === p.id;
        return (
          <button
            key={p.id} type="button"
            onMouseEnter={() => onHover?.(p.id)} onFocus={() => onHover?.(p.id)} onClick={() => onSelect?.(p)}
            aria-label={p.name}
            className="group absolute -ml-4 -mt-4 grid h-8 w-8 place-items-center"
            style={{ left: `${left}%`, top: `${top}%`, zIndex: on ? 3 : 2 }}
          >
            {on && <span className="absolute h-8 w-8 animate-ping rounded-full bg-white/50" />}
            <span className={cx('relative grid place-items-center rounded-full border-2 border-black bg-white font-display text-[10px] text-black shadow-[0_0_0_2px_rgba(255,255,255,0.6)] transition-all', on ? 'h-6 w-6' : 'h-4 w-4 group-hover:h-5 group-hover:w-5')}>
              {!labels && on ? i + 1 : ''}
            </span>
            {(labels || on) && (
              <span dir="ltr" className="latin-display absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black px-3 py-1.5 text-[12px] tracking-tightish text-white shadow-lg">{p.name}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ───────── /residences ───────── */

export function ResidencesPage() {
  const { t, L } = useLang();
  const r = t.pages.residences;
  useTitle(r.title);
  const [region, setRegion] = useState('all');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [life, setLife] = useState('');
  const [view, setView] = useState('grid');
  const [active, setActive] = useState(PROJECTS[0].id);

  const list = PROJECTS.filter((p) => (region === 'all' || p.region === region)
    && (!status || statusOf(p) === status) && (!type || p.types.includes(type)) && (!life || lifestyleOf(p) === life));
  const regions = ['all', ...new Set(PROJECTS.map((p) => p.region))];
  const chips = [
    region !== 'all' && { k: 'region', label: t.regions[region], clear: () => setRegion('all') },
    status && { k: 'status', label: L(RESIDENCES.statuses[status]), clear: () => setStatus('') },
    type && { k: 'type', label: t.types[type], clear: () => setType('') },
    life && { k: 'life', label: L(RESIDENCES.lifestyles[life]), clear: () => setLife('') },
  ].filter(Boolean);
  const clearAll = () => { setRegion('all'); setStatus(''); setType(''); setLife(''); };
  const select = (id, label, value, onChange, options) => (
    <label className="flex items-center gap-3">
      <span className="caption text-g-50">{label}</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        <option value="">{r.all}</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );

  return (
    <>
      <PageHero eyebrow={t.nav.residences} title={r.title} subtitle={r.subtitle} text={r.text} image={mediaUrl(HERO_BANNER.image)} />
      <ResidencesTabs />
      <section aria-label={r.title} className="bg-black">
        <div className={cx(WRAP, 'pb-14 md:pb-16')}>
          <div className="flex flex-col gap-4 border-b border-white/10 py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <Segmented
                layoutId="res-region" label={r.location} value={region} onChange={setRegion}
                options={regions.map((v) => ({ value: v, label: v === 'all' ? r.all : t.regions[v] }))}
              />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {select('res-status', L(RESIDENCES.status), status, setStatus, Object.keys(RESIDENCES.statuses).map((k) => [k, L(RESIDENCES.statuses[k])]))}
                {select('res-type', r.type, type, setType, Object.entries(t.types))}
                {select('res-life', L(RESIDENCES.lifestyle), life, setLife, Object.keys(RESIDENCES.lifestyles).map((k) => [k, L(RESIDENCES.lifestyles[k])]))}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span role="status" className="caption me-2 text-g-25">{r.count(list.length)}</span>
                {chips.map((c) => (
                  <span key={c.k} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 py-1 pe-1.5 ps-3 text-[13px]">
                    {c.label}
                    <button type="button" onClick={c.clear} aria-label={`${L(RESIDENCES.remove)} ${c.label}`} className="grid h-5 w-5 place-items-center rounded-full hover:bg-white hover:text-black"><X size={12} /></button>
                  </span>
                ))}
                {chips.length > 0 && <button type="button" onClick={clearAll} className="ms-1 text-[13px] underline decoration-white/30 underline-offset-4 hover:decoration-white">{L(RESIDENCES.clearAll)}</button>}
              </div>
              <Segmented
                layoutId="res-view" label="View" value={view} onChange={setView}
                options={[
                  { value: 'grid', label: <span className="inline-flex items-center gap-2"><LayoutGrid size={14} />{L(RESIDENCES.view.grid)}</span> },
                  { value: 'map', label: <span className="inline-flex items-center gap-2"><MapIcon size={14} />{L(RESIDENCES.view.map)}</span> },
                ]}
              />
            </div>
          </div>

          {!list.length && (
            <div className="mt-8 rounded-2xl border border-white/10 p-10 text-center">
              <p className="text-g-25">{r.none}</p>
              <button type="button" onClick={clearAll} className="mt-5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white hover:text-black">{r.clear}</button>
            </div>
          )}

          {list.length > 0 && view === 'grid' && (
            <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((p, i) => (
                <RiseItem key={p.id} index={i} className="relative">
                  <ReelCard p={p} index={PROJECTS.indexOf(p)} />
                  <StatusChip status={statusOf(p)} className="pointer-events-none absolute end-4 top-14 z-30" />
                </RiseItem>
              ))}
            </ul>
          )}

          {list.length > 0 && view === 'map' && (
            <div className="mt-8 grid overflow-hidden rounded-[6px] border border-white/10 lg:grid-cols-[360px_minmax(0,1fr)]">
              <ol className="order-2 max-h-[560px] divide-y divide-white/10 overflow-y-auto lg:order-1" data-lenis-prevent>
                {list.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      to={projectPath(p)} onMouseEnter={() => setActive(p.id)} onFocus={() => setActive(p.id)}
                      className={cx('flex items-center gap-4 p-4 transition-colors', active === p.id ? 'bg-white/[0.08] shadow-[inset_3px_0_0_#fff] rtl:shadow-[inset_-3px_0_0_#fff]' : 'hover:bg-white/[0.04]')}
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/30 font-display text-[12px] tabular-nums">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span dir="ltr" className="latin-display block text-lg tracking-tightish rtl:text-end">{p.name}</span>
                        <span className="mt-0.5 block truncate text-[13px] text-g-50">{L(p.loc)}</span>
                        {statusOf(p) && <span className="caption mt-1.5 block text-g-25">{L(RESIDENCES.statuses[statusOf(p)])}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="order-1 border-white/10 lg:order-2 lg:border-s">
                <EgyptMap projects={list} active={active} onHover={setActive} onSelect={() => {}} className="rounded-none" />
              </div>
            </div>
          )}
          <p className="mt-10 text-xs text-g-50">{t.portfolio.note}</p>
        </div>
      </section>
    </>
  );
}

/* ───────── /residences/:slug ───────── */

function ProjectExplorer({ p, openConcierge }) {
  const { t, L } = useLang();
  const images = projectImages(p.id).gallery;
  const amenities = PROJECT_MEDIA[p.id]?.amenities || [];
  const plan = mediaUrl(PROJECT_MEDIA[p.id]?.masterplan);
  const [tab, setTab] = useState(images.length ? 'gallery' : 'masterplan');
  const tabs = [
    images.length && { value: 'gallery', label: t.modal.gallery },
    { value: 'masterplan', label: t.modal.masterplan },
    { value: 'units', label: t.modal.units },
    amenities.length && { value: 'amenities', label: t.modal.amenitiesTab },
  ].filter(Boolean);
  return (
    <div>
      {/* Stays under the header while you scroll the panel below, so you can always switch tab. */}
      <div className="sticky top-[calc(4.75rem+env(safe-area-inset-top,0px))] [html[data-nav-hidden=true]_&]:top-0 transition-[top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 bg-black/85 px-4 py-3 backdrop-blur-xl max-md:bg-black/95 max-md:backdrop-blur-none sm:-mx-6 sm:px-6">
        <Segmented layoutId="project-tab" label={p.name} value={tab} onChange={setTab} options={tabs} />
        {tab === 'masterplan' && <span className="caption text-g-50">{t.modal.illustrative}</span>}
      </div>
      <div className="mt-6">
        {tab === 'gallery' && <GalleryViewer images={images} name={p.name} />}
        {tab === 'amenities' && <AmenityList items={amenities} />}
        {tab === 'masterplan' && (
          plan
            ? <PlanLightbox src={plan} alt={`${p.name} masterplan`} title={`${p.name} · ${L(MASTERPLAN_UI.masterplan)}`} />
            : <div className="max-w-4xl"><MasterplanSVG p={p} /></div>
        )}
        {tab === 'units' && (
          <UnitInspector
            p={p}
            onBrochure={() => openConcierge({ intent: 'brochure', project: p.id })}
            onEnquire={() => openConcierge({ intent: 'unit', project: p.id })}
          />
        )}
      </div>
    </div>
  );
}

function CallbackCard({ p, onLead }) {
  const { t, L, lang } = useLang();
  const c = RESIDENCES.callback;
  const [form, setForm] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = t.concierge.errName;
    if (form.phone.replace(/\D/g, '').length < 10) err.phone = t.concierge.errPhone;
    setErrors(err);
    if (Object.keys(err).length) return;
    await onLead?.({ kind: 'callback', intent: 'project', project: p.id, lang, ...form });
    setDone(true);
  };
  return (
    <aside className="rounded-[20px] border border-white/15 bg-white/[0.03] p-6 lg:sticky lg:top-28" aria-labelledby="callback-title">
      <h3 id="callback-title" className={cx('font-display text-2xl leading-tight', lang === 'en' && 'tracking-tightish')}>{L(c.title(p.name))}</h3>
      <p dir="ltr" className="mt-2 text-sm text-g-25 rtl:text-end">{priceLabel(p, t)}</p>
      <p className="mt-1 text-sm text-g-50">{L(c.text)}</p>
      {done ? (
        <p role="status" className="mt-6 flex items-center gap-3 rounded-xl bg-white/[0.06] p-4 text-sm"><Check size={18} /> {L(c.done)}</p>
      ) : (
        <form noValidate onSubmit={submit} className="mt-6 grid gap-4">
          <Field id="cb-name" label={t.concierge.name} error={errors.name}>
            <input id="cb-name" autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cb-name-err' : undefined} />
          </Field>
          <Field id="cb-phone" label={t.concierge.phone} error={errors.phone}>
            <input id="cb-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="010 1234 5678" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'cb-phone-err' : undefined} />
          </Field>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 font-medium text-black transition hover:bg-g-25"><Phone size={16} /> {L(c.submit)}</button>
        </form>
      )}
      <Link to={unitsPath(p)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3.5 font-medium transition hover:bg-white/10">
        {L(RESIDENCES.sections.units)} <ArrowRight size={16} className="rtl:rotate-180" />
      </Link>
    </aside>
  );
}

export function ProjectPage({ slug, openConcierge, onLead }) {
  const { t, L, lang } = useLang();
  const pp = t.pages.project;
  const p = PROJECTS.find((x) => x.slug === slug);
  useTitle(p ? p.name : t.pages.notFound.title);
  if (!p) return <NotFound />;
  const cover = projectImages(p.id).cover;
  const others = PROJECTS.filter((x) => x.id !== p.id).slice(0, 3);
  const k = RESIDENCES.keybar;
  const status = statusOf(p);
  const keybar = [
    [L(k.location), L(p.loc).split('·').pop().trim()],
    [L(k.signature), p.marker, true],
    [L(k.types), p.types.map((ty) => t.types[ty]).join(', ')],
    status && [L(k.status), L(RESIDENCES.statuses[status])],
    [L(k.price), priceLabel(p, t), true],
  ].filter(Boolean);
  const [lat, lon] = MAP_POINTS[p.id]?.at || [30, 30];
  const localView = governorateView(MAP_POINTS[p.id]?.gov)
    || { west: lon - 1.6, east: lon + 1.6, south: lat - 0.62, north: lat + 0.62 };

  return (
    <>
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-black">
        <div className="absolute inset-0 -z-10"><Photo src={cover} alt={p.name} plate={p.plate} eager /></div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.3)_60%,#000_100%)]" />
        <div className={cx(WRAP, 'w-full pb-10 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] md:pb-14')}>
          <motion.div initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE }}>
            <div className="flex flex-wrap items-center gap-3">
              <Caption className="text-g-25">{t.nav.residences} / {p.name}</Caption>
              <StatusChip status={status} />
              {!cover && <span className="caption rounded-full border border-white/25 px-3 py-1 text-g-25">{t.portfolio.photosSoon}</span>}
            </div>
            <h1 dir="ltr" className="latin-display mt-6 text-[clamp(2.58rem,6.2vw,5.58rem)] leading-[0.9] tracking-brand rtl:text-end">{p.name}</h1>
            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p className="max-w-[52ch] text-[15px] leading-relaxed text-g-25">{L(p.blurb)}</p>
              <div className="flex flex-wrap gap-3">
                <Elastic type="button" onClick={() => openConcierge({ intent: 'unit', project: p.id })} className={BTN_LIGHT}>
                  {pp.inquire} <ArrowUpRight size={17} className="rtl:-scale-x-100" />
                </Elastic>
                <Elastic type="button" onClick={() => openConcierge({ intent: 'brochure', project: p.id })} className={cx(BTN_GHOST, 'backdrop-blur-sm')}>
                  <Download size={17} /> {pp.brochure}
                </Elastic>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* key facts */}
      <dl className="grid grid-cols-2 border-y border-white/10 bg-black md:grid-cols-5">
        {keybar.map(([label, value, ltr], i) => (
          <div key={label} className={cx('min-w-0 border-white/10 px-4 py-5 sm:px-6', i > 0 && 'md:border-s', i % 2 === 1 && 'border-s', i >= 2 && 'border-t md:border-t-0')}>
            <dt className="caption text-g-50">{label}</dt>
            <dd dir={ltr ? 'ltr' : undefined} className="mt-1.5 truncate text-[15px] font-medium rtl:text-end">{value}</dd>
          </div>
        ))}
      </dl>

      {/* in-page links */}
      <nav aria-label={p.name} className="border-b border-white/10 bg-black">
        <div className={cx(WRAP, 'no-scrollbar flex gap-7 overflow-x-auto')}>
          {[
            ['#overview', RESIDENCES.sections.overview],
            ['#explore', RESIDENCES.sections.explore],
            (MASTERPLANS[p.id] || PROJECT_PHASES[p.id] || PROJECT_MEDIA[p.id]?.masterplan)
              && ['#masterplan', MASTERPLANS[p.id]?.title || (PROJECT_MEDIA[p.id]?.masterplan ? MASTERPLAN_UI.masterplan : MASTERPLAN_UI.phases)],
            ['#location', RESIDENCES.sections.location],
          ].filter(Boolean).map(([href, label]) => (
            <a key={href} href={href} className="shrink-0 whitespace-nowrap py-4 text-[14px] text-g-50 transition-colors hover:text-white">{L(label)}</a>
          ))}
          <Link to={unitsPath(p)} className="shrink-0 whitespace-nowrap py-4 text-[14px] text-g-50 transition-colors hover:text-white">{L(RESIDENCES.sections.units)} ↗</Link>
        </div>
      </nav>

      <section id="overview" aria-labelledby="concept-title" className="scroll-mt-24 bg-black">
        <div className={cx(WRAP, 'grid gap-10 py-10 md:py-16 lg:grid-cols-12')}>
          <div className="lg:col-span-7">
            <Reveal>
              <Caption>G Developments | {p.name}</Caption>
              <h2 id="concept-title" className={cx('mt-5 font-display text-[clamp(1.72rem,3.12vw,2.65rem)] leading-[1.02]', lang === 'en' && 'tracking-tightish')}>{pp.concept}</h2>
              <p className={cx('mt-6 max-w-[60ch] font-text text-[clamp(0.95rem,1.47vw,1.29rem)] font-light leading-relaxed text-g-25', lang === 'ar' && 'leading-[1.8]')}>
                {L(p.concept || p.blurb)}
              </p>
            </Reveal>
            <h3 className="caption mt-12 text-g-50">{pp.highlights}</h3>
            <ol className={cx(TILE_GRID, 'mt-5 sm:grid-cols-2')}>
              {p.highlights.map((h, i) => (
                <li key={h.en} className={cx(TILE, 'flex items-baseline gap-4 p-5')}>
                  <span dir="ltr" className="caption text-g-50 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-lg">{L(h)}</span>
                </li>
              ))}
            </ol>
            {p.facilities && (
              <>
                <h3 className="caption mt-10 text-g-50">{pp.facilities}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.facilities.map((f) => <li key={f.en} className="rounded-full border border-white/15 px-4 py-2 text-sm text-g-25">{L(f)}</li>)}
                </ul>
              </>
            )}
          </div>
          <div className="lg:col-span-4 lg:col-start-9"><CallbackCard p={p} onLead={onLead} /></div>
        </div>
      </section>

      <section id="explore" aria-labelledby="explore-title" className="scroll-mt-24 border-t border-white/10 bg-black">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <Reveal><SectionHeading id="explore-title" eyebrow={p.name} title={pp.explore} subtitle={p.name} /></Reveal>
          <div className="mt-8"><ProjectExplorer p={p} openConcierge={openConcierge} /></div>
        </div>
      </section>

      <Masterplan projectId={p.id} projectName={p.name} />

      {MAP_POINTS[p.id] && (
        <section id="location" aria-labelledby="location-title" className="scroll-mt-24 border-t border-white/10 bg-black">
          <div className={cx(WRAP, 'grid gap-8 py-10 md:py-16 lg:grid-cols-12 lg:items-end')}>
            <div className="lg:col-span-4">
              <SectionTitle id="location-title" title={L(RESIDENCES.sections.location)} subtitle={L(p.loc)} />
              <p className="mt-4 text-sm text-g-50">{L(RESIDENCES.locationText)}</p>
            </div>
            <div className="lg:col-span-8"><EgyptMap projects={[p]} active={p.id} view={localView} governorate={MAP_POINTS[p.id]?.gov} labels /></div>
          </div>
        </section>
      )}

      <section aria-labelledby="more-title" className="border-t border-white/10 bg-black">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="more-title" className={cx('font-display text-[clamp(1.72rem,3.12vw,2.65rem)] leading-[1.02]', lang === 'en' && 'tracking-tightish')}>{pp.more}</h2>
            <Link to={ROUTES.residences} className="btn-lux inline-flex items-center gap-2 border-b border-white/30 pb-1 transition-colors hover:border-white">
              {pp.all} <ArrowRight size={15} className="rtl:rotate-180" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o, i) => <RiseItem key={o.id} index={i}><ReelCard p={o} index={PROJECTS.indexOf(o)} /></RiseItem>)}
          </ul>
        </div>
      </section>

      <CtaBand onConcierge={() => openConcierge({ intent: 'meeting', project: p.id })} />
    </>
  );
}

/* ───────── /residences/latest-launches ───────── */

const LAUNCHES = JOURNAL.filter((a) => a.project).sort((a, b) => b.date.localeCompare(a.date));

function LaunchRail() {
  // Two columns of launch imagery drifting upward (the "gallery ribbon"), paused for reduced motion.
  const imgs = LAUNCHES.map((a) => mediaUrl(a.image)).filter(Boolean);
  const col = (list, cls) => (
    <div className={cx('flex flex-col gap-3', cls)}>
      {[...list, ...list].map((src, i) => (
        <div key={i} className="aspect-[4/5] overflow-hidden rounded-[6px] bg-g-ink"><img src={src} alt="" className="h-full w-full object-cover" loading="lazy" /></div>
      ))}
    </div>
  );
  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-3 overflow-hidden p-3 [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]" aria-hidden="true">
      {col(imgs, 'animate-rail')}
      {col([...imgs].reverse(), 'animate-rail-slow')}
    </div>
  );
}

function LaunchForm({ onLead }) {
  const { t, L, lang } = useLang();
  const f = LAUNCH_PAGE.form;
  const [form, setForm] = useState({ name: '', phone: '', email: '', project: '', budget: 'unsure', channel: 'call' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState('');
  const set = (k) => (e) => setForm((v) => ({ ...v, [k]: e.target.value }));
  const blur = (k) => () => {
    if (k === 'phone' && form.phone && form.phone.replace(/\D/g, '').length < 10) setErrors((e) => ({ ...e, phone: t.concierge.errPhone }));
    if (k === 'name' && errors.name && form.name.trim()) setErrors((e) => ({ ...e, name: undefined }));
  };
  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = t.concierge.errName;
    if (form.phone.replace(/\D/g, '').length < 10) err.phone = t.concierge.errPhone;
    setErrors(err);
    if (Object.values(err).some(Boolean)) return;
    await onLead?.({ kind: 'launch', lang, ...form });
    setDone(form.name.trim().split(' ')[0]);
  };
  if (done) {
    return (
      <div role="status" className="rounded-[20px] border border-white/15 p-8">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black"><Check size={22} /></span>
        <p className="mt-5 font-display text-2xl">{L(f.done(done))}</p>
        {!onLead && <p className="caption mt-4 text-g-50">{t.concierge.prototype}</p>}
      </div>
    );
  }
  return (
    <form noValidate onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field id="lf-name" label={t.concierge.name} error={errors.name}>
        <input id="lf-name" autoComplete="name" value={form.name} onChange={set('name')} onBlur={blur('name')} className={inputCls} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'lf-name-err' : undefined} />
      </Field>
      <Field id="lf-phone" label={t.concierge.phone} error={errors.phone}>
        <input id="lf-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="010 1234 5678" value={form.phone} onChange={set('phone')} onBlur={blur('phone')} className={inputCls} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'lf-phone-err' : undefined} />
      </Field>
      <div className="sm:col-span-2">
        <Field id="lf-email" label={L(f.email)}>
          <input id="lf-email" type="email" inputMode="email" autoComplete="email" dir="ltr" value={form.email} onChange={set('email')} className={inputCls} />
        </Field>
      </div>
      <Field id="lf-project" label={L(f.project)}>
        <select id="lf-project" value={form.project} onChange={set('project')} className={inputCls}>
          <option value="">{L(f.anyLaunch)}</option>
          {[...new Set(LAUNCHES.map((a) => a.project))].map((id) => <option key={id} value={id}>{PROJECTS.find((p) => p.id === id)?.name}</option>)}
        </select>
      </Field>
      <Field id="lf-budget" label={L(f.budget)}>
        <select id="lf-budget" value={form.budget} onChange={set('budget')} className={inputCls}>
          {f.budgets.map((b) => <option key={b.id} value={b.id}>{L(b.label)}</option>)}
        </select>
      </Field>
      <fieldset className="sm:col-span-2">
        <legend className="caption text-g-50">{L(f.contactBy)}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {f.channels.map((c) => (
            <label key={c.id} className={cx('cursor-pointer rounded-full border px-4 py-2.5 text-sm font-medium transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white', form.channel === c.id ? 'border-white bg-white text-black' : 'border-white/20 hover:border-white/50')}>
              <input type="radio" name="lf-channel" value={c.id} checked={form.channel === c.id} onChange={set('channel')} className="sr-only" />
              {L(c.label)}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <button type="submit" className={cx(BTN_LIGHT, 'inline-flex items-center gap-2')}>{L(f.submit)} <ArrowRight size={16} className="rtl:rotate-180" /></button>
        <p className="mt-3 text-xs text-g-50">{L(f.privacy)}</p>
      </div>
    </form>
  );
}

export function LaunchesPage({ onLead }) {
  const { t, L, lang } = useLang();
  const linkTo = useLinkTo();
  useTitle(L(RESIDENCES.tabs.launches));
  const [newest, ...rest] = LAUNCHES;
  const newestProject = PROJECTS.find((p) => p.id === newest.project);
  return (
    <>
      <section className="grid bg-black lg:min-h-[88svh] lg:grid-cols-12">
        <div className="relative min-h-[46svh] lg:col-span-7">
          <LaunchRail />
        </div>
        <div className="flex flex-col justify-end gap-6 px-4 pb-12 pt-10 sm:px-6 lg:col-span-5 lg:px-12 lg:pb-16 lg:pt-32">
          <Caption>G Developments | {L(RESIDENCES.tabs.launches)}</Caption>
          <span className="caption self-start rounded-full bg-white px-3 py-1.5 text-black">{L(LAUNCH_PAGE.newest)} · {formatDate(newest.date, lang)}</span>
          <h1 className={cx('font-display text-[clamp(2.06rem,3.22vw,3.08rem)] leading-[0.98] [text-wrap:balance]', lang === 'en' ? 'tracking-brand' : 'leading-[1.25]')}>{L(newest.title)}</h1>
          <p className="max-w-[46ch] text-g-25">{L(newest.excerpt)}</p>
          <div className="flex flex-wrap gap-3">
            <Elastic as="a" href="#launch-form" className={BTN_LIGHT}>{L(LAUNCH_PAGE.form.submit)}</Elastic>
            {newestProject && <Elastic as="a" {...linkTo(unitsPath(newestProject))} className={BTN_GHOST}>{L(LAUNCH_PAGE.seeUnits)}</Elastic>}
          </div>
        </div>
      </section>
      <ResidencesTabs />

      <section aria-labelledby="launch-list" className="bg-black">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <SectionTitle id="launch-list" title={L(LAUNCH_PAGE.all)} />
          <ol className="mt-8 border-b border-white/10">
            {[newest, ...rest].map((a, i) => {
              const p = PROJECTS.find((x) => x.id === a.project);
              return (
                <RiseItem key={a.slug} index={i} className="border-t border-white/10">
                  <Link to={p ? projectPath(p) : ROUTES.residences} className="group grid items-center gap-5 py-6 md:grid-cols-[280px_minmax(0,1fr)_auto] md:gap-10">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-g-ink">
                      <div className="absolute inset-0 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"><Photo src={mediaUrl(a.image)} alt="" plate={a.plate} /></div>
                    </div>
                    <div>
                      <span className={cx('caption inline-block rounded-full px-2.5 py-1', i === 0 ? 'bg-white text-black' : 'border border-white/25 text-g-25')}>{formatDate(a.date, lang)}</span>
                      <h3 className={cx('mt-3 font-display text-[clamp(1.35rem,2.04vw,1.87rem)] leading-tight', lang === 'en' && 'tracking-tightish')}>{L(a.title)}</h3>
                      <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-g-25">{p && <span dir="ltr" className="text-white">{p.name} · </span>}{L(a.excerpt)}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-4 py-2.5 text-[13px] font-medium transition group-hover:bg-white group-hover:text-black md:self-center">
                      {L(LAUNCH_PAGE.view)} <ArrowUpRight size={14} className="rtl:-scale-x-100" />
                    </span>
                  </Link>
                </RiseItem>
              );
            })}
          </ol>
          <p className="mt-6 text-xs text-g-50">{t.launches.note}</p>
        </div>
      </section>

      <section id="launch-form" aria-labelledby="launch-form-title" className="scroll-mt-24 border-t border-white/10 bg-[#0a0a0a]">
        <div className={cx(WRAP, 'grid gap-10 py-10 md:py-16 lg:grid-cols-12')}>
          <div className="lg:col-span-5">
            <SectionTitle id="launch-form-title" title={L(LAUNCH_PAGE.form.title)} />
            <p className="mt-4 max-w-[44ch] text-g-25">{L(LAUNCH_PAGE.form.text)}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7"><LaunchForm onLead={onLead} /></div>
        </div>
      </section>
    </>
  );
}

/* ───────── /residences/:slug/units ───────── */

function PaymentPlan({ plan }) {
  const { L } = useLang();
  const u = UNITS_PAGE;
  const cells = [
    [L(u.down), plan.down],
    [L(u.instalments), L(u.years(plan.years))],
    plan.delivery && [L(u.delivery), L(u.from(plan.delivery))],
  ].filter(Boolean);
  return (
    <section aria-labelledby="plan-title" className="border-t border-white/10 bg-black">
      <div className={cx(WRAP, 'py-10 md:py-16')}>
        <SectionTitle id="plan-title" title={L(u.plan)} />
        <dl className={cx('mt-8 grid border border-white/10', cells.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
          {cells.map(([k, v], i) => (
            <div key={k} className={cx('p-6', i > 0 && 'border-t border-white/10 sm:border-s sm:border-t-0')}>
              <dt className="caption text-g-50">{k}</dt>
              <dd className="mt-2 font-display text-3xl tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function UnitsPage({ slug, openConcierge }) {
  const { t, L, lang } = useLang();
  const u = UNITS_PAGE;
  const p = PROJECTS.find((x) => x.slug === slug);
  useTitle(p ? `${L(u.title)} · ${p.name}` : t.pages.notFound.title);
  const table = p && UNIT_TABLES[p.id];
  const types = useMemo(() => (table ? [...new Set(table.rows.map((r) => r.type))] : []), [table]);
  const [type, setType] = useState('all');
  const [max, setMax] = useState(50);
  const [hideSold, setHideSold] = useState(false);
  if (!p) return <NotFound />;
  const plan = PAYMENT_PLANS[p.id];
  const rows = table ? table.rows.filter((r) => (type === 'all' || r.type === type) && (max >= 50 || r.price <= max) && (!hideSold || r.availability !== 'sold')) : [];
  const chip = (a) => cx('caption inline-flex rounded-full px-2.5 py-1', a === 'available' ? 'bg-white text-black' : a === 'few' ? 'border border-white text-white' : 'bg-white/10 text-g-50');
  const action = (r) => (r.availability === 'sold'
    ? <button type="button" onClick={() => openConcierge({ intent: 'waitlist', project: p.id })} className="text-[13px] underline decoration-white/30 underline-offset-4 hover:decoration-white">{L(u.waitlist)}</button>
    : <button type="button" onClick={() => openConcierge({ intent: 'unit', project: p.id })} className="whitespace-nowrap rounded-full border border-white/20 px-4 py-2 text-[13px] font-medium transition hover:bg-white hover:text-black">{L(u.request)}</button>);

  return (
    <>
      <section className="bg-black">
        <div className={cx(WRAP, 'pb-10 pt-[calc(7.5rem+env(safe-area-inset-top,0px))]')}>
          <nav aria-label="Breadcrumb" className="caption flex flex-wrap items-center gap-2 text-g-25">
            <Link to={ROUTES.residences} className="hover:text-white">{t.nav.residences}</Link><span className="text-g-50">/</span>
            <Link to={projectPath(p)} className="hover:text-white" dir="ltr">{p.name}</Link><span className="text-g-50">/</span>
            <span aria-current="page" className="text-white">{L(u.title)}</span>
          </nav>
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 className={cx('font-display text-[clamp(2.24rem,4.2vw,3.78rem)] leading-[0.96] lg:col-span-7', lang === 'en' ? 'tracking-brand' : 'leading-[1.2]')}>
              <span className="block">{L(u.title)}</span><span dir="ltr" className="block text-g-50 rtl:text-end">{p.name}</span>
            </h1>
            <div className="lg:col-span-5">
              <p className="text-g-25">{L(u.lead)}</p>
              {table?.sample && <p className="mt-3 flex items-center gap-2 text-[13px] text-g-50"><span className="h-2 w-2 rounded-full border border-white/60" />{L(u.sample)}</p>}
            </div>
          </div>
        </div>
      </section>

      {table ? (
        <section aria-label={L(u.title)} className="bg-black">
          <div className={WRAP}>
            <div className="flex flex-col gap-5 border-y border-white/10 py-5 lg:flex-row lg:items-center lg:justify-between">
              <Segmented
                layoutId="unit-type" label={L(u.cols.type)} value={type} onChange={setType}
                options={[{ value: 'all', label: L(u.allTypes) }, ...types.map((ty) => ({ value: ty, label: L(u.types[ty]) }))]}
              />
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex min-w-[220px] flex-col gap-1.5">
                  <span className="text-[13px] text-g-25">{L(u.maxBudget)}: <b dir="ltr" className="text-white">{max >= 50 ? L(u.any) : `EGP ${max}M`}</b></span>
                  <input type="range" min="10" max="50" step="5" value={max} onChange={(e) => setMax(+e.target.value)} className="accent-white" />
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                  <input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} className="h-4 w-4 accent-white" />
                  {L(u.hideSold)}
                </label>
              </div>
            </div>
            <p role="status" className="py-5 text-[14px] font-medium">{L(u.count(rows.length))}</p>

            {rows.length === 0 ? (
              <p className="rounded-2xl border border-white/10 p-10 text-center text-g-25">{L(u.none)}</p>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[860px] border-collapse text-[15px]">
                    <thead>
                      <tr className="border-b-2 border-white text-start">
                        {['type', 'beds', 'area', 'outdoor', 'price', 'availability'].map((c) => <th key={c} scope="col" className="caption py-3.5 pe-4 text-start font-medium text-g-50">{L(u.cols[c])}</th>)}
                        <th scope="col"><span className="sr-only">{L(u.request)}</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const sold = r.availability === 'sold';
                        return (
                          <tr key={r.id} className={cx('border-b border-white/10', sold && 'text-g-50')}>
                            <td className="py-5 pe-4"><b className="block font-display text-lg">{L(u.typeOne[r.type])}</b><span className="text-[13px] text-g-50">{L(r.variant)}</span></td>
                            <td className="py-5 pe-4 tabular-nums">{r.beds}</td>
                            <td className="py-5 pe-4 tabular-nums" dir="ltr">{r.area} m²</td>
                            <td className="py-5 pe-4">{L(r.outdoor)}</td>
                            <td className="py-5 pe-4" dir="ltr"><b className={cx('block tabular-nums rtl:text-end', sold && 'font-normal line-through')}>{egp(r.price)}</b></td>
                            <td className="py-5 pe-4"><span className={chip(r.availability)}>{L(u.availability[r.availability])}</span></td>
                            <td className="py-5 text-end">{action(r)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <ul className="grid gap-3 md:hidden">
                  {rows.map((r) => (
                    <li key={r.id} className="rounded-[14px] border border-white/10 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div><b className="block font-display text-lg">{L(u.typeOne[r.type])}</b><span className="text-[13px] text-g-50">{L(r.variant)}</span></div>
                        <span className={chip(r.availability)}>{L(u.availability[r.availability])}</span>
                      </div>
                      <dl className="my-4 grid grid-cols-2 gap-3 text-[14px]">
                        <div><dt className="text-[12px] text-g-50">{L(u.cols.beds)}</dt><dd className="font-medium">{r.beds}</dd></div>
                        <div><dt className="text-[12px] text-g-50">{L(u.cols.area)}</dt><dd className="font-medium" dir="ltr">{r.area} m²</dd></div>
                        <div><dt className="text-[12px] text-g-50">{L(u.cols.outdoor)}</dt><dd className="font-medium">{L(r.outdoor)}</dd></div>
                        <div><dt className="text-[12px] text-g-50">{L(u.cols.price)}</dt><dd className="font-medium" dir="ltr">{egp(r.price)}</dd></div>
                      </dl>
                      {action(r)}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="py-6 text-xs text-g-50">{L(u.note)}</p>
          </div>
        </section>
      ) : (
        <section className="bg-black">
          <div className={cx(WRAP, 'pb-14 md:pb-16')}>
            <div className="mb-10 flex gap-4 rounded-[14px] border-s-2 border-white bg-white/[0.04] p-5">
              <div>
                <h2 className="font-display text-xl">{L(u.pending.title)}</h2>
                <p className="mt-1.5 max-w-[70ch] text-sm text-g-25">{L(u.pending.text)}</p>
              </div>
            </div>
            <UnitInspector
              p={p}
              onBrochure={() => openConcierge({ intent: 'brochure', project: p.id })}
              onEnquire={() => openConcierge({ intent: 'unit', project: p.id })}
            />
          </div>
        </section>
      )}

      {plan && <PaymentPlan plan={plan} />}

      <CtaStrip title={L(u.found)} text={L(u.foundText)}>
        <Elastic type="button" onClick={() => openConcierge({ intent: 'unit', project: p.id })} className={BTN_LIGHT}>{L(u.request)}</Elastic>
        <Elastic type="button" onClick={() => openConcierge({ intent: 'brochure', project: p.id })} className={BTN_GHOST}><Download size={16} /> {L(u.brochure)}</Elastic>
      </CtaStrip>
    </>
  );
}
