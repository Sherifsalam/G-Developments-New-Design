/**
 * Elastic interaction kit — spring physics used across the G Developments homepage.
 *   <SmoothScroll>      Lenis inertia scrolling + anchor handling (stops while overlays are open)
 *   <GCursor>           solid white "G" dot that replaces the mouse pointer (mouse devices only)
 *   <Elastic>           magnetic button with squash-and-stretch and a bouncy release
 *   <ElasticWordmark>   letters that lift like a plucked string under the pointer
 *   <ElasticString>     hairline divider that bends with scroll speed and wobbles back
 */
import {
  createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import Lenis from 'lenis';
import {
  motion, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity,
} from 'framer-motion';
import { isPhone, isStill, useStill } from './motion.js';

const cx = (...c) => c.filter(Boolean).join(' ');
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;

/* ───────── smooth scroll ───────── */

const ScrollCtx = createContext({ scrollTo: (t) => document.querySelector(t)?.scrollIntoView({ behavior: 'smooth' }), toTop: () => window.scrollTo(0, 0), lock: () => {}, unlock: () => {} });
export const useSmoothScroll = () => useContext(ScrollCtx);

export function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const locks = useRef(0);

  useEffect(() => {
    // Phones scroll natively: Lenis' inertia fights iOS momentum scrolling and the toolbar resize.
    if (prefersReduced() || isPhone()) return undefined;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, []);

  const api = useMemo(() => ({
    scrollTo(target, opts = {}) {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -72, duration: 1.4, ...opts });
      else el.scrollIntoView({ behavior: isStill() ? 'auto' : 'smooth', block: 'start' });
    },
    /** Jump to the top without easing (used on page changes). */
    toTop() {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    },
    lock() {
      locks.current += 1;
      lenisRef.current?.stop();
      document.documentElement.style.overflow = 'hidden';
    },
    unlock() {
      locks.current = Math.max(0, locks.current - 1);
      if (locks.current === 0) {
        lenisRef.current?.start();
        document.documentElement.style.overflow = '';
      }
    },
  }), []);

  // Same-page anchors glide instead of jumping.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const id = a.getAttribute('href');
      if (id.length < 2 || !document.querySelector(id)) return;
      e.preventDefault();
      api.scrollTo(id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [api]);

  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>;
}

/** Locks page scroll while `active` is true (modals, menu, intro). */
export function useScrollLock(active) {
  const { lock, unlock } = useSmoothScroll();
  useEffect(() => {
    if (!active) return undefined;
    lock();
    return unlock;
  }, [active, lock, unlock]);
}

/* ───────── G cursor ───────── */

const TEXT_FIELD = 'input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]), textarea, select, [contenteditable="true"]';
const CLICKABLE = 'a, button, select, label[for], [role="tab"], [role="radio"]';

/**
 * Solid white circle with a "G", pinned to the pointer. Grows a little over links and buttons,
 * squeezes on click. Text fields keep the native caret so typing still feels normal.
 */
export function GCursor() {
  const [enabled] = useState(() => finePointer());
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [field, setField] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.classList.add('g-cursor');
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); setVisible(true); };
    const over = (e) => {
      const el = e.target;
      setField(!!el.closest?.(TEXT_FIELD));
      setHover(!!el.closest?.(CLICKABLE));
    };
    const leave = () => setVisible(false);
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', dn);
    window.addEventListener('pointerup', up);
    return () => {
      root.classList.remove('g-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', dn);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[140]" style={{ x, y }}>
      <motion.div
        className="latin-display -ml-[11px] -mt-[11px] grid h-[22px] w-[22px] place-items-center rounded-full bg-white text-[12px] leading-none text-black shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_4px_14px_rgba(0,0,0,0.35)]"
        animate={{ scale: down ? 0.82 : hover ? 1.3 : 1, opacity: visible && !field ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26, mass: 0.5 }}
      >
        G
      </motion.div>
    </motion.div>
  );
}

/* ───────── elastic magnetic button ───────── */

const BOUNCE = { stiffness: 220, damping: 26, mass: 0.6 };

