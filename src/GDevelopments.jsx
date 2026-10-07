/**
 * G Developments — flagship homepage (v2: all-black, elastic, cinematic).
 *
 * Stack: React 18 · Tailwind CSS 3 · Framer Motion 11 · Lenis · WebGL · lucide-react.
 * Brand: G Developments guidelines — Process Black, 75/50/25% tints and white only; the supplied
 *        Helvetica (Bold for display, Helvetica Now Text for copy) and DIN Next Arabic, used as-is;
 *        the white logo and the brand's logo animation as the opening sequence.
 * Motion: elastic springs throughout (see elastic.jsx) and the ThreeUI Condensation effect by Meng To (MIT)
 *        behind the closing call to action.
 *
 * Routes: / (home), /residences, /residences/:slug, /about, /g-group, /journal, /journal/:slug, /contact.
 *        Pages other than home live in pages.jsx and load on demand.
 *
 * Props
 *   onLead(payload)    concierge, brochure, register-interest and newsletter submissions
 *                      (wire to Supabase `leads` / Salesforce web-to-lead)
 *   onNavigate(route)  routes the site does not contain yet (/privacy)
 *   initialLang        'en' | 'ar'
 *   showIntro          play the logo animation once per session (default true)
 */
import {
  Suspense, createContext, lazy, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import {
  AnimatePresence, MotionConfig, motion, useMotionTemplate, useMotionValue, useScroll,
  useSpring, useTransform,
} from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, Download, Flag, GraduationCap, Sparkles,
  Hotel, MessageCircle, Phone, Search, Sun, UtensilsCrossed, Waves, X,
} from 'lucide-react';
import ArchPlate from './ArchPlate.jsx';
import Intro from './Intro.jsx';
import Condensation from './effects/Condensation.jsx';
import { useStill } from './motion.js';
import {
  Elastic, ElasticString, GCursor, ElasticWordmark, SmoothScroll, useScrollLock, useSmoothScroll,
} from './elastic.jsx';
import logoWhite from './assets/g-developments-logo-white.png';
import {
  AMENITIES, CONTACT, COPY, GROUP_COMPANIES, PLANS, PROJECTS,
} from './content.js';
import { ABOUT_PAGES, RESIDENCES, UI } from './content-pages.js';
import {
  HERO_BANNER, PROJECT_MEDIA, amenityIcon, mediaUrl, projectImages,
} from './media.js';

/* ───────────────────────── i18n ───────────────────────── */

const LangContext = createContext({ lang: 'en', t: COPY.en, L: (o) => o?.en ?? o });
export const useLang = () => useContext(LangContext);

/* ───────────────────────── routing ───────────────────────── */

const RouterContext = createContext({ path: '/', navigate: () => {} });
export const useRouter = () => useContext(RouterContext);

export const ROUTES = {
  home: '/',
  residences: '/residences', launches: '/residences/latest-launches',
  about: '/about', story: '/about/story', vision: '/about/vision', leadership: '/about/leadership',
  board: '/about/board', executive: '/about/executive-team', sustainability: '/about/sustainability',
  group: '/g-group', journal: '/journal', contact: '/contact',
};
export const NAV = ['residences', 'about', 'group', 'journal', 'contact'];
export const projectPath = (p) => `${ROUTES.residences}/${p.slug}`;
export const unitsPath = (p) => `${projectPath(p)}/units`;
export const entityPath = (c) => `${ROUTES.group}/${c.slug}`;

// Paths used by thegdevelopments.com and the UI design board, so old links still land on the right page.
const ALIASES = {
  '/community': ROUTES.residences, '/about-us': ROUTES.about, '/contact-us': ROUTES.contact, '/media': ROUTES.journal,
  '/about-us/history': ROUTES.story, '/about/history': ROUTES.story, '/about-us/vision-mission': ROUTES.vision,
  '/about-us/board': ROUTES.board, '/about-us/executive-team': ROUTES.executive,
  '/about-us/sustainability': ROUTES.sustainability, '/sustainability': ROUTES.sustainability,
};
const ABOUT_SUB = { story: 'story', vision: 'vision', leadership: 'leadership', sustainability: 'sustainability' };

export function matchRoute(pathname) {
  let path = pathname.replace(/\/+$/, '').replace(/^\/(en|ar)(?=\/|$)/, '') || '/';
  path = path.replace(/^\/community(?=\/)/, ROUTES.residences);
  path = ALIASES[path] || path;
  const [, a, b, c, extra] = path.split('/');
  if (path === '/') return { name: 'home' };
  if (extra) return { name: 'notFound' };
  if (`/${a}` === ROUTES.residences) {
    if (!b) return { name: 'residences' };
    if (path === ROUTES.launches) return { name: 'launches' };
    if (!c) return { name: 'project', slug: b };
    return c === 'units' ? { name: 'units', slug: b } : { name: 'notFound' };
  }
  if (c) return { name: 'notFound' };
  if (`/${a}` === ROUTES.about) {
    if (!b) return { name: 'about' };
    if (b === 'board') return { name: 'leadership', anchor: 'board' };
    if (b === 'executive-team') return { name: 'leadership', anchor: 'executive' };
    return ABOUT_SUB[b] ? { name: ABOUT_SUB[b] } : { name: 'notFound' };
  }
  if (`/${a}` === ROUTES.group) return b ? { name: 'entity', slug: b } : { name: 'group' };
  if (`/${a}` === ROUTES.journal) return b ? { name: 'article', slug: b } : { name: 'journal' };
  if (!b && `/${a}` === ROUTES.contact) return { name: 'contact' };
  return { name: 'notFound' };
}

/** Second-level links for the header dropdowns, the mobile menu and the footer. */
export function useSubNav() {
  const { L } = useLang();
  return useMemo(() => ({
    residences: [
      { to: ROUTES.residences, label: L(UI.menu.residences) },
      ...PROJECTS.map((p) => ({ to: projectPath(p), label: p.name, latin: true })),
      { to: ROUTES.launches, label: L(RESIDENCES.tabs.launches), accent: true },
    ],
    about: ABOUT_PAGES.map((pg) => ({ to: ROUTES[pg.key], label: L(pg.title) })),
    group: [
      { to: ROUTES.group, label: L(UI.menu.group) },
      ...GROUP_COMPANIES.map((c) => ({ to: entityPath(c), label: c.name, latin: true })),
    ],
  }), [L]);
}

/** Returns props for an <a> (or `Elastic as="a"`) that navigates without reloading. */
export function useLinkTo() {
  const { navigate } = useRouter();
  return useCallback((to, after) => ({
    href: to,
    onClick: (e) => {
      after?.();
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to);
    },
  }), [navigate]);
}

