/**
 * About section.
 *   /about                 overview: intro, key numbers, index of sub-pages, approach, G Group
 *   /about/story           70-year timeline with a year bar that follows the scroll
 *   /about/vision          vision, mission, values, why families choose us
 *   /about/sustainability  four commitments and initiatives
 * (/about/leadership lives in leadership.jsx.)
 */
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ArchPlate from '../ArchPlate.jsx';
import {
  BTN_GHOST, BTN_LIGHT, CtaBand, Link, Photo, ROUTES, Reveal, cx, projectPath, useLang, useLinkTo, useTitle,
} from '../GDevelopments.jsx';
import { Elastic } from '../elastic.jsx';
import { APPROACH, PROJECTS } from '../content.js';
import {
  ABOUT, ABOUT_PAGES, STORY, SUSTAINABILITY, UI, VISION,
} from '../content-pages.js';
import { HQ_OFFICE, mediaUrl } from '../media.js';
import {
  CtaStrip, PageHero, RiseItem, SectionNav, SectionTitle, TILE, TILE_GRID, WRAP,
} from './shared.jsx';

export function AboutTabs() {
  const { t, L } = useLang();
  return (
    <SectionNav
      label={t.nav.about}
      items={ABOUT_PAGES.map((pg) => ({
        to: ROUTES[pg.key],
        label: L(pg.title),
        match: pg.key === 'leadership' ? (path) => [ROUTES.leadership, ROUTES.board, ROUTES.executive].includes(path) : undefined,
      }))}
    />
  );
}

/* ───────── /about ───────── */

