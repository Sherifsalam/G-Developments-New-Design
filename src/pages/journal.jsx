/** /journal and /journal/:slug: news and launch notes. */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  EASE, Link, Photo, ROUTES, Segmented, cx, projectPath, useLang, useTitle,
} from '../GDevelopments.jsx';
import { JOURNAL, PROJECTS } from '../content.js';
import { mediaUrl, projectImages } from '../media.js';
import {
  NotFound, PageHero, RiseItem, WRAP, formatDate, selectCls,
} from './shared.jsx';

export function ArticleCard({ a }) {
  const { t, L, lang } = useLang();
  const j = t.pages.journal;
  return (
    <Link to={`${ROUTES.journal}/${a.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-g-ink">
        <div className="absolute inset-0 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]">
          <Photo src={mediaUrl(a.image)} alt="" plate={a.plate} />
        </div>
      </div>
      <p className="caption mt-5 text-g-50">{j.types[a.type]} · {formatDate(a.date, lang)}</p>
      <h3 className={cx('mt-2 font-display text-2xl leading-tight', lang === 'en' && 'tracking-tightish')}>{L(a.title)}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-g-25">{L(a.excerpt)}</p>
      <span className="btn-lux mt-5 inline-flex items-center gap-2 self-start border-b border-white/30 pb-1 transition-colors duration-500 group-hover:border-white">
        {j.read} <ArrowRight size={14} className="rtl:rotate-180" />
      </span>
    </Link>
  );
}

export function JournalPage() {
  const { t } = useLang();
  const j = t.pages.journal;
  useTitle(j.title);
  const [type, setType] = useState('all');
  const [order, setOrder] = useState('latest');
  const types = ['all', ...new Set(JOURNAL.map((a) => a.type))];
  const list = JOURNAL
    .filter((a) => type === 'all' || a.type === type)
    .sort((x, y) => (order === 'latest' ? y.date.localeCompare(x.date) : x.date.localeCompare(y.date)));
  return (
    <>
      <PageHero eyebrow={t.nav.journal} title={j.title} subtitle={j.subtitle} text={j.text} />
      <section aria-label={j.title} className="bg-black">
        <div className={cx(WRAP, 'pb-14 md:pb-16')}>
          <div className="flex flex-col gap-4 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
            <Segmented layoutId="journal-type" label={j.title} value={type} onChange={setType} options={types.map((v) => ({ value: v, label: j.types[v] }))} />
            <select aria-label={j.latest} value={order} onChange={(e) => setOrder(e.target.value)} className={selectCls}>
              <option value="latest">{j.latest}</option>
              <option value="oldest">{j.oldest}</option>
            </select>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => <RiseItem key={a.slug} index={i}><ArticleCard a={a} /></RiseItem>)}
          </ul>
        </div>
      </section>
    </>
  );
}

export function ArticlePage({ slug }) {
  const { t, L, lang } = useLang();
  const j = t.pages.journal;
  const a = JOURNAL.find((x) => x.slug === slug);
  useTitle(a ? L(a.title) : t.pages.notFound.title);
  if (!a) return <NotFound />;
  const project = PROJECTS.find((p) => p.id === a.project);
  const more = JOURNAL.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <>
      <article className="bg-black">
        <div className={cx(WRAP, 'pt-[calc(8rem+env(safe-area-inset-top,0px))]')}>
          <Link to={ROUTES.journal} className="caption inline-flex items-center gap-2 text-g-25 transition hover:text-white">
            <ArrowLeft size={14} className="rtl:rotate-180" /> {j.back}
          </Link>
          <motion.header initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE }} className="mt-10 max-w-4xl">
            <p className="caption text-g-50">{j.types[a.type]} · <time dateTime={a.date}>{formatDate(a.date, lang)}</time></p>
            <h1 className={cx('mt-4 font-display text-[clamp(1.89rem,3.78vw,3.36rem)] leading-[1] [text-wrap:balance]', lang === 'ar' ? 'leading-[1.25]' : 'tracking-brand')}>{L(a.title)}</h1>
            <p className="mt-6 max-w-[56ch] text-[clamp(0.95rem,1.47vw,1.24rem)] font-light leading-relaxed text-g-25">{L(a.excerpt)}</p>
          </motion.header>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[6px] bg-g-ink">
            <Photo src={mediaUrl(a.image)} alt={L(a.title)} plate={a.plate} eager />
          </div>
          <div className="grid gap-10 py-12 md:py-16 lg:grid-cols-12">
            <div className="space-y-6 text-[17px] leading-[1.75] text-g-25 lg:col-span-7">
              {a.body.map((para) => <p key={para.en}>{L(para)}</p>)}
            </div>
            {project && (
              <aside className="lg:col-span-4 lg:col-start-9">
                <Link to={projectPath(project)} className="group block rounded-[6px] border border-white/10 p-5 transition hover:border-white/40">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-g-ink">
                    <Photo src={projectImages(project.id).card} alt={project.name} plate={project.plate} />
                  </div>
                  <p className="caption mt-4 text-g-50">{t.regions[project.region]}</p>
                  <p dir="ltr" className="mt-1 font-display text-2xl tracking-brand rtl:text-end">{project.name}</p>
                  <span className="btn-lux mt-4 inline-flex items-center gap-2 border-b border-white/30 pb-1 group-hover:border-white">
                    {j.related} <ArrowUpRight size={14} className="rtl:-scale-x-100" />
                  </span>
                </Link>
              </aside>
            )}
          </div>
        </div>
      </article>
      <section aria-labelledby="more-articles" className="border-t border-white/10 bg-black">
        <div className={cx(WRAP, 'py-10 md:py-16')}>
          <h2 id="more-articles" className={cx('font-display text-[clamp(1.72rem,3.12vw,2.65rem)] leading-[1.02]', lang === 'en' && 'tracking-tightish')}>{j.title}</h2>
          <ul className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((m, i) => <RiseItem key={m.slug} index={i}><ArticleCard a={m} /></RiseItem>)}
          </ul>
        </div>
      </section>
    </>
  );
}