export function Link({ to, onNavigate, ...props }) {
  const linkTo = useLinkTo();
  return <a {...props} {...linkTo(to, onNavigate)} />;
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | G Developments` : 'G Developments';
  }, [title]);
}

/* ───────────────────────── primitives ───────────────────────── */

export const cx = (...c) => c.filter(Boolean).join(' ');
const SPRING = { stiffness: 160, damping: 30, mass: 0.6 };
export const EASE = [0.22, 1, 0.36, 1];
export const BTN_LIGHT = 'btn-lux rounded-full bg-white px-7 py-4 font-medium text-black transition-colors duration-500 hover:bg-g-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
export const BTN_GHOST = 'btn-lux rounded-full border border-white/30 px-7 py-4 font-medium text-white transition-colors duration-500 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export function Caption({ children, className = '' }) {
  return <p className={cx('caption text-g-50', className)}>{children}</p>;
}

/** Brand heading: "Title bold / Subtitle bold-grey" (Brand Presentation System). */
export function SectionHeading({ eyebrow, title, subtitle, className = '', id }) {
  const { lang } = useLang();
  return (
    <div className={className}>
      <Caption>G Developments | {eyebrow}</Caption>
      <h2 id={id} className={cx(
        'mt-5 font-display text-[clamp(2.06rem,3.92vw,3.5rem)] leading-[0.98] text-white [text-wrap:balance]',
        lang === 'ar' ? 'leading-[1.25]' : 'tracking-brand',
      )}>
        <span className="block">{title}</span>
        <span className="block text-g-50">{subtitle}</span>
      </h2>
    </div>
  );
}

/** Masked line reveal: each word rises out of its own clip. */
function SplitReveal({ text, play = true, delay = 0, className = '' }) {
  const still = useStill();
  if (still) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '105%' }}
            animate={play ? { y: '0%' } : { y: '105%' }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Motion props for a scroll-in reveal, shared by every list and section that uses one.
 * Returns nothing when the reader prefers reduced motion, so the content is simply there.
 */
export function useRevealProps({ y = 24, delay = 0, duration = 1.2, margin = '0px 0px -10% 0px' } = {}) {
  const still = useStill();
  if (still) return {};
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin },
    transition: { duration, ease: EASE, delay },
  };
}

/** The same props with a per-item stagger, for use inside a .map(). */
export const staggered = (props, i, step = 0.07) => (
  props.transition ? { ...props, transition: { ...props.transition, delay: i * step } } : props
);

export function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const Tag = motion[as];
  // Readers who ask for less motion get the content straight away rather than a hidden element
  // waiting on a scroll trigger. (This is also what makes the page capturable by screenshot tools.)
  const still = useStill();
  if (still) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** Photograph with a quiet fade-in once decoded. Falls back to brand plate art when there is no image. */
export function Photo({ src, alt = '', plate = 'curve', className = '', eager = false }) {
  const [loaded, setLoaded] = useState(false);
  // With reduced motion the picture is simply there — no fade, and nothing hidden behind a
  // load event that may never be observed (screenshot tools and some crawlers never see it).
  const still = useStill();
  if (!src) return <ArchPlate variant={plate} className={className} />;
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      ref={(el) => { if (el?.complete && !loaded) setLoaded(true); }}
      className={cx('h-full w-full object-cover transition-opacity duration-[1.2s] ease-out', loaded || still ? 'opacity-100' : 'opacity-0', className)}
    />
  );
}

/** Scales a single line of text to exactly fill its container (brandmark "exception" layout). */

function FitText({ children, className = '', innerClassName = '' }) {
  const wrap = useRef(null);
  const inner = useRef(null);
  const [size, setSize] = useState(null);
  useLayoutEffect(() => {
    const w = wrap.current;
    const i = inner.current;
    if (!w || !i) return undefined;
    const fit = () => {
      const current = parseFloat(getComputedStyle(i).fontSize) || 100;
      const perPx = i.getBoundingClientRect().width / current;
      if (perPx > 0) setSize(Math.floor((w.clientWidth / perPx) * 0.995 * 10) / 10);
    };
    fit();
    // Re-fit when the container resizes or when the brand font swaps in (its metrics differ from the fallback).
    const ro = new ResizeObserver(fit);
    ro.observe(w);
    ro.observe(i);
    document.fonts?.ready?.then(fit);
    document.fonts?.addEventListener?.('loadingdone', fit);
    return () => { ro.disconnect(); document.fonts?.removeEventListener?.('loadingdone', fit); };
  }, []);
  return (
    <div ref={wrap} dir="ltr" className={cx('w-full overflow-visible', className)}>
      <span ref={inner} className={cx('inline-block whitespace-nowrap', innerClassName)} style={{ fontSize: size ? `${size}px` : '11vw' }}>
        {children}
      </span>
    </div>
  );
}

/** Button that leans toward the cursor on a spring (mouse only). */

function TiltCard({ children, className = '' }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [1.5, -1.5]), SPRING);
  const ry = useSpring(useTransform(mx, [0, 1], [-2, 2]), SPRING);
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, rgba(255,255,255,0.07), transparent 45%)`;
  const [active, setActive] = useState(false);
  return (
    <div className="[perspective:1400px]">
      <motion.div
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
          setActive(true);
        }}
        onPointerLeave={() => { mx.set(0.5); my.set(0.5); setActive(false); }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className={cx('relative', className)}
      >
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-500"
          style={{ background: glare, opacity: active ? 1 : 0 }}
        />
      </motion.div>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined;
    const id = setTimeout(onDone, 3200);
    return () => clearTimeout(id);
  }, [message, onDone]);
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-[90] -translate-x-1/2 rounded-full border border-white/15 bg-g-ink/90 px-5 py-3 text-sm text-white backdrop-blur-xl"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Accessible modal: Esc to close, focus trap, scroll lock, restores focus. */