export function AboutPage({ openConcierge }) {
  const { t, L, lang } = useLang();
  useTitle(t.nav.about);
  const linkTo = useLinkTo();
  const a = ABOUT;
  return (
    <>
      <PageHero eyebrow={t.nav.about} title={L(a.hero.title)} subtitle={L(a.hero.subtitle)} text={L(a.hero.text)} image={mediaUrl(HQ_OFFICE.image)} tall />
      <AboutTabs />

      <section aria-labelledby="about-intro" className="bg-black">
        <div className={cx(WRAP, 'grid gap-10 py-10 md:py-16 lg:grid-cols-12')}>
          <Reveal className="lg:col-span-5"><SectionTitle id="about-intro" title={L(a.intro.title)} subtitle={L(a.intro.subtitle)} /></Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <p className="text-[clamp(0.99rem,1.56vw,1.38rem)] font-light leading-snug">{L(a.intro.lead)}</p>
            <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-g-25">{L(a.intro.body)}</p>
          </Reveal>
        </div>
        <dl className={cx(WRAP, 'grid grid-cols-2 md:grid-cols-4')}>
          {a.stats.map((s, i) => (
            <Reveal key={s.value} delay={i * 0.06} className={cx('flex min-w-0 flex-col border-t border-white/10 py-8 pe-4', i % 2 === 1 && 'border-s border-white/10 ps-4', i === 2 && 'md:border-s md:ps-4')}>
              <dt className="order-2 mt-2 text-[13px] leading-snug text-g-50">{L(s.label)}</dt>
              <dd dir="ltr" className="font-display text-[clamp(1.72rem,3.12vw,2.81rem)] tabular-nums tracking-tightish rtl:text-end">{s.value}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section aria-labelledby="about-index" className="bg-black">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <SectionTitle id="about-index" title={L(a.index.title)} subtitle={L(a.index.subtitle)} />
          <ul className="mt-8 border-b border-white/10">
            {ABOUT_PAGES.slice(1).map((pg, i) => (
              <RiseItem key={pg.key} index={i} className="border-t border-white/10">
                <Link to={ROUTES[pg.key]} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 py-7 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_180px_auto] md:gap-10">
                  <span className={cx('font-display text-[clamp(1.38rem,2.38vw,2.21rem)] leading-none transition-colors group-hover:text-g-50', lang === 'en' && 'tracking-tightish')}>{L(pg.title)}</span>
                  <span className="hidden text-[15px] text-g-25 md:block">{L(pg.text)}</span>
                  <span className="relative hidden h-24 overflow-hidden rounded-[4px] opacity-70 transition-opacity group-hover:opacity-100 md:block"><ArchPlate variant={pg.plate} /></span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-colors group-hover:border-white group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight size={18} className="rtl:-scale-x-100" />
                  </span>
                </Link>
              </RiseItem>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="border-t border-white/10 bg-[#0a0a0a]">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <SectionTitle id="approach-title" title={t.pages.about.approach} subtitle={`${t.pages.about.approachTitle} ${t.pages.about.approachSubtitle}`} />
          <ol className={cx(TILE_GRID, 'mt-8 sm:grid-cols-2 lg:grid-cols-4')}>
            {APPROACH.map((step, i) => (
              <RiseItem key={step.id} index={i} className={cx(TILE, 'flex flex-col bg-transparent p-6 md:p-8')}>
                <span dir="ltr" className="font-display text-[clamp(2.06rem,3.12vw,2.81rem)] leading-none text-g-75 tabular-nums rtl:text-end">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={cx('mt-10 font-display text-2xl', lang === 'en' && 'tracking-tightish')}>{L(step.title)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-g-25">{L(step.text)}</p>
              </RiseItem>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="about-group" className="border-t border-white/10 bg-black">
        <div className={cx(WRAP, 'grid items-center gap-10 py-10 md:py-16 lg:grid-cols-2')}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]"><ArchPlate variant="fins" /></div>
          <div>
            <SectionTitle id="about-group" title={L(a.group.title)} subtitle={L(a.group.subtitle)} />
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-g-25">{L(a.group.text)}</p>
            <Elastic as="a" {...linkTo(ROUTES.group)} className={cx(BTN_LIGHT, 'mt-8 inline-flex')}>{L(a.group.cta)} <ArrowRight size={16} className="rtl:rotate-180" /></Elastic>
          </div>
        </div>
      </section>

      <CtaBand onConcierge={() => openConcierge({ intent: 'meeting' })} />
    </>
  );
}

/* ───────── /about/story ───────── */

export function StoryPage() {
  const { L, lang } = useLang();
  const s = STORY;
  useTitle(L(ABOUT_PAGES[1].title));
  const linkTo = useLinkTo();
  const [active, setActive] = useState(s.milestones[0].id);
  const refs = useRef({});
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const yearOf = (m) => (typeof m.year === 'string' ? m.year : L(m.year));

  return (
    <>
      <PageHero eyebrow={L(ABOUT_PAGES[1].title)} title={L(s.hero.title)} subtitle={L(s.hero.subtitle)} image={mediaUrl('projects/gallery/01KJVYY3DHAQRQGA7DNP76RZYZ.webp')} />
      <AboutTabs />

      <section className="bg-black">
        <div className={cx(WRAP, 'py-11 md:py-16')}>
          <p className="max-w-[46ch] text-[clamp(1.12rem,1.84vw,1.56rem)] font-light leading-snug">{L(s.hero.text)}</p>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="border-t border-white/10 bg-black">
        <div className={cx(WRAP, 'py-11 md:py-16')}>
          <h2 id="principles-title" className="caption text-g-50">{L(s.principles.title)}</h2>
          <ol className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
            {s.principles.items.map((it, i) => (
              <RiseItem key={it.id} index={i} className="border-t border-white/20 pt-6">
                <span dir="ltr" className="caption tabular-nums text-g-50">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={cx('mt-4 font-display text-[clamp(1.3rem,1.9vw,1.65rem)] leading-tight', lang === 'en' && 'tracking-tightish')}>{L(it.title)}</h3>
                <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-g-25">{L(it.text)}</p>
              </RiseItem>
            ))}
          </ol>
        </div>
      </section>

      <nav aria-label={L(ABOUT_PAGES[1].title)} className="sticky top-[calc(4.75rem+env(safe-area-inset-top,0px))] [html[data-nav-hidden=true]_&]:top-0 transition-[top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-40 border-y border-white/10 bg-black/85 backdrop-blur-xl max-md:bg-black/95 max-md:backdrop-blur-none">
        <div className={cx(WRAP, 'no-scrollbar flex overflow-x-auto')}>
          {s.milestones.map((m) => (
            <a
              key={m.id} href={`#y-${m.id}`} aria-current={active === m.id ? 'true' : undefined}
              className={cx('shrink-0 border-b-2 px-4 py-4 font-display text-[15px] tabular-nums transition-colors first:ps-0', active === m.id ? 'border-white text-white' : 'border-transparent text-g-50 hover:text-white')}
            >
              {yearOf(m)}
            </a>
          ))}
        </div>
      </nav>

      <ol className={cx(WRAP, 'bg-black')}>
        {s.milestones.map((m) => {
          const p = PROJECTS.find((x) => x.id === m.project);
          return (
            <li
              key={m.id} id={`y-${m.id}`} data-id={m.id} ref={(el) => { refs.current[m.id] = el; }}
              className="grid scroll-mt-40 gap-6 border-b border-white/10 py-12 last:border-b-0 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-12 md:py-16"
            >
              <p dir="ltr" className="font-display text-[clamp(2.92rem,4.34vw,3.97rem)] leading-[0.9] tracking-brand rtl:text-end">
                {yearOf(m)}<small className="caption mt-3 block text-g-50">{L(m.tag)}</small>
              </p>
              <Reveal>
                <h2 className={cx('font-display text-[clamp(1.38rem,2.04vw,1.87rem)] leading-tight', lang === 'en' && 'tracking-tightish')}>{L(m.title)}</h2>
                <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-g-25">{L(m.text)}</p>
                {p && (
                  <Link to={projectPath(p)} className="btn-lux mt-6 inline-flex items-center gap-2 border-b border-white/30 pb-1 transition-colors hover:border-white">
                    <span dir="ltr">{p.name}</span> <ArrowRight size={14} className="rtl:rotate-180" />
                  </Link>
                )}
              </Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-g-ink">
                {m.image ? <Photo src={mediaUrl(m.image)} alt={L(m.title)} /> : <ArchPlate variant={m.plate} />}
              </div>
            </li>
          );
        })}
      </ol>

      <CtaStrip title={L(s.next)}>
        <Elastic as="a" {...linkTo(ROUTES.residences)} className={BTN_LIGHT}>{L(UI.viewCommunities)} <ArrowRight size={16} className="rtl:rotate-180" /></Elastic>
        <Elastic as="a" {...linkTo(ROUTES.leadership)} className={BTN_GHOST}>{L(ABOUT_PAGES[3].title)}</Elastic>
      </CtaStrip>
    </>
  );
}

/* ───────── /about/vision ───────── */

export function VisionPage({ openConcierge }) {
  const { L, lang } = useLang();
  const v = VISION;
  useTitle(L(ABOUT_PAGES[2].title));
  return (
    <>
      <PageHero eyebrow={L(ABOUT_PAGES[2].title)} title={L(v.hero.title)} subtitle={L(v.hero.subtitle)} />
      <AboutTabs />

      <section aria-labelledby="vision-title" className="bg-black">
        <div className={cx(WRAP, 'grid gap-10 py-10 md:py-16 lg:grid-cols-12')}>
          <div className="lg:col-span-5">
            <SectionTitle id="vision-title" title={L(v.vision.title)} subtitle={L(v.vision.subtitle)} />
            <div className="relative mt-8 aspect-square overflow-hidden rounded-[6px]"><Photo src={mediaUrl('projects/hero/01KK66Q194HMG6B2Q38198S5DJ.webp')} alt="" /></div>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <p className={cx('font-display text-[clamp(1.55rem,2.65vw,2.34rem)] leading-[1.15] [text-wrap:balance]', lang === 'en' ? 'tracking-tightish' : 'leading-[1.5]')}>“{L(v.vision.text)}”</p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="mission-title" className="border-y border-white/10 bg-white text-black">
        <div className={cx(WRAP, 'grid gap-8 py-10 md:py-16 lg:grid-cols-12')}>
          <h2 id="mission-title" className={cx('font-display text-[clamp(1.72rem,3.12vw,2.65rem)] leading-[1.02] lg:col-span-5', lang === 'en' && 'tracking-tightish')}>
            <span className="block">{L(v.mission.title)}</span><span className="block text-g-50">{L(v.mission.subtitle)}</span>
          </h2>
          <p className="text-[clamp(0.95rem,1.75vw,1.47rem)] leading-snug lg:col-span-6 lg:col-start-7">{L(v.mission.text)}</p>
        </div>
      </section>

      <section aria-labelledby="values-title" className="bg-black">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <SectionTitle id="values-title" title={L(v.values.title)} subtitle={L(v.values.subtitle)} />
          <ul className="mt-10 grid border-t-2 border-white sm:grid-cols-2 lg:grid-cols-5">
            {v.values.items.map((it, i) => (
              <RiseItem key={it.id} index={i} className="border-b border-white/10 py-7 pe-6 lg:border-b-0">
                <span dir="ltr" className="caption text-g-50 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-display text-2xl">{L(it.title)}</h3>
                <p className="mt-2 text-[15px] text-g-25">{L(it.text)}</p>
              </RiseItem>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="why-title" className="border-t border-white/10 bg-[#0a0a0a]">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <SectionTitle id="why-title" title={L(v.why.title)} />
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {v.why.items.map((it, i) => (
              <RiseItem key={it.id} index={i} className="border-t-2 border-white pt-6">
                <h3 className="font-display text-2xl">{L(it.title)}</h3>
                <p className="mt-2 text-[15px] text-g-25">{L(it.text)}</p>
              </RiseItem>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand onConcierge={() => openConcierge({ intent: 'meeting' })} />
    </>
  );
}

/* ───────── /about/sustainability ───────── */

export function SustainabilityPage({ openConcierge }) {
  const { L, lang } = useLang();
  const s = SUSTAINABILITY;
  useTitle(L(ABOUT_PAGES[4].title));
  return (
    <>
      <PageHero eyebrow={L(ABOUT_PAGES[4].title)} title={L(s.hero.title)} subtitle={L(s.hero.subtitle)} text={L(s.hero.text)} image={mediaUrl('projects/gallery/01KJVWVDXX2Y1GT5XH11KWWB33.webp')} tall />
      <AboutTabs />

      <section aria-labelledby="pillars-title" className="bg-black">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <SectionTitle id="pillars-title" title={L(s.pillars.title)} subtitle={L(s.pillars.subtitle)} />
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {s.pillars.items.map((it, i) => (
              <RiseItem key={it.id} index={i} className="border-t-2 border-white pt-6">
                <p className="caption text-g-50">{L(it.kicker)}</p>
                <h3 className={cx('mt-3 font-display text-2xl', lang === 'en' && 'tracking-tightish')}>{L(it.title)}</h3>
                <p className="mt-2 text-[15px] text-g-25">{L(it.text)}</p>
              </RiseItem>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="init-title" className="border-t border-white/10 bg-black">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <SectionTitle id="init-title" title={L(s.initiatives.title)} />
          <ul className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-3">
            {s.initiatives.items.map((it, i) => (
              <RiseItem key={it.id} index={i}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-g-ink">
                  {it.image ? <Photo src={mediaUrl(it.image)} alt="" /> : <ArchPlate variant={it.plate} />}
                </div>
                <h3 className="mt-5 font-display text-2xl">{L(it.title)}</h3>
                <p className="mt-2 text-[15px] text-g-25">{L(it.text)}</p>
              </RiseItem>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand onConcierge={() => openConcierge({ intent: 'meeting' })} />
    </>
  );
}
