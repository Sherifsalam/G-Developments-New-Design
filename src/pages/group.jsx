/**
 * G Group section.
 *   /g-group          hero with the company list, sector-filtered ecosystem, value chain
 *   /g-group/:slug    one company: split lockup, facts, capabilities, properties, projects, siblings
 *
 * Companies without a published profile (`verified` unset) show a short "profile to follow" note
 * instead of invented history or figures.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ArchPlate from '../ArchPlate.jsx';
import {
  BTN_GHOST, BTN_LIGHT, Caption, EASE, Link, Photo, ROUTES, ReelCard, Segmented, cx, entityPath, useLang, useLinkTo,
  useTitle,
} from '../GDevelopments.jsx';
import { Elastic } from '../elastic.jsx';
import { GROUP_COMPANIES, PROJECTS } from '../content.js';
import { GROUP, UI } from '../content-pages.js';
import { projectImages } from '../media.js';
import {
  Breadcrumb, NotFound, RiseItem, SectionTitle, WRAP,
} from './shared.jsx';

/** The brand's split lockup: the mark on one side, the sector on the other. */
function CompanyTile({ c, dim = false, compact = false }) {
  const { L, lang } = useLang();
  return (
    <Link
      to={entityPath(c)} aria-disabled={dim || undefined}
      className={cx(
        'group flex h-full flex-col border-b border-e border-white/15 p-6 transition-[background-color,opacity] duration-500 md:p-7',
        compact ? 'min-h-[190px]' : 'min-h-[260px]',
        c.core ? 'bg-white text-black hover:bg-g-25' : 'hover:bg-white/[0.05]',
        dim && 'opacity-25',
      )}
    >
      <span className="flex items-start justify-between gap-4">
        <span className="latin-display text-2xl leading-none">{c.mark}</span>
        <span className={cx('max-w-[16ch] text-end text-[12.5px] leading-snug', c.core ? 'text-g-75' : 'text-g-50')}>{L(c.kind)}</span>
      </span>
      <span dir="ltr" className={cx('latin-display mt-auto pt-10 text-[clamp(1.38rem,2.04vw,1.87rem)] leading-none tracking-brand rtl:text-end', lang === 'ar' && 'block')}>{c.name}</span>
      {!compact && <span className={cx('mt-3 text-[14px] leading-relaxed', c.core ? 'text-g-75' : 'text-g-25')}>{L(c.text)}</span>}
    </Link>
  );
}

/* ───────── /g-group ───────── */

