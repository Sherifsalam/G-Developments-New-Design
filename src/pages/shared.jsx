/** Building blocks shared by the inner pages (pages/*.jsx). */
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  BTN_LIGHT, Caption, EASE, Link, Photo, ROUTES, cx, inputCls, useLang, useRouter, useTitle,
} from '../GDevelopments.jsx';

export const WRAP = 'mx-auto max-w-[1320px] px-4 sm:px-6';
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Compact select for filter bars (inputCls is full-width).
export const selectCls = cx(inputCls.replace('w-full ', ''), 'w-auto min-w-[11rem] py-2.5');
// Card grid: separate bordered tiles, so nothing shows through while tiles animate in.
export const TILE_GRID = 'grid gap-3';
export const TILE = 'rounded-[6px] border border-white/10 bg-black';

export function PageHero({ eyebrow, title, subtitle, text, image, children, tall = false }) {
  const { lang } = useLang();
  return (
    <section className="relative isolate overflow-hidden bg-black">
      {image && (
        <>
          <div className="absolute inset-0 -z-10 opacity-70"><Photo src={image} alt="" eager /></div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.35)_45%,#000_100%)]" />
        </>
      )}
      <div className={cx(WRAP, 'flex flex-col justify-end pb-10 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] md:pb-14', image ? (tall ? 'min-h-[72svh]' : 'min-h-[56svh]') : 'min-h-[40svh]')}>
        <motion.div initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE }}>
          {typeof eyebrow === 'string' ? <Caption>G Developments | {eyebrow}</Caption> : eyebrow}
          <h1 className={cx('mt-5 font-display text-[clamp(2.24rem,4.34vw,3.84rem)] leading-[0.96] [text-wrap:balance]', lang === 'ar' ? 'leading-[1.2]' : 'tracking-brand')}>
            <span className="block">{title}</span>
            {subtitle && <span className="block text-g-50">{subtitle}</span>}
          </h1>
          {text && <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-g-25 md:text-base">{text}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export function Breadcrumb({ items, className = '' }) {
  const { t } = useLang();
  const all = [{ to: ROUTES.home, label: t.nav.home }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="caption flex flex-wrap items-center gap-2 text-g-25">
        {all.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-g-50">/</span>}
            {it.to ? <Link to={it.to} className="transition hover:text-white">{it.label}</Link> : <span aria-current="page" className="text-white">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Tab row linking sibling pages (About sub-pages, Residences / Latest launches). */
export function SectionNav({ label, items }) {
  const { path } = useRouter();
  return (
    <nav aria-label={label} className="border-b border-white/10 bg-black">
      <div className={cx(WRAP, 'no-scrollbar flex gap-7 overflow-x-auto')}>
        {items.map((it) => {
          const on = it.match ? it.match(path) : path === it.to;
          return (
            <Link
              key={it.to} to={it.to} aria-current={on ? 'page' : undefined}
              className={cx('shrink-0 whitespace-nowrap border-b-2 py-4 text-[14px] transition-colors', on ? 'border-white font-medium text-white' : 'border-transparent text-g-50 hover:text-white')}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Bold title with a grey subtitle (the brand's heading pair), sized for in-page sections. */
export function SectionTitle({ id, title, subtitle, className = '', as: Tag = 'h2' }) {
  const { lang } = useLang();
  return (
    <Tag id={id} className={cx('font-display text-[clamp(1.72rem,3.12vw,2.65rem)] leading-[1.02] [text-wrap:balance]', lang === 'en' ? 'tracking-tightish' : 'leading-[1.25]', className)}>
      <span className="block">{title}</span>
      {subtitle && <span className="block text-g-50">{subtitle}</span>}
    </Tag>
  );
}

export function RiseItem({ index = 0, className = '', children, as = 'li' }) {
  const Tag = motion[as];
  const still = useReducedMotion();
  if (still) return <Tag className={cx('min-w-0', className)}>{children}</Tag>;
  return (
    <Tag
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1, ease: EASE, delay: (index % 4) * 0.07 }}
      className={cx('min-w-0', className)}
    >
      {children}
    </Tag>
  );
}

export function formatDate(iso, lang) {
  const [y, m, d] = iso.split('-').map(Number);
  const opts = d ? { day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', { ...opts, timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d || 1));
}

export function NotFound() {
  const { t } = useLang();
  const n = t.pages.notFound;
  useTitle(n.title);
  return (
    <PageHero eyebrow="404" title={n.title} text={n.text}>
      <Link to={ROUTES.home} className={cx(BTN_LIGHT, 'mt-8 inline-flex items-center gap-2')}>
        {n.home} <ArrowRight size={16} className="rtl:rotate-180" />
      </Link>
    </PageHero>
  );
}

/** A dark band with a line of copy and one or two actions. */
export function CtaStrip({ title, text, children }) {
  return (
    <section className="border-t border-white/10 bg-black">
      <div className={cx(WRAP, 'flex flex-col gap-6 py-11 md:flex-row md:items-end md:justify-between md:py-16')}>
        <div>
          <SectionTitle title={title} />
          {text && <p className="mt-3 max-w-[52ch] text-g-25">{text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">{children}</div>
      </div>
    </section>
  );
}
