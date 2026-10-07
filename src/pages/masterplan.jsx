/**
 * Masterplan and phases for a community.
 *
 * Two things sit here, and a project may have either or both:
 *   Zones   areas of the resort, pinned to the plan drawing. Choosing one — by clicking its marker,
 *           by keyboard, or from the list — shows that zone's render and description.
 *   Phases  what is actually being sold. Choosing a phase shows its status, payment terms and the
 *           unit types with their starting prices. A phase with an `at` also gets a plan marker.
 *
 * "Open full plan" puts the drawing in a dialog you can zoom and drag, markers kept in place,
 * with a link to the brochure for anyone who would rather read it as a document.
 *
 * Accessibility: markers are real buttons in a labelled group, so they are reachable by Tab and
 * announced with their name; each list is a set of tabs over one live panel; the dialog reuses
 * <Modal> (focus trap + Escape). Zooming is available as buttons, not only as a pinch.
 */
import { useCallback, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Download, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react';
import {
  BTN_GHOST, Caption, CloseButton, Modal, Photo, cx, useLang,
} from '../GDevelopments.jsx';
import { MASTERPLANS, MASTERPLAN_UI, PROJECT_PHASES } from '../content-pages.js';
import { PLAYA_GHAZALA_MEDIA, PROJECT_MEDIA, mediaUrl } from '../media.js';
import { SectionTitle, WRAP } from './shared.jsx';

/** Panels slide in when they are switched; readers who ask for less motion just get them. */
const usePanelMotion = () => (useReducedMotion() ? {} : {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
});

/** Zone artwork lives with the other media; the content file only names which render to use. */
const ZONE_IMAGE = (key) => mediaUrl(PLAYA_GHAZALA_MEDIA.zones[key]);

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const num = (i) => String(i + 1).padStart(2, '0');

/** One numbered marker pinned to its percentage position on the plan. */
function Marker({
  item, index, active, onSelect, compact,
}) {
  const { L } = useLang();
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-pressed={active}
      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{ left: `${item.at.x}%`, top: `${item.at.y}%` }}
    >
      <span className="sr-only">{L(item.name)}</span>
      <span
        aria-hidden="true"
        className={cx(
          'flex items-center justify-center rounded-full border-2 font-display tabular-nums shadow-[0_6px_18px_rgba(0,0,0,0.5)] transition-all duration-300',
          compact ? 'h-7 w-7 text-[11px]' : 'h-9 w-9 text-[13px]',
          active
            ? 'scale-110 border-white bg-white text-black'
            : 'border-white/80 bg-black/80 text-white backdrop-blur-sm group-hover:scale-110 group-hover:bg-white group-hover:text-black',
        )}
      >
        {num(index)}
      </span>
      {active && <span aria-hidden="true" className="absolute inset-0 -z-10 animate-ping rounded-full bg-white/40" />}
    </button>
  );
}

/** The plan drawing with whatever markers it carries. Used inline and inside the dialog. */
function Plan({
  src, alt, marked, selected, onSelect, onOpen, compact = false, className = '',
}) {
  const { L } = useLang();
  const img = <img src={src} alt={alt} className="block h-auto w-full select-none" draggable={false} />;
  return (
    <div className={cx('relative', className)}>
      {onOpen ? (
        // The photo is its own button (markers sit beside it, not inside, so buttons never nest).
        <button type="button" onClick={onOpen} aria-label={L(MASTERPLAN_UI.enlarge)} className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white">
          {img}
        </button>
      ) : img}
      {marked.map((it, i) => (
        <Marker key={it.id} item={it} index={i} active={selected === it.id} onSelect={onSelect} compact={compact} />
      ))}
    </div>
  );
}

