import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CircleCheck, Lock, X } from 'lucide-react';
import { Img } from './Img';
import { useCart, useTotals } from '../lib/cart';
import { useCurrency } from '../lib/currency';
import { useScrollLock } from '../lib/ui';

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Ireland',
  'Germany',
  'France',
  'Netherlands',
  'Switzerland',
  'Sweden',
  'Denmark',
  'Norway',
  'United Arab Emirates',
  'Singapore',
];

const PAYMENTS = ['Credit or debit card', 'Apple Pay', 'PayPal', 'Pay in 4 instalments'];

type Fields = { email: string; name: string; phone: string; address: string; city: string; postcode: string; country: string; payment: string };
const EMPTY: Fields = { email: '', name: '', phone: '', address: '', city: '', postcode: '', country: '', payment: PAYMENTS[0] };

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address.';
  if (f.name.trim().length < 2) e.name = 'Enter your full name.';
  if (f.address.trim().length < 5) e.address = 'Enter your street address.';
  if (!f.city.trim()) e.city = 'Enter your city.';
  if (f.postcode.trim().length < 3) e.postcode = 'Enter your ZIP or postcode.';
  if (!f.country) e.country = 'Choose a country.';
  if (f.phone && f.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number, or leave it blank.';
  return e;
}

export default function Checkout() {
  const { checkoutOpen, setCheckoutOpen, clear, promo } = useCart();
  const { money } = useCurrency();
  const t = useTotals();
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [order, setOrder] = useState<{ id: string; total: string; name: string; email: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useScrollLock(checkoutOpen);

  useEffect(() => {
    if (!checkoutOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const close = () => {
    setCheckoutOpen(false);
    if (order) {
      setOrder(null);
      setF(EMPTY);
    }
  };

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setF(v => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors(er => ({ ...er, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er = validate(f);
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setOrder({ id: `FL-${Math.floor(100000 + Math.random() * 900000)}`, total: money(t.total), name: f.name.trim().split(' ')[0], email: f.email.trim() });
    clear();
  };

  return createPortal(
    <AnimatePresence>
      {checkoutOpen && (
        <motion.div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[rgba(20,30,50,0.4)] backdrop-blur-[3px]" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="relative w-full sm:max-w-4xl max-h-[94vh] overflow-y-auto soft-scroll bg-[#f4f4f4]/95 backdrop-blur-2xl rounded-t-[2rem] sm:rounded-[2rem] border border-white/70 shadow-[0_40px_100px_-30px_rgba(30,50,90,0.55)]"
          >
            <button onClick={close} aria-label="Close checkout" className="absolute right-4 top-4 z-10 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-[rgba(30,50,90,0.85)] hover:bg-white">
              <X className="w-4 h-4" />
            </button>

            {order ? (
              <div className="p-8 md:p-14 text-center">
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}>
                  <CircleCheck className="mx-auto w-14 h-14 text-[rgba(30,50,90,0.85)]" strokeWidth={1.25} />
                </motion.div>
                <h2 className="mt-4 text-3xl md:text-4xl tracking-tight text-[#5E6470]">Thank you, {order.name}!</h2>
                <p className="mt-3 text-[rgba(30,50,90,0.75)]">
                  Order <strong className="font-normal text-[rgba(30,50,90,1)]">{order.id}</strong> for {order.total} is confirmed.
                </p>
                <p className="mt-1 text-sm text-[rgba(30,50,90,0.6)]">Our delivery team will contact {order.email} to book a white-glove delivery slot.</p>
                <p className="mx-auto mt-6 max-w-md rounded-2xl bg-white/70 px-4 py-3 text-xs text-[rgba(30,50,90,0.65)]">
                  Preview store: payments are not connected yet, so no card was charged.
                </p>
                <Link to="/shop" onClick={close} className="mt-6 inline-flex rounded-full bg-[rgba(30,50,90,0.88)] text-white px-6 py-3 text-sm hover:bg-[rgba(30,50,90,1)]">
                  Keep shopping
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-[1fr_340px]">
                <form ref={formRef} onSubmit={submit} noValidate className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl tracking-tight text-[#5E6470]">Checkout</h2>
                  <p className="mt-1 text-sm text-[rgba(30,50,90,0.6)]">White-glove delivery to your room of choice.</p>

                  <Group title="Contact">
                    <Field label="Email" name="email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errors.email} />
                    <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} error={errors.phone} />
                  </Group>

                  <Group title="Delivery address">
                    <Field label="Full name" name="name" autoComplete="name" value={f.name} onChange={set('name')} error={errors.name} wide />
                    <Field label="Street address" name="address" autoComplete="street-address" value={f.address} onChange={set('address')} error={errors.address} wide />
                    <Field label="City" name="city" autoComplete="address-level2" value={f.city} onChange={set('city')} error={errors.city} />
                    <Field label="ZIP / Postcode" name="postcode" autoComplete="postal-code" value={f.postcode} onChange={set('postcode')} error={errors.postcode} />
                    <label className="sm:col-span-2 block">
                      <span className="text-xs text-[rgba(30,50,90,0.65)]">Country</span>
                      <select
                        name="country"
                        autoComplete="country-name"
                        value={f.country}
                        onChange={set('country')}
                        aria-invalid={Boolean(errors.country)}
                        className={`mt-1 w-full rounded-xl bg-white/85 border px-3.5 py-2.5 text-sm text-[rgba(30,50,90,0.95)] outline-none focus:border-[rgba(30,50,90,0.45)] ${
                          errors.country ? 'border-rose-400' : 'border-[rgba(30,50,90,0.12)]'
                        }`}
                      >
                        <option value="">Select a country</option>
                        {COUNTRIES.map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      {errors.country && <span className="mt-1 block text-xs text-rose-700">{errors.country}</span>}
                    </label>
                  </Group>

                  <Group title="Payment">
                    <div className="sm:col-span-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Payment method">
                      {PAYMENTS.map(p => (
                        <label
                          key={p}
                          className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                            f.payment === p ? 'border-[rgba(30,50,90,0.6)] bg-white text-[rgba(30,50,90,1)]' : 'border-[rgba(30,50,90,0.12)] bg-white/60 text-[rgba(30,50,90,0.75)]'
                          }`}
                        >
                          <input type="radio" name="payment" value={p} checked={f.payment === p} onChange={set('payment')} className="sr-only" />
                          {p}
                        </label>
                      ))}
                    </div>
                    <p className="sm:col-span-2 flex items-start gap-2 text-xs text-[rgba(30,50,90,0.55)]">
                      <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      Card details are entered on a secure payment page after you place the order. This preview never charges a card.
                    </p>
                  </Group>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={t.priced.length === 0}
                    className="mt-6 w-full rounded-full bg-[rgba(30,50,90,0.88)] hover:bg-[rgba(30,50,90,1)] disabled:opacity-50 text-white py-3.5 transition-colors"
                  >
                    Place order · {money(t.total)}
                  </motion.button>
                </form>

                <aside className="bg-white/50 md:rounded-r-[2rem] p-6 md:p-8 border-t md:border-t-0 md:border-l border-[rgba(30,50,90,0.08)]">
                  <h3 className="text-sm uppercase tracking-wider text-[rgba(30,50,90,0.55)]">Order summary</h3>
                  <ul className="mt-4 space-y-3">
                    {t.priced.map(l => (
                      <li key={l.slug + l.finish} className="flex gap-3">
                        <div className="relative shrink-0">
                          <Img name={l.product.image} alt={l.product.name} sizes="56px" className="w-14 h-16 rounded-xl" />
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[rgba(30,50,90,0.9)] text-white text-[10px] flex items-center justify-center">{l.qty}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[rgba(30,50,90,0.95)] leading-snug">{l.product.name}</p>
                          <p className="text-xs text-[rgba(30,50,90,0.55)]">{l.finish}</p>
                        </div>
                        <span className="text-sm text-[rgba(30,50,90,0.9)]">{money(l.total)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-5 pt-4 border-t border-[rgba(30,50,90,0.08)] space-y-1.5 text-sm text-[rgba(30,50,90,0.7)]">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd>{money(t.subtotal)}</dd>
                    </div>
                    {t.discount > 0 && (
                      <div className="flex justify-between">
                        <dt>Discount ({promo})</dt>
                        <dd>−{money(t.discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt>Delivery</dt>
                      <dd>{t.delivery === 0 ? 'Free' : money(t.delivery)}</dd>
                    </div>
                    <div className="flex justify-between pt-2 text-base text-[rgba(30,50,90,1)]">
                      <dt>Total</dt>
                      <dd>{money(t.total)}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs text-[rgba(30,50,90,0.5)]">100-night home trial · 10-year frame warranty · Free returns collection</p>
                </aside>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm uppercase tracking-wider text-[rgba(30,50,90,0.55)] mb-3">{title}</legend>
      <div className="grid sm:grid-cols-2 gap-3">{children}</div>
    </fieldset>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  wide?: boolean;
}

export function Field({ label, name, value, onChange, error, type = 'text', autoComplete, wide }: FieldProps) {
  return (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs text-[rgba(30,50,90,0.65)]">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className={`mt-1 w-full rounded-xl bg-white/85 border px-3.5 py-2.5 text-sm text-[rgba(30,50,90,0.95)] outline-none focus:border-[rgba(30,50,90,0.45)] ${
          error ? 'border-rose-400' : 'border-[rgba(30,50,90,0.12)]'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-rose-700">{error}</span>}
    </label>
  );
}