export function GroupPage() {
  const { t, L, lang } = useLang();
  const g = GROUP;
  useTitle(t.nav.group);
  const linkTo = useLinkTo();
  const [hl, setHl] = useState(-1);
  const [sector, setSector] = useState('all');
  const count = (id) => (id === 'all' ? GROUP_COMPANIES.length : GROUP_COMPANIES.filter((c) => c.sector === id).length);

  return (
    <>
      <section aria-labelledby="group-title" className="relative isolate flex min-h-[64svh] flex-col overflow-hidden bg-black">
        <div className={cx(WRAP, 'relative z-[2] flex w-full items-center justify-between pt-[calc(6.5rem+env(safe-area-inset-top,0px))]')}>
          <Breadcrumb items={[{ label: t.nav.group }]} />
        </div>
        <div className={cx(WRAP, 'relative z-[2] mt-auto grid w-full gap-10 pb-12 pt-16 md:pb-16 lg:grid-cols-12 lg:items-end')}>
          <motion.div className="lg:col-span-7" initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE }}>
            <Caption>G Developments | {t.nav.group}</Caption>
            <h1 id="group-title" className={cx('mt-5 font-display text-[clamp(2.41rem,4.34vw,3.97rem)] leading-[0.95]', lang === 'en' ? 'tracking-brand' : 'leading-[1.2]')}>
              <span className="block">{L(g.hero.title)}</span><span className="block text-g-50">{L(g.hero.subtitle)}</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-g-25 md:text-base">{L(g.hero.text)}</p>
          </motion.div>
          <nav aria-label={t.nav.group} className="lg:col-span-5">
            <ol className="grid grid-cols-2 gap-x-6 border-t border-white/15">
              {GROUP_COMPANIES.map((c, i) => (
                <li key={c.id}>
                  <Link
                    to={entityPath(c)} onMouseEnter={() => setHl(i)} onMouseLeave={() => setHl(-1)} onFocus={() => setHl(i)} onBlur={() => setHl(-1)}
                    className={cx('flex items-center gap-3 border-b border-white/10 py-3 text-[14.5px] transition-[color,padding] duration-300', hl === i ? 'ps-1.5 text-white' : 'text-g-25 hover:text-white')}
                  >
                    <span className={cx('h-1.5 w-1.5 shrink-0 rounded-full transition-all', hl === i ? 'bg-white shadow-[0_0_12px_#fff]' : 'bg-white/30')} />
                    <span dir="ltr">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <section aria-label={L(g.sectors[0].name)} className="bg-black">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <Segmented
            layoutId="group-sector" label={L(g.sectors[0].name)} value={sector} onChange={setSector}
            options={g.sectors.map((s) => ({ value: s.id, label: <span>{L(s.name)} <span className="opacity-50 tabular-nums">{count(s.id)}</span></span> }))}
          />
          <ul className="mt-8 grid border-s border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {GROUP_COMPANIES.map((c, i) => (
              <RiseItem key={c.id} index={i}><CompanyTile c={c} dim={sector !== 'all' && c.sector !== sector} /></RiseItem>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="chain-title" className="border-t border-white/10 bg-[#0a0a0a]">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <SectionTitle id="chain-title" title={L(g.chain.title)} subtitle={L(g.chain.subtitle)} />
          <ol className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {g.chain.steps.map((s, i) => (
              <RiseItem key={s.id} index={i} className="relative border-t-2 border-white pe-6 pt-6">
                <span className="absolute -top-[7px] start-0 h-3 w-3 rounded-full bg-white" />
                <span dir="ltr" className="caption text-g-50 tabular-nums">{String(i + 1).padStart(2, '0')} · {L(s.step)}</span>
                <h3 dir="ltr" className="mt-3 font-display text-lg leading-snug rtl:text-end">{s.who}</h3>
                <p className="mt-1.5 text-[14px] text-g-25">{L(s.text)}</p>
              </RiseItem>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="partners-title" className="border-t border-white/10 bg-black">
        <div className={cx(WRAP, 'grid items-center gap-10 py-10 md:py-16 lg:grid-cols-2')}>
          <div>
            <SectionTitle id="partners-title" title={L(g.partners.title)} subtitle={L(g.partners.subtitle)} />
            <p className="mt-5 max-w-[48ch] text-g-25">{L(g.partners.text)}</p>
            <Elastic as="a" {...linkTo(ROUTES.contact)} className={cx(BTN_LIGHT, 'mt-8 inline-flex')}>{L(g.partners.cta)} <ArrowRight size={16} className="rtl:rotate-180" /></Elastic>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[6px]"><ArchPlate variant="arches" /></div>
        </div>
      </section>
    </>
  );
}

/* ───────── /g-group/:slug ───────── */

export function EntityPage({ slug }) {
  const { t, L, lang } = useLang();
  const e = GROUP.entity;
  const c = GROUP_COMPANIES.find((x) => x.slug === slug);
  useTitle(c ? c.name : t.pages.notFound.title);
  const linkTo = useLinkTo();
  if (!c) return <NotFound />;
  const projects = (c.projects || []).map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean);
  const cover = projects[0] ? projectImages(projects[0].id).cover : null;
  const others = GROUP_COMPANIES.filter((x) => x.id !== c.id).slice(0, 3);
  const facts = c.facts || [];

  return (
    <>
      <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-black">
        <div className="absolute inset-0 -z-10 opacity-60">{cover ? <Photo src={cover} alt="" eager /> : <ArchPlate variant="fins" />}</div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.3)_45%,#000_100%)]" />
        <div className={cx(WRAP, 'w-full pb-12 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] md:pb-16')}>
          <motion.div initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE }}>
            <Breadcrumb items={[{ to: ROUTES.group, label: t.nav.group }, { label: c.name }]} />
            <div dir="ltr" className="latin-display mt-10 flex max-w-md items-baseline justify-between border-b border-white/25 pb-3 text-xl tracking-tightish">
              <span>G Group</span><span>{c.name}</span>
            </div>
            <h1 dir="ltr" className="latin-display mt-6 text-[clamp(2.58rem,5.58vw,4.96rem)] leading-[0.9] tracking-brand rtl:text-end">{c.name}</h1>
            <p className="mt-6 max-w-[54ch] text-[clamp(0.9rem,1.38vw,1.2rem)] leading-relaxed text-g-25">{L(c.text)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {c.website && (
                <Elastic as="a" href={c.website} target="_blank" rel="noopener noreferrer" className={BTN_LIGHT}>{L(e.visit)} <ArrowUpRight size={16} /></Elastic>
              )}
              <Elastic as="a" {...linkTo(ROUTES.contact)} className={c.website ? BTN_GHOST : BTN_LIGHT}>{L(e.contact)} <span dir="ltr">{c.name}</span></Elastic>
            </div>
          </motion.div>
        </div>
      </section>

      <dl className={cx('grid border-y border-white/10 bg-black sm:grid-cols-2', facts.length > 2 && 'lg:grid-cols-4')}>
        <div className="px-4 py-6 sm:px-6">
          <dt className="caption text-g-50">{L(e.sector)}</dt>
          <dd className="mt-1.5 text-lg font-medium">{L(c.kind)}</dd>
        </div>
        {facts.map((f) => (
          <div key={f.label.en} className="border-t border-white/10 px-4 py-6 sm:border-s sm:px-6 lg:border-t-0">
            <dt className="caption text-g-50">{L(f.label)}</dt>
            <dd className="mt-1.5 text-lg font-medium">{L(f.value)}</dd>
          </div>
        ))}
      </dl>

      {!c.verified && (
        <section aria-labelledby="ent-pending" className="border-b border-white/10 bg-black">
          <div className={cx(WRAP, 'py-10 md:py-14')}>
            <div className="max-w-[62ch] rounded-[6px] border border-dashed border-white/20 p-6 md:p-8">
              <h2 id="ent-pending" className={cx('font-display text-xl', lang === 'en' && 'tracking-tightish')}>{L(e.pendingTitle)}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-g-25">{L(e.pendingText)}</p>
            </div>
          </div>
        </section>
      )}

      {c.properties && (
        <section aria-labelledby="ent-props" className="bg-black">
          <div className={cx(WRAP, 'py-10 md:py-16')}>
            <SectionTitle id="ent-props" title={L(e.properties)} subtitle={c.name} />
            <ul className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {c.properties.map((pr, i) => (
                <RiseItem key={pr.name} index={i} className="flex flex-col border-t border-white/15 pt-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span dir="ltr" className="caption text-g-50 tabular-nums">{pr.year}</span>
                    {pr.rooms && <span dir="ltr" className="caption text-g-50">{L(e.rooms(pr.rooms))}</span>}
                  </div>
                  <h3 dir="ltr" className="latin-display mt-3 text-[clamp(1.2rem,1.75vw,1.5rem)] leading-tight tracking-tightish rtl:text-end">{pr.name}</h3>
                  <p className="mt-1.5 text-[13px] text-g-50">{L(pr.where)}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-g-25">{L(pr.note)}</p>
                </RiseItem>
              ))}
            </ul>
          </div>
        </section>
      )}

      {c.capabilities && (
        <section aria-labelledby="cap-title" className="bg-black">
          <div className={cx(WRAP, 'grid gap-10 py-10 md:py-16 lg:grid-cols-12')}>
            <SectionTitle id="cap-title" className="lg:col-span-4" title={L(e.capabilities)} subtitle={c.name} />
            <ul className="lg:col-span-8">
              {c.capabilities.map((cap, i) => (
                <RiseItem key={cap.title.en} index={i} className="grid gap-2 border-t border-white/15 py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-8">
                  <h3 className={cx('font-display text-xl', lang === 'en' && 'tracking-tightish')}>{L(cap.title)}</h3>
                  <p className="text-g-25">{L(cap.text)}</p>
                </RiseItem>
              ))}
            </ul>
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section aria-labelledby="ent-projects" className="border-t border-white/10 bg-black">
          <div className={cx(WRAP, 'py-10 md:py-16')}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionTitle id="ent-projects" title={L(e.projects)} />
              <Link to={ROUTES.residences} className="btn-lux inline-flex items-center gap-2 border-b border-white/30 pb-1 hover:border-white">{t.pages.project.all} <ArrowRight size={15} className="rtl:rotate-180" /></Link>
            </div>
            <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => <RiseItem key={p.id} index={i}><ReelCard p={p} index={PROJECTS.indexOf(p)} /></RiseItem>)}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="ent-others" className="border-t border-white/10 bg-[#0a0a0a]">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <SectionTitle id="ent-others" title={L(e.others)} />
          <ul className="mt-8 grid border-s border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => <li key={o.id}><CompanyTile c={o} compact /></li>)}
            <li>
              <Link to={ROUTES.group} className="flex h-full min-h-[190px] flex-col border-b border-e border-white/15 p-6 transition-colors hover:bg-white/[0.05] md:p-7">
                <span className="latin-display text-2xl">+{GROUP_COMPANIES.length - 1 - others.length}</span>
                <span className="mt-auto pt-10 font-display text-[clamp(1.38rem,2.04vw,1.87rem)] leading-none">{L(e.viewAll)}</span>
                <span className="mt-3 text-[14px] text-g-25">{L(UI.menu.group)}</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
