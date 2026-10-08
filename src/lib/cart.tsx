import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { bySlug, type Product } from '../data/products';
import { useCurrency } from './currency';
import { load, save } from './storage';

// Delivery rules (US dollars, converted for other currencies).
export const FREE_DELIVERY_USD = 1500;
export const DELIVERY_USD = 149;
// Promo codes: code -> fraction off the subtotal.
export const PROMOS: Record<string, number> = { WELCOME10: 0.1 };

export interface Line {
  slug: string;
  finish: string;
  qty: number;
}

interface Ctx {
  lines: Line[];
  count: number;
  add: (slug: string, finish: string, qty?: number) => void;
  setQty: (slug: string, finish: string, qty: number) => void;
  remove: (slug: string, finish: string) => void;
  clear: () => void;
  promo: string;
  setPromo: (code: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<Ctx | null>(null);
const same = (l: Line, slug: string, finish: string) => l.slug === slug && l.finish === finish;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(() => load<Line[]>('flowra-cart', []).filter(l => bySlug(l.slug)));
  const [promo, setPromo] = useState(() => load('flowra-promo', ''));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => save('flowra-cart', lines), [lines]);
  useEffect(() => save('flowra-promo', promo), [promo]);

  const add = useCallback((slug: string, finish: string, qty = 1) => {
    setLines(ls =>
      ls.some(l => same(l, slug, finish))
        ? ls.map(l => (same(l, slug, finish) ? { ...l, qty: Math.min(l.qty + qty, 20) } : l))
        : [...ls, { slug, finish, qty }],
    );
  }, []);
  const setQty = useCallback((slug: string, finish: string, qty: number) => {
    setLines(ls =>
      qty < 1 ? ls.filter(l => !same(l, slug, finish)) : ls.map(l => (same(l, slug, finish) ? { ...l, qty: Math.min(qty, 20) } : l)),
    );
  }, []);
  const remove = useCallback((slug: string, finish: string) => setLines(ls => ls.filter(l => !same(l, slug, finish))), []);
  const clear = useCallback(() => {
    setLines([]);
    setPromo('');
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      add,
      setQty,
      remove,
      clear,
      promo,
      setPromo,
      drawerOpen,
      setDrawerOpen,
      checkoutOpen,
      setCheckoutOpen,
    }),
    [lines, add, setQty, remove, clear, promo, drawerOpen, checkoutOpen],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export interface PricedLine extends Line {
  product: Product;
  unit: number; // cents, chosen currency
  total: number; // cents, chosen currency
}

/** All cart money in cents of the chosen currency, so the numbers on screen always add up. */
export function useTotals() {
  const { lines, promo } = useCart();
  const { cents } = useCurrency();
  const priced: PricedLine[] = lines.map(l => {
    const product = bySlug(l.slug) as Product;
    const unit = cents(product.price);
    return { ...l, product, unit, total: unit * l.qty };
  });
  const subtotal = priced.reduce((s, l) => s + l.total, 0);
  const discount = Math.round(subtotal * (PROMOS[promo] ?? 0));
  const threshold = cents(FREE_DELIVERY_USD);
  const delivery = subtotal === 0 || subtotal >= threshold ? 0 : cents(DELIVERY_USD);
  return {
    priced,
    subtotal,
    discount,
    delivery,
    total: subtotal - discount + delivery,
    threshold,
    remaining: Math.max(threshold - subtotal, 0),
  };
}
