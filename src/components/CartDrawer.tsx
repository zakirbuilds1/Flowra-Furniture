import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Minus, Plus, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react';
import { Img } from './Img';
import { PROMOS, useCart, useTotals } from '../lib/cart';
import { useCurrency } from '../lib/currency';
import { useScrollLock } from '../lib/ui';
import { products } from '../data/products';

export default function CartDrawer() {
  const { drawerOpen, setDrawerOpen, setQty, remove, promo, setPromo, setCheckoutOpen, count } = useCart();
  const { money } = useCurrency();
  const t = useTotals();
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useScrollLock(drawerOpen);

  const applyCode = (e: FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) return;
    if (PROMOS[c]) {
      setPromo(c);
      setCodeMsg({ ok: true, text: `${c} applied: ${PROMOS[c] * 100}% off your order.` });
      setCode('');
    } else setCodeMsg({ ok: false, text: 'That code is not valid. Try WELCOME10.' });
  };

  const close = () => setDrawerOpen(false);
  const pct = t.threshold ? Math.min(100, (t.subtotal / t.threshold) * 100) : 0;

  return createPortal(
    <AnimatePresence>
      {drawerOpen && (
        <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[rgba(20,30,50,0.35)] backdrop-blur-[3px]" onClick={close} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            className="absolute right-0 top-0 h-full w-full sm:w-[440px] sm:p-3"
          >
            <div className="h-full flex flex-col bg-[#f4f4f4]/90 backdrop-blur-2xl sm:rounded-[2rem] border border-white/70 shadow-[0_30px_80px_-30px_rgba(30,50,90,0.5)] overflow-hidden">
              <header className="flex items-center justify-between px-5 md:px-6 pt-5 pb-4">
                <h2 className="text-xl text-[rgba(30,50,90,0.95)]">
                  Your cart <span className="text-[rgba(30,50,90,0.5)]">({count})</span>
                </h2>
                <button onClick={close} aria-label="Close cart" className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center text-[rgba(30,50,90,0.85)] hover:bg-white">
                  <X className="w-4 h-4" />
                </button>
              </header>

              {t.priced.length === 0 ? (
                <EmptyCart onPick={close} />
              ) : (
                <>
                  <div className="mx-5 md:mx-6 mb-3 rounded-2xl bg-white/70 p-3">
                    <p className="flex items-center gap-2 text-[13px] text-[rgba(30,50,90,0.85)]">
                      <Truck className="w-4 h-4 shrink-0" />
                      {t.remaining > 0 ? (
                        <span>
                          Add <strong className="font-normal text-[rgba(30,50,90,1)]">{money(t.remaining)}</strong> for free white-glove delivery
                        </span>
                      ) : (
                        <span>You have free white-glove delivery</span>
                      )}
                    </p>
                    <div className="mt-2 h-1.5 rounded-full bg-[rgba(30,50,90,0.1)] overflow-hidden">
                      <motion.div className="h-full rounded-full bg-[rgba(30,50,90,0.8)]" animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
                    </div>
                  </div>

                  <ul className="flex-1 overflow-y-auto soft-scroll px-5 md:px-6 divide-y divide-[rgba(30,50,90,0.08)]">
                    <AnimatePresence initial={false}>
                      {t.priced.map(l => (
                        <motion.li
                          key={l.slug + l.finish}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-3 py-3">
                            <Link to={`/product/${l.slug}`} onClick={close} className="shrink-0">
                              <Img name={l.product.image} alt={l.product.name} sizes="80px" className="w-20 h-24 rounded-2xl" />
                            </Link>
                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex justify-between gap-2">
                                <Link to={`/product/${l.slug}`} onClick={close} className="text-sm leading-snug text-[rgba(30,50,90,0.95)] hover:underline">
                                  {l.product.name}
                                </Link>
                                <button
                                  onClick={() => remove(l.slug, l.finish)}
                                  aria-label={`Remove ${l.product.name}`}
                                  className="text-[rgba(30,50,90,0.45)] hover:text-[rgba(30,50,90,0.9)] self-start"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-[rgba(30,50,90,0.55)]">{l.finish}</p>
                              <p className="text-xs text-[rgba(30,50,90,0.55)]">{l.product.leadTime}</p>
                              <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="flex items-center rounded-full bg-white/80 border border-[rgba(30,50,90,0.08)]">
                                  <button onClick={() => setQty(l.slug, l.finish, l.qty - 1)} aria-label="Decrease quantity" className="w-8 h-8 flex items-center justify-center text-[rgba(30,50,90,0.8)]">
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="w-6 text-center text-sm text-[rgba(30,50,90,0.95)]" aria-live="polite">
                                    {l.qty}
                                  </span>
                                  <button onClick={() => setQty(l.slug, l.finish, l.qty + 1)} aria-label="Increase quantity" className="w-8 h-8 flex items-center justify-center text-[rgba(30,50,90,0.8)]">
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="text-sm text-[rgba(30,50,90,0.95)]">{money(l.total)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <footer className="px-5 md:px-6 pt-4 pb-5 border-t border-[rgba(30,50,90,0.08)] bg-white/40">
                    {promo ? (
                      <div className="flex items-center justify-between text-xs text-[rgba(30,50,90,0.75)] mb-3">
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> {promo} applied
                        </span>
                        <button
                          onClick={() => {
                            setPromo('');
                            setCodeMsg(null);
                          }}
                          className="underline hover:text-[rgba(30,50,90,1)]"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={applyCode} className="flex gap-2 mb-1">
                        <label htmlFor="promo" className="sr-only">
                          Promo code
                        </label>
                        <input
                          id="promo"
                          value={code}
                          onChange={e => setCode(e.target.value)}
                          placeholder="Promo code"
                          className="flex-1 min-w-0 rounded-full bg-white/80 border border-[rgba(30,50,90,0.1)] px-4 py-2 text-sm text-[rgba(30,50,90,0.95)] placeholder:text-[rgba(30,50,90,0.4)] outline-none focus:border-[rgba(30,50,90,0.4)]"
                        />
                        <button className="rounded-full px-4 py-2 text-sm bg-white border border-[rgba(30,50,90,0.15)] text-[rgba(30,50,90,0.9)] hover:bg-[rgba(30,50,90,0.05)]">
                          Apply
                        </button>
                      </form>
                    )}
                    {codeMsg && !promo && <p className={`text-xs mb-2 ${codeMsg.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{codeMsg.text}</p>}
                    {codeMsg?.ok && promo && <p className="text-xs mb-2 text-emerald-700">{codeMsg.text}</p>}

                    <dl className="mt-3 space-y-1.5 text-sm text-[rgba(30,50,90,0.75)]">
                      <Row label="Subtotal" value={money(t.subtotal)} />
                      {t.discount > 0 && <Row label={`Discount (${promo})`} value={`−${money(t.discount)}`} />}
                      <Row label="White-glove delivery" value={t.delivery === 0 ? 'Free' : money(t.delivery)} />
                      <div className="flex justify-between pt-2 text-base text-[rgba(30,50,90,1)]">
                        <dt>Total</dt>
                        <dd>{money(t.total)}</dd>
                      </div>
                    </dl>
                    <p className="mt-1 text-[11px] text-[rgba(30,50,90,0.5)]">Taxes and duties are calculated at checkout.</p>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setDrawerOpen(false);
                        setCheckoutOpen(true);
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-3 rounded-full bg-[rgba(30,50,90,0.88)] hover:bg-[rgba(30,50,90,1)] text-white py-3 transition-colors group"
                    >
                      <span className="bg-white/20 p-1 rounded-full">
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                      </span>
                      Checkout · {money(t.total)}
                    </motion.button>
                    <button onClick={close} className="mt-2 w-full text-center text-xs text-[rgba(30,50,90,0.6)] hover:text-[rgba(30,50,90,0.9)] py-1">
                      Continue shopping
                    </button>
                  </footer>
                </>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="text-[rgba(30,50,90,0.95)]">{value}</dd>
    </div>
  );
}

function EmptyCart({ onPick }: { onPick: () => void }) {
  const { price } = useCurrency();
  const picks = products.filter(p => p.isBest).slice(0, 3);
  return (
    <div className="flex-1 overflow-y-auto soft-scroll px-5 md:px-6 pb-6">
      <div className="rounded-3xl bg-white/60 p-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-[rgba(30,50,90,0.06)] flex items-center justify-center text-[rgba(30,50,90,0.7)]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <p className="mt-3 text-[rgba(30,50,90,0.95)]">Your cart is empty</p>
        <p className="mt-1 text-sm text-[rgba(30,50,90,0.6)]">Start with one of our most-loved pieces.</p>
        <Link
          to="/shop"
          onClick={onPick}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgba(30,50,90,0.88)] text-white px-5 py-2.5 text-sm hover:bg-[rgba(30,50,90,1)]"
        >
          Shop all furniture <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
      <p className="mt-6 mb-2 text-xs uppercase tracking-wider text-[rgba(30,50,90,0.5)]">Bestsellers</p>
      <ul className="space-y-2">
        {picks.map(p => (
          <li key={p.slug}>
            <Link to={`/product/${p.slug}`} onClick={onPick} className="flex items-center gap-3 rounded-2xl bg-white/50 hover:bg-white/80 p-2 transition-colors">
              <Img name={p.image} alt={p.name} sizes="56px" className="w-14 h-16 rounded-xl" />
              <span className="flex-1 text-sm text-[rgba(30,50,90,0.9)]">{p.name}</span>
              <span className="text-sm text-[rgba(30,50,90,0.7)] pr-2">{price(p.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
