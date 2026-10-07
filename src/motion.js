/**
 * One switch for "no decorative motion": phones, plus anyone who asks their OS for reduced motion.
 * On a phone the page is static — no scroll reveals, parallax, smooth-scroll inertia, springs or
 * intro — which also removes the jitter those caused while iOS Safari's toolbar resizes the viewport.
 * The homepage map (MapJourney.jsx) is the one exception and keeps its own scroll-driven motion.
 * Desktop and tablet are unchanged.
 */
import { useSyncExternalStore } from 'react';

export const PHONE_QUERY = '(max-width: 767px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const match = (q) => typeof window !== 'undefined' && !!window.matchMedia?.(q).matches;

/** Non-reactive check, for code that runs once (Lenis setup, the intro). */
export const isPhone = () => match(PHONE_QUERY);
export const isStill = () => match(PHONE_QUERY) || match(REDUCED_QUERY);

function subscribe(cb) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const lists = [PHONE_QUERY, REDUCED_QUERY].map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener?.('change', cb));
  return () => lists.forEach((l) => l.removeEventListener?.('change', cb));
}

/** Drop-in replacement for framer-motion's useReducedMotion that also covers phones. */
export function useStill() {
  return useSyncExternalStore(subscribe, isStill, () => false);
}