export function Elastic({ as = 'button', children, className = '', innerClassName = '', strength = 0.12, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, BOUNCE);
  const sy = useSpring(y, BOUNCE);
  const scaleX = useSpring(1, BOUNCE);
  const scaleY = useSpring(1, BOUNCE);
  const ix = useTransform(sx, (v) => v * 0.3);
  const iy = useTransform(sy, (v) => v * 0.3);
  const Tag = motion[as];
  const still = useStill();

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
    const k = Math.min(1, Math.abs(dx) / (r.width / 2));
    scaleX.set(1 + k * 0.015);
    scaleY.set(1 - k * 0.01);
  };
  const reset = () => { x.set(0); y.set(0); scaleX.set(1); scaleY.set(1); };

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileTap={still ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', ...BOUNCE }}
      style={{ x: sx, y: sy, scaleX, scaleY }}
      className={className}
      {...props}
    >
      <motion.span className={cx('relative inline-flex items-center justify-center gap-2', innerClassName)} style={{ x: ix, y: iy }}>
        {children}
      </motion.span>
    </Tag>
  );
}

/* ───────── elastic wordmark ───────── */

function Letter({ ch, index, px, py, reveal, delay }) {
  const still = useStill();
  const ref = useRef(null);
  const center = useRef({ x: 0, y: 0, w: 1 });
  useLayoutEffect(() => {
    const measure = () => {
      const r = ref.current?.getBoundingClientRect();
      if (r) center.current = { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY, w: Math.max(r.width, 20) };
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current?.parentElement) ro.observe(ref.current.parentElement);
    window.addEventListener('resize', measure);
    document.fonts?.ready?.then(measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  const influence = (mx, my) => {
    const c = center.current;
    const dx = (mx + window.scrollX - c.x) / (c.w * 2.2);
    const dy = (my + window.scrollY - c.y) / (c.w * 3);
    return Math.exp(-(dx * dx + dy * dy));
  };
  const lift = useTransform([px, py], ([mx, my]) => -influence(mx, my) * c2(center.current.w));
  const stretch = useTransform([px, py], ([mx, my]) => 1 + influence(mx, my) * 0.03);
  const y = useSpring(lift, { stiffness: 180, damping: 22, mass: 0.6 });
  const scaleY = useSpring(stretch, { stiffness: 180, damping: 22, mass: 0.6 });
  return (
    <motion.span
      ref={ref}
      className="inline-block origin-bottom whitespace-pre"
      initial={still ? false : { y: '110%' }}
      animate={still ? undefined : reveal ? { y: '0%' } : { y: '110%' }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: delay + index * 0.04 }}
    >
      <motion.span className="inline-block origin-bottom" style={{ y, scaleY }}>{ch}</motion.span>
    </motion.span>
  );
}
const c2 = (w) => Math.min(14, w * 0.09);

export function ElasticWordmark({ text = 'G Developments', reveal = true, delay = 0.1, inView = false }) {
  const px = useMotionValue(-9999);
  const py = useMotionValue(-9999);
  const [live] = useState(() => finePointer() && !prefersReduced());
  // `inView` (the footer) waits until the wordmark is scrolled to. It watches the wordmark box
  // itself: the letters start pushed 110% down, out of their own box, and at the very bottom of
  // the page they can never scroll into view — watching them meant they never rose at all.
  const box = useRef(null);
  const seen = useInView(box, { once: true, amount: 0.3 });
  const show = inView ? seen : reveal;
  return (
    <span
      ref={box}
      aria-hidden="true"
      className="flex overflow-hidden pb-[0.08em] pt-[0.1em]"
      onPointerMove={live ? (e) => { px.set(e.clientX); py.set(e.clientY); } : undefined}
      onPointerLeave={live ? () => { px.set(-9999); py.set(-9999); } : undefined}
    >
      {text.split('').map((ch, i) => <Letter key={i} ch={ch} index={i} px={px} py={py} reveal={show} delay={delay} />)}
    </span>
  );
}

/* ───────── elastic string divider ───────── */

export function ElasticString({ className = '' }) {
  const still = useStill();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const bendTarget = useTransform(velocity, [-3000, 0, 3000], [-12, 0, 12], { clamp: true });
  const bend = useSpring(bendTarget, { stiffness: 120, damping: 16, mass: 0.8 });
  const d = useTransform(bend, (b) => `M0 40 Q 600 ${40 + b} 1200 40`);
  if (still) {
    return (
      <svg aria-hidden="true" viewBox="0 0 1200 80" preserveAspectRatio="none" className={cx('block h-16 w-full', className)}>
        <path d="M0 40 L1200 40" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 80" preserveAspectRatio="none" className={cx('block h-16 w-full', className)}>
      <motion.path d={d} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