export function Modal({ open, onClose, labelledBy, children, className = '' }) {
  const panel = useRef(null);
  useScrollLock(open);
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const focusables = () => panel.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
    ) ?? [];
    requestAnimationFrame(() => (focusables()[0] || panel.current)?.focus());
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const f = Array.from(focusables());
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            data-lenis-prevent
            initial={{ y: 48, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={cx(
              'relative max-h-[92svh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] border border-white/15 bg-g-ink/90 text-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl outline-none sm:rounded-[28px]',
              'pb-[env(safe-area-inset-bottom,0px)]',
              className,
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CloseButton({ onClick }) {
  const { t } = useLang();
  return (
    <button
      type="button" onClick={onClick} aria-label={t.close}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <X size={18} strokeWidth={1.5} />
    </button>
  );
}

export function Segmented({ options, value, onChange, tone = 'dark', layoutId, label }) {
  return (
    <div role="tablist" aria-label={label} className={cx('no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1', tone === 'dark' ? 'bg-white/[0.06] ring-1 ring-white/10' : 'bg-black/[0.05] ring-1 ring-black/10')}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value} type="button" role="tab" aria-selected={on} onClick={() => onChange(o.value)}
            className={cx(
              'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              tone === 'dark'
                ? (on ? 'text-black' : 'text-g-25 hover:text-white') + ' focus-visible:outline-white'
                : (on ? 'text-white' : 'text-g-75 hover:text-black') + ' focus-visible:outline-black',
            )}
          >
            {on && (
              <motion.span layoutId={layoutId} transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className={cx('absolute inset-0 rounded-full', tone === 'dark' ? 'bg-white' : 'bg-black')} />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}


/* ───────────────────────── chrome ───────────────────────── */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  if (useStill()) return null;
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-[0%] bg-white rtl:origin-[100%]" />;
}

function LangToggle({ lang, setLang, className = '' }) {
  return (
    <div className={cx('items-center rounded-full border border-white/15 p-0.5 text-[12px] font-medium', className)} role="group" aria-label="Language">
      {['en', 'ar'].map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l}
          className={cx('rounded-full px-2.5 py-1.5 transition', lang === l ? 'bg-white text-black' : 'text-g-25 hover:text-white')}>
          {l === 'en' ? 'EN' : 'ع'}
        </button>
      ))}
    </div>
  );
}

function Header({ onMenu, menuOpen, onConcierge, lang, setLang }) {
  const { t } = useLang();
  const { path } = useRouter();
  const linkTo = useLinkTo();
  const sub = useSubNav();
  const still = useStill();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  // The dropdowns open on hover and focus. After a choice the pointer is usually still over the
  // menu and focus still on the link, so both would keep it open; `shut` holds it closed until the
  // pointer leaves that menu or focus comes back to it from elsewhere.
  const [shut, setShut] = useState(null);
  const choose = (k, link) => ({
    ...link,
    onClick: (e) => {
      link.onClick?.(e);
      setShut(k);
      e.currentTarget.blur();
    },
  });
  // Sticky bars under the header read this to slide up into the gap when the header hides.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.navHidden = hidden && !menuOpen ? 'true' : 'false';
    return () => { delete root.dataset.navHidden; };
  }, [hidden, menuOpen]);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      // On phones the bar stays put: sliding it away while Safari's own toolbar resizes the page reads as a jolt.
      if (Math.abs(y - last) > 6) { setHidden(!still && y > last && y > 400); last = y; }
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [still]);
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[95] px-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:px-6"
      animate={{ y: hidden && !menuOpen ? '-130%' : '0%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      <div className={cx(
        'mx-auto flex max-w-[1320px] items-center gap-3 rounded-full border py-2 pe-2 ps-5 transition-colors duration-500',
        solid || menuOpen ? 'border-white/10 bg-black/60 backdrop-blur-2xl' : 'border-transparent bg-transparent',
      )}>
        <a {...linkTo(ROUTES.home)} className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" aria-label="G Developments home">
          <img src={logoWhite} alt="G Developments" className="h-[15px] w-auto sm:h-[17px]" width="140" height="17" />
        </a>
        <nav aria-label="Main" className="ms-8 hidden lg:block xl:ms-12">
          <ul className="flex items-center gap-7 xl:gap-10">
            {NAV.map((k) => {
              const active = path === ROUTES[k] || path.startsWith(`${ROUTES[k]}/`);
              const items = sub[k];
              return (
                <li
                  key={k}
                  className="group/nav relative"
                  onPointerLeave={() => shut === k && setShut(null)}
                  onFocus={(e) => { if (shut === k && !e.currentTarget.contains(e.relatedTarget)) setShut(null); }}
                >
                  <a
                    {...choose(k, linkTo(ROUTES[k]))} aria-current={active ? 'page' : undefined}
                    className={cx('caption relative block py-2 text-[11.5px] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-[0%] after:bg-white after:transition-transform after:duration-500 rtl:after:origin-[100%]', active ? 'text-white after:scale-x-100' : 'text-g-25 after:scale-x-0 hover:text-white hover:after:scale-x-100')}
                  >
                    {t.nav[k]}
                  </a>
                  {items && (
                    <div className={cx('invisible absolute -start-5 top-full pt-4 opacity-0 transition-all duration-300 group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:opacity-100', shut === k && '!pointer-events-none !invisible !opacity-0')}>
                      <ul className="min-w-[240px] translate-y-1 rounded-2xl border border-white/10 bg-black/85 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-transform duration-300 group-hover/nav:translate-y-0">
                        {items.map((it, i) => {
                          const on = path === it.to;
                          return (
                            <li key={it.to} className={cx(i === 0 && items.length > 2 && 'mb-1 border-b border-white/10 pb-1', it.accent && 'mt-1 border-t border-white/10 pt-1')}>
                              <a
                                {...choose(k, linkTo(it.to))} aria-current={on ? 'page' : undefined} dir={it.latin ? 'ltr' : undefined}
                                className={cx('flex items-center justify-between gap-6 rounded-xl px-3.5 py-2.5 text-[14px] transition-colors rtl:text-end', on ? 'bg-white/10 text-white' : 'text-g-25 hover:bg-white/[0.06] hover:text-white')}
                              >
                                {it.label}
                                {on && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <a href={`tel:${CONTACT.hotline}`} className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] text-white transition hover:bg-white/10 sm:inline-flex lg:hidden xl:inline-flex" aria-label={`${t.hotline} ${CONTACT.hotline}`}>
            <Phone size={14} strokeWidth={1.6} /><span className="font-medium tabular-nums">{CONTACT.hotline}</span>
          </a>
          <LangToggle lang={lang} setLang={setLang} className="hidden sm:flex" />
          <Elastic type="button" onClick={onConcierge} className={cx(BTN_LIGHT, 'hidden px-5 py-2.5 text-[13px] md:inline-flex')}>
            {t.registerInterest}
          </Elastic>
          <Elastic
            type="button" onClick={onMenu} aria-expanded={menuOpen} aria-controls="site-menu" strength={0.25}
            className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-[13px] font-medium text-white hover:bg-white/10 lg:hidden"
            innerClassName="gap-3"
          >
            <span className="hidden sm:inline">{menuOpen ? t.menuLabel.close : t.menuLabel.open}</span>
            <span className="relative block h-3 w-5" aria-hidden="true">
              <motion.span className="absolute inset-x-0 top-0.5 h-px bg-white" animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} />
              <motion.span className="absolute inset-x-0 bottom-0.5 h-px bg-white" animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} />
            </span>
            <span className="sr-only sm:hidden">{menuOpen ? t.menuLabel.close : t.menuLabel.open}</span>
          </Elastic>
        </div>
      </div>
    </motion.header>
  );
}

function MenuOverlay({ open, onClose, onConcierge, lang, setLang }) {
  const { t, L } = useLang();
  const linkTo = useLinkTo();
  const sub = useSubNav();
  const [hover, setHover] = useState(PROJECTS[0].id);
  useScrollLock(open);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  const active = PROJECTS.find((p) => p.id === hover) || PROJECTS[0];
  const origin = lang === 'ar' ? '6% 5%' : '94% 5%';
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu" role="dialog" aria-modal="true" aria-label={t.menuLabel.open} data-lenis-prevent
          className="fixed inset-0 z-[90] overflow-y-auto bg-g-ink text-white"
          initial={{ clipPath: `circle(0% at ${origin})` }}
          animate={{ clipPath: `circle(150% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="mx-auto grid min-h-full max-w-[1320px] gap-10 px-4 pb-10 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-6 lg:grid-cols-12">
            <nav aria-label={t.menuLabel.explore} className="lg:col-span-7">
              <Caption>{t.menuLabel.explore}</Caption>
              <ul className="mt-6" onMouseLeave={() => setHover(active.id)}>
                {PROJECTS.map((p, i) => (
                  <motion.li
                    key={p.id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.05 }}
                    className="border-b border-white/10"
                  >
                    <a
                      {...linkTo(projectPath(p), onClose)} onMouseEnter={() => setHover(p.id)} onFocus={() => setHover(p.id)}
                      className="group flex items-baseline justify-between gap-4 py-3"
                    >
                      <motion.span
                        dir="ltr"
                        className={cx('font-display text-[clamp(1.72rem,3.22vw,2.94rem)] leading-none tracking-brand transition-colors duration-300', hover === p.id ? 'text-white' : 'text-g-75')}
                        animate={{ x: hover === p.id ? (lang === 'ar' ? -10 : 10) : 0 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 26 }}
                      >
                        {p.name}
                      </motion.span>
                      <span className="caption hidden shrink-0 text-g-50 sm:block">{t.regions[p.region]}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-8 lg:col-span-5">
              <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[6px] lg:block">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={active.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: EASE }}
                  >
                    <Photo src={projectImages(active.id).card} alt={active.name} plate={active.plate} eager />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                      <p className="text-sm text-g-25">{L(active.loc)}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Caption>{t.menuLabel.company}</Caption>
                  <ul className="mt-4 space-y-2 text-[15px] text-g-25">
                    {['home', ...NAV].map((k) => (
                      <li key={k}>
                        <a {...linkTo(ROUTES[k], onClose)} className="transition hover:text-white">{t.nav[k]}</a>
                        {k === 'about' && (
                          <ul className="mb-1 mt-2 space-y-1.5 border-s border-white/15 ps-3 text-[14px] text-g-50">
                            {sub.about.slice(1).map((it) => <li key={it.to}><a {...linkTo(it.to, onClose)} className="transition hover:text-white">{it.label}</a></li>)}
                          </ul>
                        )}
                        {k === 'residences' && (
                          <ul className="mb-1 mt-2 border-s border-white/15 ps-3 text-[14px] text-g-50">
                            <li><a {...linkTo(ROUTES.launches, onClose)} className="transition hover:text-white">{sub.residences[sub.residences.length - 1].label}</a></li>
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Caption>{t.menuLabel.contact}</Caption>
                  <a href={`tel:${CONTACT.hotline}`} className="mt-4 block font-display text-3xl tabular-nums">{CONTACT.hotline}</a>
                  <p className="mt-2 text-sm leading-relaxed text-g-50">{L(CONTACT.address)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Elastic type="button" onClick={() => { onClose(); onConcierge(); }} className={BTN_LIGHT}>{t.bookTour}</Elastic>
                <LangToggle lang={lang} setLang={setLang} className="flex" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── hero ───────────────────────── */

export function SelectField({ id, label, value, onChange, options, anyLabel }) {
  return (
    <label htmlFor={id} className="group relative block min-w-0 flex-1 rounded-2xl px-4 py-2.5 transition hover:bg-white/[0.06] focus-within:bg-white/[0.08]">
      <span className="block caption text-g-50">{label}</span>
      <select
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full cursor-pointer appearance-none truncate bg-transparent pe-6 text-[15px] font-medium text-white outline-none [&>option]:bg-g-ink"
      >
        <option value="">{anyLabel}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute bottom-3.5 end-4 text-g-50" />
    </label>
  );
}

function SearchWidget({ onSearch }) {
  const { t } = useLang();
  const [loc, setLoc] = useState('');
  const [type, setType] = useState('');
  const [budget, setBudget] = useState('');
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch({ loc, type, budget }); }}
      className="flex flex-col gap-1 rounded-[28px] border border-white/15 bg-white/[0.06] p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:flex-row sm:items-stretch"
      aria-label={t.search.submit}
    >
      <SelectField id="s-loc" label={t.search.location} value={loc} onChange={setLoc} anyLabel={t.search.any}
        options={Object.entries(t.search.locations).map(([value, label]) => ({ value, label }))} />
      <div className="hidden w-px bg-white/10 sm:block" />
      <SelectField id="s-type" label={t.search.type} value={type} onChange={setType} anyLabel={t.search.any}
        options={Object.entries(t.types).map(([value, label]) => ({ value, label }))} />
      <div className="hidden w-px bg-white/10 sm:block" />
      <SelectField id="s-budget" label={t.search.budget} value={budget} onChange={setBudget} anyLabel={t.search.any}
        options={Object.entries(t.search.budgets).map(([value, label]) => ({ value, label }))} />
      <Elastic
        type="submit" strength={0.2}
        className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-white px-6 py-4 text-[15px] font-medium text-black transition-colors hover:bg-g-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:py-0"
      >
        <Search size={17} strokeWidth={2} /> {t.search.submit}
      </Elastic>
    </form>
  );
}


function Hero({ ready, onConcierge }) {
  const { t, lang, L } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const sink = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  // Phones: no parallax, fade-out, zoom or entrance — the hero is simply there.
  const still = useStill();
  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-black">
      <motion.div className="absolute inset-0 -z-10" style={still ? undefined : { y: sink }}>
        <motion.div
          className="absolute inset-0"
          initial={still ? false : { scale: 1.12 }}
          animate={still ? undefined : { scale: ready ? 1 : 1.12 }}
          transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Photo src={mediaUrl(HERO_BANNER.image)} alt={L(HERO_BANNER.alt)} eager />
        </motion.div>
      </motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.15)_28%,rgba(0,0,0,0.35)_60%,#000_100%)]" />
      {/* phones: the copy sits over bright rooftops, so give it a darker floor to read against */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-gradient-to-t from-black via-black/60 to-transparent md:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden bg-[linear-gradient(to_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_60%)] md:block rtl:bg-[linear-gradient(to_left,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_60%)]" />

      <motion.div style={still ? undefined : { opacity: fade }} className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-4 pb-6 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-6">
        <motion.p className="caption text-g-25" initial={still ? false : { opacity: 0 }} animate={still ? undefined : { opacity: ready ? 1 : 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          {t.heroEyebrow}
        </motion.p>

        <div className="mt-auto grid gap-10 pt-16 lg:grid-cols-12 lg:items-end">
          <h1 className={cx(
            'font-text text-[clamp(1.81rem,3.08vw,2.94rem)] font-light leading-[1.06] text-white [text-wrap:balance] lg:col-span-7',
            lang === 'ar' ? 'leading-[1.3]' : 'tracking-tightish',
          )}>
            <SplitReveal key={lang} text={t.heroTitle} play={ready} delay={0.35} />
          </h1>
          <motion.div
            className="flex flex-col gap-6 lg:col-span-5 lg:items-end"
            initial={still ? false : { opacity: 0, y: 20 }} animate={still ? undefined : ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: EASE, delay: 1 }}
          >
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-g-25 lg:text-end">{t.heroSub}</p>
            <div className="flex flex-wrap gap-3">
              <Elastic as="a" href="#destinations" className={cx(BTN_GHOST, 'backdrop-blur-sm')}>
                {t.explore} <ArrowRight size={17} className="rtl:rotate-180" />
              </Elastic>
              <Elastic type="button" onClick={onConcierge} className={BTN_LIGHT}>
                {t.bookTour} <ArrowUpRight size={17} className="rtl:-scale-x-100" />
              </Elastic>
            </div>
          </motion.div>
        </div>

        <div className="latin-display mt-10 leading-[0.8] text-white">
          <FitText innerClassName="tracking-brand">
            <ElasticWordmark reveal={ready} delay={0.1} />
          </FitText>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-6 end-6 hidden flex-col items-center gap-3 md:flex" aria-hidden="true">
        <span className="caption text-g-50 [writing-mode:vertical-rl]">{t.scroll}</span>
        <span className="relative h-14 w-px overflow-hidden bg-white/15">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-white" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
        </span>
      </div>
    </section>
  );
}

function FindHome({ onSearch }) {
  const { t } = useLang();
  return (
    <section aria-labelledby="find-title" className="relative isolate overflow-hidden bg-black">
      <div className="mx-auto max-w-[1320px] px-4 py-11 sm:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-5">
            <Caption>G Developments | {t.search2.eyebrow}</Caption>
            <h2 id="find-title" className="mt-5 font-display text-[clamp(1.72rem,3.12vw,2.65rem)] leading-[1.02] tracking-tightish [text-wrap:balance]">{t.search2.title}</h2>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.1}><SearchWidget onSearch={onSearch} /></Reveal>
        </div>
        <dl className="mt-10 grid grid-cols-2 border-t border-white/10 md:grid-cols-4">
          {t.stats.map((s, i) => (
            <Reveal key={s.value} delay={i * 0.06} className={cx('flex min-w-0 flex-col py-6 pe-4', i % 2 === 1 && 'border-s border-white/10 ps-4', i >= 2 && 'border-t border-white/10 md:border-t-0', i === 2 && 'md:border-s md:ps-4')}>
              <dt className="order-2 mt-2 text-[13px] leading-snug text-g-50">{s.label}</dt>
              <dd dir="ltr" className="font-display text-[clamp(1.55rem,2.81vw,2.5rem)] tabular-nums tracking-tightish rtl:text-end">{s.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ───────────────────────── destinations reel ───────────────────────── */

export function priceLabel(p, t) {
  if (p.soldOut) return t.portfolio.soldOut;
  if (p.price == null) return t.portfolio.onRequest;
  return `${t.portfolio.from} EGP ${p.price}${t.portfolio.million}*`;
}

function matches(p, f) {
  if (!f) return true;
  if (f.loc && p.area !== f.loc) return false;
  if (f.type && !p.types.includes(f.type)) return false;
  if (f.budget && p.price != null) {
    if (f.budget === 'lt12' && p.price >= 12) return false;
    if (f.budget === '12-16' && (p.price < 12 || p.price > 16)) return false;
    if (f.budget === 'gt16' && p.price < 16) return false;
  }
  return true;
}


export function ReelCard({ p, index }) {
  const { t, L } = useLang();
  const linkTo = useLinkTo();
  const img = projectImages(p.id).card;
  return (
    <article id={`project-${p.id}`} className="group scroll-mt-28 text-white">
      <TiltCard className="rounded-[6px]">
        <a
          {...linkTo(projectPath(p))} aria-label={`${t.portfolio.view} ${p.name}`}
          className="relative block aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-g-ink text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <div className="absolute inset-0 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]">
            <Photo src={img} alt={p.name} plate={p.plate} />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0)_65%,rgba(0,0,0,0.55)_100%)]" />
          <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3">
            <span dir="ltr" className="caption text-white/85">{p.marker}</span>
            {p.soldOut && <span className="caption border border-white/40 px-2.5 py-1 text-white">{t.portfolio.soldOut}</span>}
          </div>
          {!img && (
            <span className="caption pointer-events-none absolute inset-0 grid place-items-center px-6 text-center text-white/55">
              {t.portfolio.photosSoon}
            </span>
          )}
          <span className="caption absolute bottom-5 end-5 flex items-center gap-2 text-white opacity-0 transition-opacity duration-700 group-hover:opacity-100">
            {t.portfolio.view} <ArrowUpRight size={14} className="rtl:-scale-x-100" />
          </span>
        </a>
      </TiltCard>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="caption text-g-50">{t.regions[p.region]}</p>
          <h3 dir="ltr" className="mt-1.5 font-display text-[clamp(1.1rem,1.5vw,1.4rem)] leading-[1] tracking-brand rtl:text-end">{p.name}</h3>
          <p className="mt-1.5 text-[13px] text-g-50">{L(p.loc).split('·')[1]?.trim() || L(p.loc)}</p>
        </div>
        <span dir="ltr" className="caption shrink-0 text-g-75 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-white/10 pt-2.5">
        <span dir="ltr" className="text-[14px] text-g-25">{priceLabel(p, t)}</span>
        <a {...linkTo(projectPath(p))} tabIndex={-1} className="btn-lux inline-flex shrink-0 items-center gap-2 border-b border-white/30 pb-1 text-white transition-colors duration-500 hover:border-white">
          {t.portfolio.view} <ArrowRight size={14} className="rtl:rotate-180" />
        </a>
      </div>
    </article>
  );
}

function Destinations({ filters, onClear }) {
  const { t, lang } = useLang();
  const cardReveal = useRevealProps({ y: 36, duration: 1.1 });
  const [tab, setTab] = useState('all');
  const list = PROJECTS.filter((p) => (tab === 'all' || p.cats.includes(tab)) && matches(p, filters));
  const rtl = lang === 'ar';
  const track = useRef(null);
  const progress = useMotionValue(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  // Native horizontal scroll (touch swipe, trackpad, shift+wheel, arrows) with snap per card.
  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft); // negative in RTL
    progress.set(max > 0 ? pos / max : 1);
    setEdges({ start: pos <= 2, end: pos >= max - 2 });
  }, [progress]);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    el.scrollLeft = 0;
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [list.length, tab, sync]);

  // Mouse drag-to-scroll. Touch keeps its native swipe. Each pixel of pointer travel moves the
  // row DRAG_SPEED pixels, and snapping is paused while dragging so the row follows the cursor.
  const DRAG_SPEED = 2;
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 5) return;
      d.moved = true;
      setDragging(true);
      track.current.setPointerCapture(e.pointerId);
    }
    track.current.scrollLeft = d.left - dx * DRAG_SPEED;
  };
  const endDrag = () => {
    if (drag.current?.moved) {
      // Swallow the click that follows a drag so it doesn't open a project.
      window.addEventListener('click', (ev) => ev.stopPropagation(), { capture: true, once: true });
      setTimeout(() => setDragging(false));
    }
    drag.current = null;
  };

  const step = (dir) => {
    const el = track.current;
    const card = el?.firstElementChild;
    if (!el || !card) return;
    const w = card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || '0');
    el.scrollBy({ left: (rtl ? -1 : 1) * dir * w, behavior: 'smooth' });
  };

  // Mouse wheel over the row moves it one card per notch instead of scrolling the page. At either
  // end the wheel is left alone, so the page carries on scrolling. Trackpad sideways swipes stay native.
  const stepRef = useRef(step);
  useEffect(() => { stepRef.current = step; });
  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    let lockedUntil = 0;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || e.ctrlKey) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const max = el.scrollWidth - el.clientWidth;
      const pos = Math.abs(el.scrollLeft);
      if ((dir > 0 && pos >= max - 2) || (dir < 0 && pos <= 2)) return;
      e.preventDefault();
      const now = performance.now();
      if (now < lockedUntil) return;
      lockedUntil = now + 380;
      stepRef.current(dir);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const tabs = ['all', 'coastal', 'urban', 'commercial'].map((v) => ({
    value: v,
    label: v === 'all' ? t.portfolio.tabs.all : `${t.portfolio.tabs[v]} (${PROJECTS.filter((p) => p.cats.includes(v)).length})`,
  }));
  const summary = filters && [
    filters.loc && t.search.locations[filters.loc],
    filters.type && t.types[filters.type],
    filters.budget && t.search.budgets[filters.budget],
  ].filter(Boolean).join(' · ');

  return (
    <section id="destinations" aria-labelledby="destinations-title" className="scroll-mt-20 overflow-hidden bg-black">
      <div className="mx-auto max-w-[1320px] px-4 pt-4 sm:px-6 md:pt-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal><SectionHeading id="destinations-title" eyebrow={t.portfolio.eyebrow} title={t.portfolio.title(PROJECTS.length)} subtitle={t.portfolio.subtitle} /></Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-3 lg:items-end">
            <Segmented layoutId="dest-tab" label={t.portfolio.eyebrow} value={tab} onChange={setTab} options={tabs} />
            <p className="text-sm text-g-50">{tab === 'all' ? t.portfolio.note : t.portfolio.tabHints[tab]}</p>
          </Reveal>
        </div>
        <AnimatePresence>
          {filters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div role="status" className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4">
                <Search size={16} />
                <span className="text-sm font-medium">{list.length ? t.portfolio.results(list.length) : t.portfolio.noResults}</span>
                {summary && <span className="text-sm text-g-50">{summary}</span>}
                <button type="button" onClick={onClear} className="ms-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white hover:text-black">
                  <X size={13} /> {t.portfolio.clear}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto mt-8 max-w-[1320px]">
        <ul
          ref={track}
          data-lenis-prevent
          onScroll={sync}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDragStart={(e) => e.preventDefault()}
          className={cx(
            'no-scrollbar flex gap-5 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 md:gap-6',
            dragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab snap-x snap-mandatory',
          )}
          aria-label={t.portfolio.eyebrow}
        >
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.li
                key={p.id} layout
                {...staggered(cardReveal, i)}
                exit={{ opacity: 0 }}
                // Card picture is 4:3, so this width keeps picture + caption inside one screen height.
                className="w-[clamp(220px,calc((100svh_-_320px)*1.3),330px)] max-w-[78vw] shrink-0 snap-start"
              >
                <ReelCard p={p} index={PROJECTS.indexOf(p)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className="mx-auto flex max-w-[1320px] items-center gap-6 px-4 pb-10 pt-6 sm:px-6 md:pb-12">
        <div className="relative h-px flex-1 bg-white/15" aria-hidden="true">
          <motion.div className="absolute inset-y-0 start-0 w-full origin-[0%] bg-white rtl:origin-[100%]" style={{ scaleX: progress }} />
        </div>
        <div className="flex gap-2">
          <Elastic type="button" onClick={() => step(-1)} disabled={edges.start} aria-label={t.prev} className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-30">
            <ArrowLeft size={18} className="rtl:rotate-180" />
          </Elastic>
          <Elastic type="button" onClick={() => step(1)} disabled={edges.end} aria-label={t.next} className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-30">
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Elastic>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── amenities ───────────────────────── */

const AMENITY_ICONS = { Flag, Waves, Sun, UtensilsCrossed, GraduationCap, Hotel };

const AMENITY_LAYOUT = {
  golf: 'sm:col-span-2 lg:col-span-4 lg:row-span-2',
  lagoons: 'lg:col-span-2 lg:row-span-2',
  beaches: 'lg:col-span-3',
  dining: 'lg:col-span-3',
  education: 'lg:col-span-3',
  hospitality: 'lg:col-span-3',
};

function AmenityTile({ a }) {
  const { L, lang } = useLang();
  const Icon = AMENITY_ICONS[a.icon];
  const [pt, setPt] = useState({ x: 50, y: 50, on: false });
  return (
    <div
      className="group relative h-full min-h-[260px] overflow-hidden rounded-[6px] bg-g-ink text-white"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPt({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
      }}
      onPointerLeave={() => setPt((p) => ({ ...p, on: false }))}
    >
      <div className={cx('absolute inset-0 transition duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]', a.image ? 'opacity-85 group-hover:opacity-100' : 'opacity-60')}>
        <Photo src={mediaUrl(a.image)} alt="" plate={a.plate} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.25)_60%,rgba(0,0,0,0.1)_100%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ opacity: pt.on ? 1 : 0, background: `radial-gradient(360px circle at ${pt.x}% ${pt.y}%, rgba(255,255,255,0.08), transparent 55%)` }}
      />
      <div className="relative flex h-full flex-col justify-between gap-6 p-6">
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/30 backdrop-blur-md"><Icon size={17} strokeWidth={1.5} /></span>
          <span dir="ltr" className="caption text-g-25">{a.where}</span>
        </div>
        <div>
          <h3 className={cx('text-2xl font-display', lang === 'en' && 'tracking-tightish', a.id === 'golf' && 'lg:text-4xl')}>{L(a.title)}</h3>
          <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-g-25">{L(a.text)}</p>
        </div>
      </div>
    </div>
  );
}


function Amenities() {
  const { t } = useLang();
  const tileReveal = useRevealProps({ y: 28, duration: 1.1, margin: '0px 0px -8% 0px' });
  return (
    <section id="lifestyle" aria-labelledby="lifestyle-title" className="bg-black">
      <div className="mx-auto max-w-[1320px] px-4 pb-11 pt-8 sm:px-6 md:pb-16 md:pt-12">
        <Reveal><SectionHeading id="lifestyle-title" eyebrow={t.amenities.eyebrow} title={t.amenities.title} subtitle={t.amenities.subtitle} /></Reveal>
        <ul className="mt-8 grid auto-rows-[minmax(250px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {AMENITIES.map((a, i) => (
            <motion.li
              key={a.id}
              {...staggered(tileReveal, i % 3)}
              className={cx('min-w-0', AMENITY_LAYOUT[a.id])}
            >
              <AmenityTile a={a} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA + footer ───────────────────────── */

export function CtaBand({ onConcierge }) {
  const { t, lang } = useLang();
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10"><Photo src={mediaUrl(PROJECT_MEDIA['playa-rh'].hero)} alt="" /></div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0.85)_100%)]" />
      <Condensation className="absolute inset-0 -z-10" />
      <div className="mx-auto flex min-h-[78svh] max-w-[1320px] flex-col justify-between gap-16 px-4 py-14 sm:px-6 md:py-20">
        <p dir="ltr" className="latin-display text-[clamp(1.5rem,2.8vw,2.2rem)] tracking-tightish rtl:text-end" aria-hidden="true">
          G Developments
        </p>
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <h2 id="cta-title" className={cx('font-display text-[clamp(2.8rem,6.2vw,5.6rem)] leading-[0.92]', lang === 'en' ? 'tracking-brand' : 'leading-[1.2]')}>
              {t.cta.title}
            </h2>
            <p className="mt-6 max-w-[44ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-g-25">{t.cta.text}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Elastic type="button" onClick={onConcierge} className={cx(BTN_LIGHT, 'px-7 py-4')}>
              <CalendarDays size={17} /> {t.bookTour}
            </Elastic>
            <Elastic as="a" href={`tel:${CONTACT.hotline}`} className={cx(BTN_GHOST, 'px-7 py-4')}>
              <Phone size={17} /> {t.cta.call} <span className="tabular-nums">{CONTACT.hotline}</span>
            </Elastic>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter({ onLead }) {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!valid) { setState('error'); return; }
        await onLead?.({ kind: 'newsletter', email });
        setState('done');
      }}
      className="w-full max-w-md"
    >
      <label htmlFor="nl-email" className="text-[clamp(1.35rem,2.04vw,1.7rem)] font-display leading-tight tracking-tightish">{t.footer.newsletter}</label>
      {state === 'done' ? (
        <p role="status" className="mt-5 inline-flex items-center gap-2 text-g-25"><Check size={16} /> {t.footer.subscribed}</p>
      ) : (
        <>
          <div className="mt-5 flex items-center gap-2 rounded-full border border-white/20 p-1.5 ps-5 focus-within:border-white">
            <input
              id="nl-email" type="email" inputMode="email" autoComplete="email" value={email}
              onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
              placeholder={t.footer.email} aria-invalid={state === 'error'} aria-describedby="nl-err"
              className="min-w-0 flex-1 bg-transparent py-2 text-white outline-none placeholder:text-g-50"
            />
            <button type="submit" className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-g-25">{t.footer.subscribe}</button>
          </div>
          <p id="nl-err" className="mt-2 min-h-[1.25rem] text-sm text-g-25">{state === 'error' ? t.footer.errEmail : ''}</p>
        </>
      )}
    </form>
  );
}

function Footer({ onLead, onConcierge, onRoute }) {
  const { t, L } = useLang();
  const linkTo = useLinkTo();
  const sub = useSubNav();
  const col = 'space-y-2.5 text-[14px] text-g-25';
  const a = 'transition hover:text-white';
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1320px] px-4 pt-11 sm:px-6">
        <div className="grid gap-12 border-b border-white/15 pb-14 lg:grid-cols-12">
          <div className="lg:col-span-5"><Newsletter onLead={onLead} /></div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7">
            <div>
              <Caption>{t.footer.destinations}</Caption>
              <ul className={cx(col, 'mt-4')}>
                {PROJECTS.map((p) => <li key={p.id}><a className={a} {...linkTo(projectPath(p))}>{p.name}</a></li>)}
              </ul>
            </div>
            <div>
              <Caption>{t.footer.company}</Caption>
              <ul className={cx(col, 'mt-4')}>
                {sub.about.map((it) => <li key={it.to}><a className={a} {...linkTo(it.to)}>{it.to === ROUTES.about ? t.nav.about : it.label}</a></li>)}
                <li><a className={a} {...linkTo(ROUTES.launches)}>{sub.residences[sub.residences.length - 1].label}</a></li>
                <li><a className={a} {...linkTo(ROUTES.journal)}>{t.nav.journal}</a></li>
                <li><a className={a} href="https://careers.thegdevelopments.com/" target="_blank" rel="noopener noreferrer">{t.footer.careers}</a></li>
              </ul>
            </div>
            <div>
              <Caption>{t.footer.group}</Caption>
              <ul className={cx(col, 'mt-4')} dir="ltr">
                {GROUP_COMPANIES.map((c) => <li key={c.id} className="rtl:text-end"><a className={a} {...linkTo(entityPath(c))}>{c.name}</a></li>)}
              </ul>
            </div>
            <div>
              <Caption>{t.footer.contact}</Caption>
              <ul className={cx(col, 'mt-4')}>
                <li><a className="text-2xl font-display tabular-nums text-white" href={`tel:${CONTACT.hotline}`}>{CONTACT.hotline}</a></li>
                <li><a className={a} href={`mailto:${CONTACT.email}`}>{CONTACT.email.split('@')[0]}@<wbr />{CONTACT.email.split('@')[1]}</a></li>
                <li className="leading-relaxed">{L(CONTACT.address)}</li>
                <li><button type="button" onClick={onConcierge} className="inline-flex items-center gap-1.5 text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{t.bookTour}</button></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-4 py-6 text-[13px] text-g-50 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {CONTACT.social.map((s) => <li key={s.id}><a className={a} href={s.href} rel="noopener noreferrer">{s.label}</a></li>)}
          </ul>
          <p>© {new Date().getFullYear()} G Developments. {t.footer.rights} · <a className={a} href="/privacy" onClick={(e) => { e.preventDefault(); onRoute('/privacy', t.footer.privacy); }}>{t.footer.privacy}</a></p>
        </div>

        <div className="latin-display select-none pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] leading-[0.82] text-g-75">
          <FitText innerClassName="tracking-brand"><ElasticWordmark inView /></FitText>
        </div>
      </div>
    </footer>
  );
}

function QuickContact({ onConcierge }) {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.9);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] end-4 z-[55] flex items-center gap-1 rounded-full border border-white/15 bg-black/70 p-1.5 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          {/* Phones: icons only, so the pill stops covering the filter tabs and cards beneath it. */}
          <a href={`tel:${CONTACT.hotline}`} className="inline-flex h-11 w-11 items-center justify-center gap-2 rounded-full text-sm font-medium tabular-nums hover:bg-white/10 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5" aria-label={`${t.hotline} ${CONTACT.hotline}`}>
            <Phone size={15} /> <span className="hidden sm:inline">{CONTACT.hotline}</span>
          </a>
          <button type="button" onClick={onConcierge} aria-label={t.quick} className="inline-flex h-11 w-11 items-center justify-center gap-2 rounded-full bg-white text-sm font-medium text-black hover:bg-g-25 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5">
            <MessageCircle size={15} /> <span className="hidden sm:inline">{t.quick}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


/* ───────────────────────── project modal ───────────────────────── */

function seeded(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i += 1) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
}

/** Illustrative site plan, generated per project so each looks distinct. Not survey data. */

export function MasterplanSVG({ p }) {
  const { L } = useLang();
  const coastal = p.cats.includes('coastal');
  const rnd = seeded(p.id);
  const parcels = [];
  const top = coastal ? 150 : 40;
  for (let y = top; y < 470; y += 34) {
    for (let x = 30; x < 610; x += 44) {
      const r = rnd();
      if (r < 0.2) continue;
      const golf = !coastal && Math.hypot(x - 380, y - 250) < 120;
      const lagoon = coastal && p.id === 'seashell-rh' && Math.hypot((x - 320) / 1.8, y - 250) < 60;
      if (golf || lagoon) continue;
      parcels.push({ x, y, w: 36 - (r > 0.8 ? 12 : 0), h: 26, fill: r > 0.85 ? '#404040' : '#262626' });
    }
  }
  const pins = [[150, 300], [380, 250], [520, 380], [260, 420], [480, 180]];
  return (
    <figure className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]">
        <svg viewBox="0 0 640 500" className="block h-auto w-full" role="img" aria-label={`${p.name} masterplan`}>
          <rect width="640" height="500" fill="#0d0d0d" />
          {coastal && (
            <g>
              <rect width="640" height="110" fill="#1b1b1b" />
              {Array.from({ length: 9 }, (_, i) => (
                <path key={i} d={`M0 ${14 + i * 11} Q 160 ${8 + i * 11} 320 ${14 + i * 11} T 640 ${14 + i * 11}`} fill="none" stroke="#fff" strokeOpacity={0.06 + i * 0.01} />
              ))}
              <path d="M0 110 C 160 128, 300 96, 640 118 L 640 140 C 300 118, 160 150, 0 132 Z" fill="#3a3a3a" />
              <text x="20" y="40" fill="#808080" fontSize="11" fontFamily="Helvetica Now Text, Helvetica, Arial, sans-serif" letterSpacing="2">MEDITERRANEAN SEA</text>
            </g>
          )}
          {!coastal && (
            <path d="M380 140 C 480 150, 510 230, 490 300 C 470 370, 360 390, 290 340 C 230 300, 250 160, 380 140 Z" fill="#161616" stroke="#808080" strokeDasharray="4 5" strokeWidth="1" />
          )}
          {coastal && p.id === 'seashell-rh' && (
            <ellipse cx="320" cy="250" rx="100" ry="52" fill="#2e2e2e" stroke="#bfbfbf" strokeOpacity="0.5" />
          )}
          {parcels.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx="3" fill={r.fill} />)}
          <path d={coastal ? 'M0 480 L640 470' : 'M0 470 C 200 440, 420 500, 640 460'} stroke="#bfbfbf" strokeWidth="6" fill="none" />
          <text x="20" y="494" fill="#808080" fontSize="10" fontFamily="Helvetica Now Text, Helvetica, Arial, sans-serif" letterSpacing="1.5">
            {coastal ? 'ALEXANDRIA – MARSA MATROUH ROAD' : 'MAIN ACCESS'}
          </text>
          {p.highlights.slice(0, pins.length).map((h, i) => (
            <g key={i}>
              <circle cx={pins[i][0]} cy={pins[i][1]} r="14" fill="#fff" />
              <text x={pins[i][0]} y={pins[i][1] + 4} textAnchor="middle" fill="#000" fontSize="12" fontWeight="700">{i + 1}</text>
            </g>
          ))}
          <g transform="translate(600 40)">
            <circle r="16" fill="none" stroke="#808080" />
            <path d="M0 -12 L5 4 L0 0 L-5 4 Z" fill="#fff" />
            <text y="30" textAnchor="middle" fill="#808080" fontSize="10" fontFamily="Helvetica Now Text, Helvetica, Arial, sans-serif">N</text>
          </g>
        </svg>
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {p.highlights.map((h, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-g-25">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[11px] font-display text-black">{i + 1}</span>
            {L(h)}
          </li>
        ))}
      </ol>
    </figure>
  );
}

function FloorPlanSVG({ beds }) {
  const { t } = useLang();
  const plan = PLANS[beds];
  const maxY = Math.max(...plan.rooms.map((r) => r.y + r.h));
  const inside = plan.rooms.filter((r) => !r.out);
  const shellH = Math.max(...inside.map((r) => r.y + r.h));
  return (
    <svg viewBox={`-6 -6 112 ${maxY + 18}`} className="block h-auto w-full" role="img" aria-label={`${beds} bedroom sample floor plan`}>
      <rect x="-6" y="-6" width="112" height={maxY + 18} fill="#0d0d0d" />
      {plan.rooms.map((r, i) => (
        <motion.g key={`${beds}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.035, duration: 0.4 }}>
          <rect
            x={r.x} y={r.y} width={r.w} height={r.h}
            fill={r.out ? 'none' : '#ffffff'} fillOpacity={r.out ? 0 : 0.035}
            stroke="#bfbfbf" strokeWidth="0.35" strokeDasharray={r.out ? '1.4 1.2' : undefined}
          />
          <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 1} textAnchor="middle" fill={r.out ? '#808080' : '#e5e5e5'} fontSize={Math.min(2.9, (r.w - 2.5) / (t.modal.rooms[r.n].length * 0.72))} fontWeight="500" letterSpacing="0.2">
            {t.modal.rooms[r.n].toUpperCase()}
          </text>
        </motion.g>
      ))}
      <rect x="0" y="0" width="100" height={shellH} fill="none" stroke="#fff" strokeWidth="1.1" />
      <g transform={`translate(0 ${maxY + 6})`} fill="#808080" fontSize="2.6" fontFamily="Helvetica Now Text, Helvetica, Arial, sans-serif">
        <line x1="0" y1="0" x2="10" y2="0" stroke="#808080" strokeWidth="0.4" />
        <line x1="0" y1="-1" x2="0" y2="1" stroke="#808080" strokeWidth="0.4" />
        <line x1="10" y1="-1" x2="10" y2="1" stroke="#808080" strokeWidth="0.4" />
        <text x="12" y="1">5 m</text>
        <text x="100" y="1" textAnchor="end">N ↑</text>
      </g>
    </svg>
  );
}

export function UnitInspector({ p, onBrochure, onEnquire }) {
  const { t, lang } = useLang();
  const [beds, setBeds] = useState(3);
  const [view, setView] = useState('plan');
  const plan = PLANS[beds];
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <Segmented
          layoutId="unit-view" label={t.modal.units} value={view} onChange={setView}
          options={[{ value: 'plan', label: t.modal.plan }, { value: 'exterior', label: t.modal.exterior }]}
        />
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div key={view + beds} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {view === 'plan' ? (
                <div className="p-4 sm:p-6"><FloorPlanSVG beds={beds} /></div>
              ) : (
                <div className="aspect-[4/3]"><Photo src={projectImages(p.id).gallery[(beds - 1) % Math.max(1, projectImages(p.id).gallery.length)]} alt={p.name} plate={['fins', 'curve', 'stair', 'arches'][beds - 1]} /></div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-3 text-xs text-g-50">{t.modal.sample}</p>
      </div>

      <div className="min-w-0">
        <p className="caption text-g-50">{t.modal.bedrooms}</p>
        <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-label={t.modal.bedrooms}>
          {[1, 2, 3, 4].map((b) => (
            <button
              key={b} type="button" role="radio" aria-checked={beds === b} onClick={() => setBeds(b)}
              className={cx('rounded-xl border py-3 text-lg font-display tabular-nums transition', beds === b ? 'border-white bg-white text-black' : 'border-white/15 text-white hover:border-white/40')}
            >
              {b === 4 ? '4+' : b}
            </button>
          ))}
        </div>
        <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {[
            [t.modal.bua, `${plan.bua} ${t.modal.sqm}`],
            [t.modal.baths, plan.baths],
            [t.modal.outdoor, `${plan.outdoor} ${t.modal.sqm}`],
            [t.modal.availableAs, p.types.map((ty) => t.types[ty]).join(', ')],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
              <dt className="text-sm text-g-50">{k}</dt>
              <dd className={cx('text-end font-medium tabular-nums', lang === 'en' && 'tracking-tightish')}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" onClick={onEnquire} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 font-medium text-black hover:bg-g-25">
            {t.modal.enquire} <ArrowRight size={16} className="rtl:rotate-180" />
          </button>
          <button type="button" onClick={onBrochure} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3.5 font-medium hover:bg-white/10">
            <Download size={16} /> {t.modal.brochure}
          </button>
        </div>
      </div>
    </div>
  );
}

export function GalleryViewer({ images, name }) {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const n = images.length;
  if (!n) return <p className="rounded-[6px] border border-white/10 p-10 text-center text-g-50">{t.modal.noGallery}</p>;
  const go = (d) => setI((v) => (v + d + n) % n);
  return (
    <div>
      <div
        className="relative h-[min(60svh,70vw)] max-h-[560px] w-full overflow-hidden rounded-[6px] bg-g-ink"
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Photo src={images[i]} alt={`${name} ${i + 1}`} eager />
          </motion.div>
        </AnimatePresence>
        {n > 1 && (
          <div className="absolute bottom-4 end-4 flex items-center gap-2">
            <span dir="ltr" className="caption me-2 text-white tabular-nums">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
            <button type="button" onClick={() => go(-1)} aria-label={t.modal.prevImg} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition hover:bg-white hover:text-black">
              <ArrowLeft size={16} className="rtl:rotate-180" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.modal.nextImg} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition hover:bg-white hover:text-black">
              <ArrowRight size={16} className="rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
      {n > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((src, k) => (
            <button
              key={src} type="button" onClick={() => setI(k)} aria-label={`${name} ${k + 1}`} aria-current={k === i}
              className={cx('relative aspect-[4/3] overflow-hidden rounded-[4px] transition-opacity duration-500', k === i ? 'opacity-100 ring-1 ring-white' : 'opacity-45 hover:opacity-80')}
            >
              <Photo src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AmenityList({ items }) {
  const { L } = useLang();
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => {
        const icon = amenityIcon(a.kind);
        return (
          <li key={a.en} className="flex items-center gap-4 rounded-[6px] border border-white/10 p-5">
            <span className="grid h-14 w-20 shrink-0 place-items-center rounded-[4px] bg-white/[0.04]">
              {icon ? <img src={icon} alt="" className="h-10 w-auto opacity-90" /> : <Sparkles size={20} strokeWidth={1.2} />}
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg">{L(a)}</span>
              {a.detail && <span className="mt-1 block text-sm text-g-50">{L(a.detail)}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}


/* ───────────────────────── concierge ───────────────────────── */

export function Field({ id, label, error, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block caption text-g-50">{label}</label>
      <div className="mt-1.5">{children}</div>
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-g-25">{error}</p>}
    </div>
  );
}

export const inputCls = 'w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-g-50 focus:border-white [&>option]:bg-g-ink';


function ConciergeModal({ open, session, context, onClose, onLead }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="concierge-title" className="max-w-xl">
      <ConciergeBody key={session} context={context} onClose={onClose} onLead={onLead} />
    </Modal>
  );
}

function ConciergeBody({ context, onClose, onLead }) {
  const { t, L, lang } = useLang();
  const c = t.concierge;
  const [tab, setTab] = useState(context?.intent === 'meeting' ? 'meeting' : 'call');
  const [form, setForm] = useState({ name: '', phone: '', project: context?.project || '', date: '', slot: 'morning', office: 'zamalek' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const today = new Date().toISOString().slice(0, 10);

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = c.errName;
    if (form.phone.replace(/\D/g, '').length < 10) err.phone = c.errPhone;
    setErrors(err);
    if (Object.keys(err).length) return;
    setSending(true);
    const payload = {
      kind: tab === 'meeting' ? 'meeting' : 'callback',
      intent: context?.intent || 'general',
      lang,
      ...form,
      date: tab === 'meeting' ? form.date : undefined,
      slot: tab === 'meeting' ? form.slot : undefined,
      office: tab === 'meeting' ? form.office : undefined,
    };
    try { await onLead?.(payload); } finally { setSending(false); }
    setDone(form.name.trim().split(' ')[0]);
  };

  const project = PROJECTS.find((p) => p.id === form.project);
  const waHref = CONTACT.whatsapp
    ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`G Developments${project ? ` · ${project.name}` : ''}`)}`
    : null;

  return (
      <div className="p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Caption>G Developments | {context?.intent === 'brochure' ? c.intentBrochure : c.tabs.call}</Caption>
            <h2 id="concierge-title" className={cx('mt-2 text-3xl font-display', lang === 'en' && 'tracking-tightish')}>{c.title}</h2>
            <p className="mt-2 text-sm text-g-25">{c.subtitle}</p>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        {done ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8" role="status">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black"><Check size={22} /></span>
            <p className="mt-5 text-2xl font-display">{c.done(done)}</p>
            <p className="mt-2 text-g-25">{c.doneText}</p>
            {!onLead && <p className="mt-4 caption text-g-50">{c.prototype}</p>}
            <button type="button" onClick={() => setDone(null)} className="mt-6 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white/10">{c.another}</button>
          </motion.div>
        ) : (
          <>
            <div className="mt-6">
              <Segmented layoutId="concierge-tab" label={c.title} value={tab} onChange={setTab}
                options={['call', 'meeting', 'whatsapp'].map((v) => ({ value: v, label: c.tabs[v] }))} />
            </div>

            {tab === 'whatsapp' ? (
              <div className="mt-6 rounded-2xl border border-white/10 p-5">
                <MessageCircle size={22} />
                <p className="mt-3 text-g-25">{waHref ? c.whatsappText : c.whatsappPending}</p>
                {waHref ? (
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-black">
                    {c.whatsappOpen} <ArrowUpRight size={16} />
                  </a>
                ) : (
                  <a href={`tel:${CONTACT.hotline}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-black">
                    <Phone size={16} /> <span className="tabular-nums">{CONTACT.hotline}</span>
                  </a>
                )}
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="cc-name" label={c.name} error={errors.name}>
                  <input id="cc-name" autoComplete="name" value={form.name} onChange={set('name')} className={inputCls} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cc-name-err' : undefined} />
                </Field>
                <Field id="cc-phone" label={c.phone} error={errors.phone}>
                  <div dir="ltr" className="flex">
                    <span className="grid place-items-center rounded-s-xl border border-e-0 border-white/15 bg-white/[0.06] px-3 text-sm text-g-25">+20</span>
                    <input id="cc-phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="10 1234 5678" value={form.phone} onChange={set('phone')} className={cx(inputCls, 'rounded-s-none')} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'cc-phone-err' : undefined} />
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field id="cc-project" label={c.destination}>
                    <select id="cc-project" value={form.project} onChange={set('project')} className={inputCls}>
                      <option value="">{c.anyDestination}</option>
                      {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.name} · {L(p.loc).split('·')[0].trim()}</option>)}
                    </select>
                  </Field>
                </div>
                {tab === 'meeting' && (
                  <>
                    <Field id="cc-date" label={c.date}>
                      <input id="cc-date" type="date" min={today} value={form.date} onChange={set('date')} className={inputCls} />
                    </Field>
                    <Field id="cc-office" label={c.office}>
                      <select id="cc-office" value={form.office} onChange={set('office')} className={inputCls}>
                        {CONTACT.offices.map((o) => <option key={o.id} value={o.id}>{o[lang]}</option>)}
                      </select>
                    </Field>
                    <fieldset className="sm:col-span-2">
                      <legend className="caption text-g-50">{c.slot}</legend>
                      <div className="mt-1.5 grid grid-cols-3 gap-2">
                        {Object.entries(c.slots).map(([k, v]) => (
                          <label key={k} className={cx('cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-medium transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white', form.slot === k ? 'border-white bg-white text-black' : 'border-white/15 hover:border-white/40')}>
                            <input type="radio" name="cc-slot" value={k} checked={form.slot === k} onChange={set('slot')} className="sr-only" />
                            {v}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </>
                )}
                <button type="submit" disabled={sending} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-black transition hover:bg-g-25 disabled:opacity-60 sm:col-span-2">
                  {tab === 'meeting' ? <CalendarDays size={17} /> : <Phone size={17} />}
                  {tab === 'meeting' ? c.submitMeeting : c.submitCall}
                </button>
                <p className="text-center text-xs text-g-50 sm:col-span-2">{t.hotline} <span className="font-medium tabular-nums text-g-25">{CONTACT.hotline}</span></p>
              </form>
            )}
          </>
        )}
      </div>
  );
}


/* ───────────────────────── page ───────────────────────── */

const RoutePage = lazy(() => import('./pages/index.jsx'));
const MapJourney = lazy(() => import('./MapJourney.jsx'));

export default function GDevelopments({ onLead, onNavigate, initialLang = 'en', showIntro = true }) {
  const [lang, setLang] = useState(initialLang);
  const [path, setPath] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname));
  // The logo intro only plays when the visit starts on the homepage.
  const [introOnLoad] = useState(() => showIntro && matchRoute(path).name === 'home');
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState(null);
  const [concierge, setConcierge] = useState({ open: false, context: null, session: 0 });
  const [toast, setToast] = useState('');
  const still = useStill();

  const ctx = useMemo(() => ({ lang, t: COPY[lang], L: (o) => (o && typeof o === 'object' ? o[lang] ?? o.en : o) }), [lang]);

  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; }, [lang]);

  const navigate = useCallback((to) => {
    if (to !== window.location.pathname) window.history.pushState(null, '', to);
    setPath(to);
    setMenuOpen(false);
  }, []);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const router = useMemo(() => ({ path, navigate }), [path, navigate]);

  const openConcierge = useCallback((context = null) => {
    setMenuOpen(false);
    setConcierge((c) => ({ open: true, context, session: c.session + 1 }));
  }, []);
  const closeConcierge = useCallback(() => setConcierge((c) => ({ ...c, open: false })), []);
  const clearToast = useCallback(() => setToast(''), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const onIntroDone = useCallback(() => setReady(true), []);

  const onRoute = useCallback((route, label) => {
    if (onNavigate) onNavigate(route);
    else setToast(COPY[lang].toastSoon(label));
  }, [onNavigate, lang]);

  return (
    <LangContext.Provider value={ctx}>
      <RouterContext.Provider value={router}>
        <MotionConfig reducedMotion={still ? "always" : "user"}>
          <SmoothScroll>
            <Page
              {...{ lang, setLang, path, ready, onIntroDone, showIntro: introOnLoad, menuOpen, setMenuOpen, closeMenu, filters, setFilters, concierge, openConcierge, closeConcierge, toast, clearToast, onRoute, onLead }}
            />
          </SmoothScroll>
        </MotionConfig>
      </RouterContext.Provider>
    </LangContext.Provider>
  );
}

function Home({ ready, filters, setFilters, openConcierge }) {
  const { scrollTo } = useSmoothScroll();
  useTitle('');
  const onSearch = useCallback((f) => {
    setFilters(f.loc || f.type || f.budget ? f : null);
    requestAnimationFrame(() => scrollTo('#destinations'));
  }, [setFilters, scrollTo]);
  return (
    <>
      <Hero ready={ready} onConcierge={() => openConcierge({ intent: 'meeting' })} />
      <FindHome onSearch={onSearch} />
      <Destinations key={filters ? JSON.stringify(filters) : 'all'} filters={filters} onClear={() => setFilters(null)} />
      <Suspense fallback={<div className="h-[100svh] bg-black" />}>
        <MapJourney openConcierge={openConcierge} />
      </Suspense>
      <ElasticString />
      <Amenities />
      <CtaBand onConcierge={() => openConcierge({ intent: 'meeting' })} />
    </>
  );
}

function Page({
  lang, setLang, path, ready, onIntroDone, showIntro, menuOpen, setMenuOpen, closeMenu, filters, setFilters,
  concierge, openConcierge, closeConcierge, toast, clearToast, onRoute, onLead,
}) {
  const { t } = useLang();
  const { toTop } = useSmoothScroll();
  const route = matchRoute(path);

  // New page: start at the top.
  useEffect(() => { toTop(); }, [path, toTop]);

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      className="min-h-screen overflow-x-clip bg-black font-text text-white antialiased"
    >
      <Intro enabled={showIntro} onDone={onIntroDone} skipLabel={t.intro.skip} />
      <GCursor />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[130] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      <ScrollProgress />
      <Header onMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} onConcierge={() => openConcierge({ intent: 'register' })} lang={lang} setLang={setLang} />
      <MenuOverlay open={menuOpen} onClose={closeMenu} onConcierge={() => openConcierge({ intent: 'tour' })} lang={lang} setLang={setLang} />
      <main id="main">
        {route.name === 'home' ? (
          <Home ready={ready} filters={filters} setFilters={setFilters} openConcierge={openConcierge} />
        ) : (
          <Suspense fallback={<div className="min-h-[100svh] bg-black" />}>
            <RoutePage route={route} openConcierge={openConcierge} onLead={onLead} />
          </Suspense>
        )}
      </main>
      <Footer onLead={onLead} onConcierge={() => openConcierge({ intent: 'tour' })} onRoute={onRoute} />
      <QuickContact onConcierge={() => openConcierge({ intent: 'general' })} />
      <ConciergeModal open={concierge.open} session={concierge.session} context={concierge.context} onClose={closeConcierge} onLead={onLead} />
      <Toast message={toast} onDone={clearToast} />
    </div>
  );
}