/** Full-plan dialog: zoom with the buttons or the wheel, drag to pan. */
function PlanDialog({
  open, onClose, title, src, alt, brochure, marked, selected, onSelect, titleId,
}) {
  const { L } = useLang();
  const u = MASTERPLAN_UI;
  const [view, setView] = useState({ z: 1, x: 0, y: 0 });
  const drag = useRef(null);

  // Every way out (button, backdrop, Escape) lands here, so the next open starts at 100%.
  const close = () => { setView({ z: 1, x: 0, y: 0 }); onClose(); };

  const zoomBy = useCallback((f) => setView((v) => {
    const z = clamp(v.z * f, 1, 4);
    const k = z / v.z;
    return z === 1 ? { z: 1, x: 0, y: 0 } : { z, x: v.x * k, y: v.y * k };
  }), []);

  const onPointerDown = (e) => {
    if (view.z === 1 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX - view.x, y: e.clientY - view.y };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    setView((v) => ({ ...v, x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }));
  };
  const endDrag = () => { drag.current = null; };

  return (
    <Modal open={open} onClose={close} labelledBy={titleId} className="h-[92svh] w-full max-w-[1200px] sm:h-[88svh]">
      <div className="flex h-full flex-col bg-g-ink">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
          <h2 id={titleId} className="font-display text-lg">{title}</h2>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => zoomBy(1 / 1.5)} disabled={view.z <= 1} aria-label={L(u.zoomOut)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:bg-white hover:text-black disabled:opacity-30">
              <Minus size={15} />
            </button>
            <span aria-hidden="true" className="w-11 text-center text-[12px] tabular-nums text-g-25">{Math.round(view.z * 100)}%</span>
            <button type="button" onClick={() => zoomBy(1.5)} disabled={view.z >= 4} aria-label={L(u.zoomIn)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:bg-white hover:text-black disabled:opacity-30">
              <Plus size={15} />
            </button>
            <button type="button" onClick={() => setView({ z: 1, x: 0, y: 0 })} aria-label={L(u.reset)} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:bg-white hover:text-black">
              <RotateCcw size={14} />
            </button>
            <CloseButton onClick={close} />
          </div>
        </div>

        <div
          className={cx('relative flex-1 overflow-hidden bg-black', view.z > 1 && 'cursor-grab active:cursor-grabbing')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onWheel={(e) => zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12)}
        >
          <div className="grid h-full w-full place-items-center p-3 sm:p-6">
            <div className="max-h-full touch-none" style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.z})` }}>
              <Plan
                src={src} alt={alt} marked={marked} selected={selected} onSelect={onSelect} compact
                className="max-h-[78svh] w-auto [&_img]:max-h-[78svh] [&_img]:w-auto"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-[12px] text-g-50 sm:px-6">
          <p>{L(u.note)}</p>
          {brochure && (
            <a href={brochure} download className="inline-flex items-center gap-2 text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
              <Download size={14} /> {L(u.download)}
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}

/** A row of pills that picks one item from a list, over one live panel. */
function Picker({
  items, selected, onSelect, label, baseId, panelId,
}) {
  const { L } = useLang();
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {items.map((it, i) => {
        const on = selected === it.id;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${it.id}`}
            aria-selected={on}
            aria-controls={panelId}
            onClick={() => onSelect(on ? null : it.id)}
            className={cx(
              'flex items-center gap-3 rounded-full border px-4 py-2.5 text-start transition',
              on ? 'border-white bg-white text-black' : 'border-white/15 text-g-25 hover:border-white/40 hover:text-white',
            )}
          >
            <span dir="ltr" className={cx('caption tabular-nums', on ? 'text-black/50' : 'text-g-50')}>{num(i)}</span>
            <span className="font-display text-[15px]">{L(it.name)}</span>
          </button>
        );
      })}
    </div>
  );
}

