/**
 * Opening sequence: plays the G Developments logo animation (from the brand team),
 * then lifts away on an elastic curtain. Skippable, shown once per browser session,
 * and skipped entirely for prefers-reduced-motion.
 */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import introMp4 from './assets/g-intro.mp4';
import introWebm from './assets/g-intro.webm';

const SEEN_KEY = 'g-intro-seen';

function alreadySeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}
function markSeen() {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable */ }
}

export default function Intro({ onDone, skipLabel = 'Skip intro', enabled = true }) {
  const [show, setShow] = useState(() => {
    if (!enabled || typeof window === 'undefined') return false;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return !alreadySeen();
  });
  const video = useRef(null);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    markSeen();
    setShow(false);
  };

  useEffect(() => {
    if (!show) { onDone?.(); return undefined; }
    const v = video.current;
    const fallback = setTimeout(finish, 7500);
    v?.play?.().catch(() => { setTimeout(finish, 1600); });
    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          role="presentation"
          className="fixed inset-0 z-[200] bg-black"
          exit={{ y: '-100%' }}
          transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
        >
          <video
            ref={video}
            muted
            playsInline
            autoPlay
            preload="auto"
            onEnded={finish}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={introWebm} type="video/webm" />
            <source src={introMp4} type="video/mp4" />
          </video>
          {/* elastic lower edge that bows as the curtain lifts */}
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-full block h-[18vh] w-full"
          >
            <motion.path
              fill="#000"
              initial={{ d: 'M0 0 L100 0 L100 0 Q50 0 0 0 Z' }}
              exit={{ d: ['M0 0 L100 0 L100 0 Q50 0 0 0 Z', 'M0 0 L100 0 L100 0 Q50 8 0 0 Z', 'M0 0 L100 0 L100 0 Q50 0 0 0 Z'] }}
              transition={{ duration: 1.15, times: [0, 0.5, 1], ease: 'easeInOut' }}
            />
          </motion.svg>
          <button
            type="button"
            onClick={finish}
            className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] end-6 rounded-full border border-white/20 px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white/80 transition hover:bg-white hover:text-black"
          >
            {skipLabel}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
