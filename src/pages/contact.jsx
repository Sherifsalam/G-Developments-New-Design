/** /contact: inquiry form and contact details. */
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Check, Mail, MapPin, Phone,
} from 'lucide-react';
import {
  BTN_LIGHT, Field, Photo, cx, inputCls, useLang, useTitle,
} from '../GDevelopments.jsx';
import { CONTACT } from '../content.js';
import { HQ_OFFICE, mediaUrl } from '../media.js';
import { EMAIL_RE, PageHero, WRAP } from './shared.jsx';

function ContactForm({ onLead }) {
  const { t, lang } = useLang();
  const c = t.pages.contact;
  const blank = { type: '', name: '', email: '', phone: '', message: '' };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.type) err.type = c.errType;
    if (!form.name.trim()) err.name = t.concierge.errName;
    if (!EMAIL_RE.test(form.email)) err.email = c.errEmail;
    if (form.phone.replace(/\D/g, '').length < 10) err.phone = t.concierge.errPhone;
    setErrors(err);
    if (Object.keys(err).length) return;
    setSending(true);
    try { await onLead?.({ kind: 'inquiry', lang, ...form }); } finally { setSending(false); }
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} role="status" className="rounded-2xl border border-white/10 p-8">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black"><Check size={22} /></span>
        <p className="mt-5 text-2xl font-display">{c.done}</p>
        {!onLead && <p className="caption mt-4 text-g-50">{t.concierge.prototype}</p>}
        <button type="button" onClick={() => { setForm(blank); setSent(false); }} className="mt-6 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white/10">{c.another}</button>
      </motion.div>
    );
  }

  const describe = (k) => (errors[k] ? `ct-${k}-err` : undefined);
  return (
    <form noValidate onSubmit={submit} className="grid gap-5 sm:grid-cols-2" aria-label={c.subtitle}>
      <div className="sm:col-span-2">
        <Field id="ct-type" label={c.inquiry} error={errors.type}>
          <select id="ct-type" value={form.type} onChange={set('type')} className={inputCls} aria-invalid={!!errors.type} aria-describedby={describe('type')}>
            <option value="">{c.choose}</option>
            {Object.entries(c.inquiries).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
      </div>
      <Field id="ct-name" label={c.name} error={errors.name}>
        <input id="ct-name" autoComplete="name" value={form.name} onChange={set('name')} className={inputCls} aria-invalid={!!errors.name} aria-describedby={describe('name')} />
      </Field>
      <Field id="ct-email" label={c.email} error={errors.email}>
        <input id="ct-email" type="email" inputMode="email" autoComplete="email" dir="ltr" value={form.email} onChange={set('email')} className={inputCls} aria-invalid={!!errors.email} aria-describedby={describe('email')} />
      </Field>
      <div className="sm:col-span-2">
        <Field id="ct-phone" label={c.phone} error={errors.phone}>
          <div dir="ltr" className="flex">
            <span className="grid shrink-0 place-items-center whitespace-nowrap rounded-s-xl border border-e-0 border-white/15 bg-white/[0.06] px-3 text-sm text-g-25">EG +20</span>
            <input id="ct-phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="10 1234 5678" value={form.phone} onChange={set('phone')} className={cx(inputCls, 'rounded-s-none')} aria-invalid={!!errors.phone} aria-describedby={describe('phone')} />
          </div>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field id="ct-message" label={c.message}>
          <textarea id="ct-message" rows={5} value={form.message} onChange={set('message')} className={cx(inputCls, 'resize-y')} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={sending} className={cx(BTN_LIGHT, 'inline-flex items-center gap-2 disabled:opacity-60')}>
          {c.send} <ArrowRight size={16} className="rtl:rotate-180" />
        </button>
      </div>
    </form>
  );
}

export function ContactPage({ onLead }) {
  const { t, L, lang } = useLang();
  const c = t.pages.contact;
  useTitle(c.title);
  return (
    <>
      <PageHero eyebrow={t.nav.contact} title={c.title} subtitle={c.subtitle} text={c.text} />
      <section aria-label={c.title} className="bg-black">
        <div className={cx(WRAP, 'grid gap-10 pb-14 md:pb-16 lg:grid-cols-12')}>
          <div className="lg:col-span-7"><ContactForm onLead={onLead} /></div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="caption text-g-50">{c.details}</h2>
            <ul className="mt-5 space-y-4 text-[15px]">
              <li>
                <a href={`tel:${CONTACT.hotline}`} className="inline-flex items-center gap-3 font-display text-3xl tabular-nums">
                  <Phone size={20} strokeWidth={1.6} /> {CONTACT.hotline}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-3 text-g-25 transition hover:text-white">
                  <Mail size={17} strokeWidth={1.6} /> {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3 text-g-25">
                <MapPin size={17} strokeWidth={1.6} className="mt-1 shrink-0" />
                <span>
                  {L(CONTACT.address)}
                  <a href={HQ_OFFICE.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1.5 text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                    {c.directions} <ArrowUpRight size={14} className="rtl:-scale-x-100" />
                  </a>
                </span>
              </li>
            </ul>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[6px] bg-g-ink">
              <Photo src={mediaUrl(HQ_OFFICE.image)} alt={L(CONTACT.address)} />
            </div>
            <h2 className="caption mt-10 text-g-50">{c.offices}</h2>
            <ul className="mt-4 divide-y divide-white/10 border-y border-white/10 text-[15px] text-g-25">
              {CONTACT.offices.map((o) => <li key={o.id} className="py-3">{o[lang]}</li>)}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