/** The selected phase: status, payment terms and the unit types with starting prices. */
function PhaseDetail({ phase }) {
  const { L, lang } = useLang();
  const u = MASTERPLAN_UI;
  const panel = usePanelMotion();
  return (
    <motion.div key={phase.id} {...panel}>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className={cx('font-display text-[clamp(1.3rem,2vw,1.7rem)]', lang === 'en' && 'tracking-tightish')}>{L(phase.name)}</h3>
        {phase.status && <span className="caption rounded-full border border-white/25 px-3 py-1 text-g-25">{L(phase.status)}</span>}
      </div>
      <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-g-25">{L(phase.text)}</p>
      {phase.terms && (
        <p className="mt-4 flex flex-wrap items-baseline gap-2 text-[14px]">
          <span className="caption text-g-50">{L(u.terms)}</span>
          <span dir="ltr" className="font-medium">{L(phase.terms)}</span>
        </p>
      )}

      {phase.units.length > 0 && (
        <>
          <table className="mt-6 w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-white/15">
                <th scope="col" className="caption py-3 pe-4 text-start font-normal text-g-50">{L(u.unitType)}</th>
                <th scope="col" className="caption py-3 pe-4 text-start font-normal text-g-50">{L(u.area)}</th>
                <th scope="col" className="caption py-3 text-end font-normal text-g-50">{L(u.from)}</th>
              </tr>
            </thead>
            <tbody>
              {phase.units.map((un) => (
                <tr key={un.type.en} className="border-b border-white/10">
                  <td className="py-3 pe-4">{L(un.type)}</td>
                  <td dir="ltr" className="py-3 pe-4 text-g-25 rtl:text-end">{un.area}</td>
                  <td dir="ltr" className="py-3 text-end font-medium tabular-nums">{un.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[12px] text-g-50">{L(u.indicative)}</p>
        </>
      )}
    </motion.div>
  );
}

export default function Masterplan({ projectId, projectName }) {
  const { L, lang } = useLang();
  const u = MASTERPLAN_UI;
  const plan = MASTERPLANS[projectId];
  const phases = PROJECT_PHASES[projectId] || [];
  const planSrc = mediaUrl(PROJECT_MEDIA[projectId]?.masterplan);
  const baseId = useId();
  const panel = usePanelMotion();
  const [zone, setZone] = useState(null);
  const [phase, setPhase] = useState(phases[0]?.id || null);
  const [open, setOpen] = useState(false);

  const zones = plan?.zones || [];
  if (!zones.length && !phases.length && !planSrc) return null;

  // Markers only go on a real plan drawing, and only for items that say where they sit.
  const marked = planSrc ? (zones.length ? zones : phases.filter((ph) => ph.at)) : [];
  const onPlan = zones.length ? zone : phase;
  const setOnPlan = zones.length ? setZone : setPhase;
  const activeZone = zones.find((z) => z.id === zone) || null;
  const activePhase = phases.find((ph) => ph.id === phase) || null;
  const zonePanelId = `${baseId}-zone-panel`;
  const phasePanelId = `${baseId}-phase-panel`;
  const title = L(plan ? plan.title : planSrc ? u.masterplan : u.phases);
  const alt = plan ? L(plan.planAlt) : `${projectName} masterplan`;

  return (
    <section id="masterplan" aria-labelledby={`${baseId}-title`} className="scroll-mt-24 border-t border-white/10 bg-black">
      <div className={cx(WRAP, 'py-11 md:py-16')}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle id={`${baseId}-title`} title={title} subtitle={plan ? L(plan.subtitle) : projectName} />
          {planSrc && (
            <button type="button" onClick={() => setOpen(true)} className={cx(BTN_GHOST, 'inline-flex items-center gap-2')}>
              <Maximize2 size={16} /> {L(u.open)}
            </button>
          )}
        </div>
        {plan && <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-g-25">{L(plan.intro)}</p>}

        <div className={cx('mt-10 grid gap-8', planSrc && (zones.length || phases.length) && 'lg:grid-cols-12')}>
          {planSrc && (
            <div className={cx(zones.length || phases.length ? 'lg:col-span-7' : 'mx-auto')}>
              <div
                role="group"
                aria-label={L(zones.length ? u.pick : u.pickPhase)}
                className="relative mx-auto max-h-[68svh] w-fit overflow-hidden rounded-[6px] border border-white/10 bg-g-ink"
              >
                <Plan
                  src={planSrc} alt={alt} marked={marked} selected={onPlan} onSelect={setOnPlan}
                  onOpen={() => setOpen(true)}
                  className="max-h-[68svh] [&_img]:max-h-[68svh] [&_img]:w-auto"
                />
              </div>
              <p className="mt-3 text-[12px] text-g-50">{L(u.note)}</p>
            </div>
          )}

          <div className={cx(planSrc && 'lg:col-span-5')}>
            {zones.length > 0 && (
              <>
                <Caption className="text-g-50">{L(u.zones)}</Caption>
                <div className="mt-4">
                  <Picker items={zones} selected={zone} onSelect={setZone} label={L(u.zones)} baseId={`${baseId}-z`} panelId={zonePanelId} />
                </div>
                <div id={zonePanelId} role="tabpanel" aria-live="polite" aria-labelledby={activeZone ? `${baseId}-z-tab-${activeZone.id}` : undefined} className="mt-6">
                  {activeZone ? (
                    <motion.div key={activeZone.id} {...panel}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-g-ink">
                        <Photo src={ZONE_IMAGE(activeZone.image)} alt={L(activeZone.name)} />
                      </div>
                      <h3 className={cx('mt-5 font-display text-[clamp(1.3rem,2vw,1.7rem)]', lang === 'en' && 'tracking-tightish')}>{L(activeZone.name)}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-g-25">{L(activeZone.text)}</p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {activeZone.tags.map((tg) => (
                          <li key={tg.en} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-g-25">{L(tg)}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : (
                    <div className="rounded-[6px] border border-dashed border-white/15 px-5 py-8 text-center text-[14px] text-g-50">{L(u.pick)}</div>
                  )}
                </div>
              </>
            )}

            {phases.length > 0 && (
              <div className={cx(zones.length > 0 && 'mt-12 border-t border-white/10 pt-10')}>
                <Caption className="text-g-50">{L(u.phases)}</Caption>
                <div className="mt-4">
                  <Picker items={phases} selected={phase} onSelect={(v) => setPhase(v || phases[0].id)} label={L(u.phases)} baseId={`${baseId}-p`} panelId={phasePanelId} />
                </div>
                <div id={phasePanelId} role="tabpanel" aria-live="polite" aria-labelledby={activePhase ? `${baseId}-p-tab-${activePhase.id}` : undefined} className="mt-6">
                  {activePhase && <PhaseDetail phase={activePhase} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {planSrc && (
        <PlanDialog
          open={open} onClose={() => setOpen(false)} title={title} src={planSrc} alt={alt}
          brochure={plan?.brochure} marked={marked} selected={onPlan} onSelect={setOnPlan}
          titleId={`${baseId}-dialog`}
        />
      )}
    </section>
  );
}

/**
 * A masterplan photo that opens the zoomable viewer when clicked. Used by the project page's
 * Gallery / Masterplan tabs, where the plan has no markers of its own.
 */
export function PlanLightbox({ src, alt, title }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mx-auto w-fit overflow-hidden rounded-[6px] border border-white/10 bg-g-ink">
        <Plan
          src={src} alt={alt} marked={[]} onOpen={() => setOpen(true)}
          className="max-h-[70svh] [&_img]:max-h-[70svh] [&_img]:w-auto"
        />
      </div>
      <PlanDialog
        open={open} onClose={() => setOpen(false)} title={title} src={src} alt={alt}
        marked={[]} selected={null} onSelect={() => {}} titleId={`${baseId}-dialog`}
      />
    </>
  );
}
