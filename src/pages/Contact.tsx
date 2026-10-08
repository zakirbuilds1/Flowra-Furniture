import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, CircleCheck, Clock, Mail, MapPin, Phone } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Faq from '../components/Faq';
import { Field } from '../components/Checkout';
import { Panel, Reveal, SectionTitle } from '../components/Bits';
import { CONTACT, SHOWROOMS } from '../data/site';
import { useTitle } from '../lib/useTitle';

const TOPICS = ['Question about an order', 'Free design consultation', 'Free fabric swatches', 'Trade program', 'Press', 'Something else'];
const REGIONS = ['United States', 'United Kingdom', 'Canada', 'Europe', 'Somewhere else'];

type Form = { name: string; email: string; region: string; topic: string; order: string; message: string };
const EMPTY: Form = { name: '', email: '', region: '', topic: TOPICS[1], order: '', message: '' };

export default function Contact() {
  useTitle('Contact & showrooms | Flowra');
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sent, setSent] = useState<string | null>(null);

  const set = (k: keyof Form) => (e: { target: { value: string } }) => {
    setF(v => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors(er => ({ ...er, [k]: undefined }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const er: Partial<Record<keyof Form, string>> = {};
    if (f.name.trim().length < 2) er.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) er.email = 'Enter a valid email address.';
    if (!f.region) er.region = 'Choose where you are.';
    if (f.message.trim().length < 10) er.message = 'Tell us a little more (at least 10 characters).';
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSent(f.name.trim().split(' ')[0]);
    setF(EMPTY);
  };

  const selectClass = (bad?: string) =>
    `mt-1 w-full rounded-xl bg-white/85 border px-3.5 py-2.5 text-sm text-[rgba(30,50,90,0.95)] outline-none focus:border-[rgba(30,50,90,0.45)] ${bad ? 'border-rose-400' : 'border-[rgba(30,50,90,0.12)]'}`;

  return (
    <>
      <PageHeader
        image="h-contact"
        eyebrow="Contact"
        title="Let’s talk furniture."
        text="Questions about an order, fabric swatches or a whole-home project? Our design team replies within one business day."
        corner={
          <>
            <a
              href={`tel:${CONTACT.tel}`}
              aria-label={`Call ${CONTACT.phone}`}
              className="bg-[rgba(30,50,90,0.05)] w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-[rgba(30,50,90,0.1)] hover:bg-[rgba(30,50,90,0.1)]"
            >
              <Phone className="w-5 h-5 md:w-6 md:h-6 text-[rgba(30,50,90,0.8)]" />
            </a>
            <span className="flex flex-col">
              <span className="text-[16px] md:text-[20px] text-[rgba(30,50,90,0.95)]">{CONTACT.phone}</span>
              <span className="text-[12px] md:text-[15px] text-[rgba(30,50,90,0.6)]">Talk to a designer</span>
            </span>
          </>
        }
      />

      <Panel className="pt-6 md:pt-10">
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-3 md:gap-4 items-start">
          <div id="message" className="crystal scroll-mt-24 rounded-[1.5rem] md:rounded-[2.6rem] p-5 md:p-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative py-10 text-center">
                  <CircleCheck className="mx-auto w-14 h-14 text-[rgba(30,50,90,0.85)]" strokeWidth={1.25} />
                  <h2 className="mt-4 text-3xl tracking-tight text-[#5E6470]">Thanks, {sent}. Message received.</h2>
                  <p className="mt-2 text-[rgba(30,50,90,0.7)]">A Flowra designer will reply within one business day.</p>
                  <button onClick={() => setSent(null)} className="mt-6 rounded-full bg-white/80 hover:bg-white px-5 py-2.5 text-sm text-[rgba(30,50,90,0.9)]">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="relative">
                  <SectionTitle eyebrow="Send a message" title="How can we help?" />
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    <Field label="Your name" name="name" autoComplete="name" value={f.name} onChange={set('name')} error={errors.name} />
                    <Field label="Email" name="email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errors.email} />
                    <label className="block">
                      <span className="text-xs text-[rgba(30,50,90,0.65)]">Where are you?</span>
                      <select name="region" value={f.region} onChange={set('region')} aria-invalid={Boolean(errors.region)} className={selectClass(errors.region)}>
                        <option value="">Select</option>
                        {REGIONS.map(r => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                      {errors.region && <span className="mt-1 block text-xs text-rose-700">{errors.region}</span>}
                    </label>
                    <label className="block">
                      <span className="text-xs text-[rgba(30,50,90,0.65)]">Topic</span>
                      <select name="topic" value={f.topic} onChange={set('topic')} className={selectClass()}>
                        {TOPICS.map(t => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                    {f.topic === TOPICS[0] && <Field label="Order number (optional)" name="order" value={f.order} onChange={set('order')} wide />}
                    <label className="block sm:col-span-2">
                      <span className="text-xs text-[rgba(30,50,90,0.65)]">Message</span>
                      <textarea
                        name="message"
                        rows={5}
                        value={f.message}
                        onChange={set('message')}
                        aria-invalid={Boolean(errors.message)}
                        placeholder={f.topic === TOPICS[2] ? 'Which fabrics and finishes would you like to see? Include your delivery address.' : 'Tell us about your room, your timeline or your question.'}
                        className={`${selectClass(errors.message)} resize-y placeholder:text-[rgba(30,50,90,0.35)]`}
                      />
                      {errors.message && <span className="mt-1 block text-xs text-rose-700">{errors.message}</span>}
                    </label>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-5 inline-flex items-center gap-3 rounded-full bg-[rgba(30,50,90,0.85)] hover:bg-[rgba(30,50,90,1)] text-white pl-2 pr-6 py-2 text-sm transition-colors group"
                  >
                    <span className="bg-white/20 p-1.5 rounded-full">
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                    </span>
                    Send message
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="grid gap-3 md:gap-4">
            {[
              { icon: Phone, label: 'Call us', value: CONTACT.phone, href: `tel:${CONTACT.tel}` },
              { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { icon: Clock, label: 'Hours', value: CONTACT.hours },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="rounded-[1.4rem] md:rounded-[2rem] bg-white/60 border border-white/70 p-5 flex items-start gap-4">
                <span className="shrink-0 w-11 h-11 rounded-full bg-[rgba(30,50,90,0.06)] flex items-center justify-center text-[rgba(30,50,90,0.8)]">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-[rgba(30,50,90,0.55)]">{label}</span>
                  {href ? (
                    <a href={href} className="block mt-0.5 text-[rgba(30,50,90,0.95)] hover:underline break-words">
                      {value}
                    </a>
                  ) : (
                    <span className="block mt-0.5 text-[rgba(30,50,90,0.95)]">{value}</span>
                  )}
                </span>
              </div>
            ))}
            <div className="rounded-[1.4rem] md:rounded-[2rem] bg-[rgba(30,50,90,0.94)] text-white p-6">
              <p className="text-xs uppercase tracking-wider text-white/55">Trade program</p>
              <p className="mt-2 text-lg leading-snug">Designers and architects save 15% with a dedicated account manager.</p>
              <button
                onClick={() => {
                  setF(v => ({ ...v, topic: 'Trade program' }));
                  document.getElementById('message')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white text-[rgba(30,50,90,1)] px-4 py-2 text-sm"
              >
                Apply now <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="pt-20 md:pt-28" id="showrooms">
        <div className="px-1 md:px-4 mb-8 md:mb-10">
          <SectionTitle eyebrow="Showrooms" title="Sit on everything before you buy." text="Walk in any day, or book a private appointment with a designer." />
        </div>
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {SHOWROOMS.map((s, i) => (
            <Reveal key={s.city} delay={i * 0.08}>
              <article className="h-full rounded-[1.5rem] md:rounded-[2.4rem] bg-white/60 border border-white/70 p-6 md:p-8 flex flex-col">
                <h3 className="text-2xl md:text-3xl tracking-tight text-[#5E6470]">{s.city}</h3>
                <p className="mt-4 flex gap-2 text-sm text-[rgba(30,50,90,0.8)]">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {s.address}
                </p>
                <p className="mt-2 flex gap-2 text-sm text-[rgba(30,50,90,0.8)]">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" /> {s.hours}
                </p>
                <a href={`tel:${s.tel}`} className="mt-2 flex gap-2 text-sm text-[rgba(30,50,90,0.8)] hover:underline">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" /> {s.phone}
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-6 inline-flex items-center gap-2 text-sm text-[rgba(30,50,90,0.9)] group"
                >
                  Get directions <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel className="pt-20 md:pt-28" id="faq">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16 px-1 md:px-4">
          <SectionTitle eyebrow="FAQ" title="Delivery, returns and everything else." text="Can’t find your answer? Call us or send a message above." />
          <Faq />
        </div>
      </Panel>
    </>
  );
}
