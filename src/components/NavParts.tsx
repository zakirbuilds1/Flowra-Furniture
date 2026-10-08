import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Menu, ShoppingBag } from 'lucide-react';
import { CURRENCIES, useCurrency } from '../lib/currency';
import { useCart } from '../lib/cart';
import { useDismiss, useUi } from '../lib/ui';

export const NAV_ITEMS = [
  { label: 'Shop', to: '/shop', hasDropdown: true },
  { label: 'Collections', to: '/shop', hasDropdown: true },
  { label: 'About', to: '/about', hasDropdown: false },
  { label: 'Contact', to: '/contact', hasDropdown: false },
] as const;

export const SHOP_LINKS = [
  { label: 'All furniture', to: '/shop' },
  { label: 'Living room', to: '/shop?room=living' },
  { label: 'Dining room', to: '/shop?room=dining' },
  { label: 'Bedroom', to: '/shop?room=bedroom' },
  { label: 'Workspace', to: '/shop?room=workspace' },
  { label: 'Outdoor', to: '/shop?room=outdoor' },
];

export function useCollectionLinks() {
  const { price } = useCurrency();
  return [
    { label: 'New arrivals', to: '/shop?collection=new' },
    { label: 'Bestsellers', to: '/shop?collection=best' },
    { label: `Under ${price(1000)}`, to: '/shop?collection=under1000' },
    { label: 'Lighting', to: '/shop?kind=Lighting' },
    { label: 'The bouclé edit', to: '/shop?q=boucl%C3%A9' },
  ];
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="Flowra home" className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="w-6 h-6" aria-hidden="true">
        <rect width="64" height="64" rx="18" fill="rgba(30,50,90,0.9)" />
        <path d="M14 38c8-10 14-10 18 0s10 10 18 0" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M14 26c8-10 14-10 18 0s10 10 18 0" stroke="white" strokeOpacity=".55" strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>
      <span className="font-regular tracking-tighter text-xl text-[rgba(30,50,90,0.9)]">Flowra</span>
    </Link>
  );
}

export function CartButton({ className = '' }: { className?: string }) {
  const { count, setDrawerOpen } = useCart();
  return (
    <button
      onClick={() => setDrawerOpen(true)}
      aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
      className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center text-[rgba(30,50,90,0.9)] hover:bg-white/80 transition-colors ${className}`}
    >
      <ShoppingBag className="w-4 h-4 md:w-[18px] md:h-[18px]" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[rgba(30,50,90,0.95)] text-white text-[10px] leading-[18px] text-center"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function MenuButton({ className = '' }: { className?: string }) {
  const { setMenuOpen } = useUi();
  return (
    <button
      onClick={() => setMenuOpen(true)}
      aria-label="Open menu"
      className={`w-9 h-9 rounded-full bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center text-[rgba(30,50,90,0.9)] ${className}`}
    >
      <Menu className="w-4 h-4" />
    </button>
  );
}

/** Compact pill with a drop-down list; `inline` renders a segmented row instead. */
export function CurrencySwitcher({ inline = false, className = '' }: { inline?: boolean; className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);

  if (inline)
    return (
      <div role="radiogroup" aria-label="Currency" className={`flex gap-1 p-1 rounded-full bg-white/60 border border-white/50 ${className}`}>
        {CURRENCIES.map(c => (
          <button
            key={c.code}
            role="radio"
            aria-checked={currency === c.code}
            onClick={() => setCurrency(c.code)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs transition-colors ${
              currency === c.code ? 'bg-[rgba(30,50,90,0.9)] text-white' : 'text-[rgba(30,50,90,0.8)] hover:bg-white'
            }`}
          >
            {c.symbol} {c.code}
          </button>
        ))}
      </div>
    );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${currency}`}
        className="h-9 md:h-10 flex items-center gap-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40 px-3 text-xs text-[rgba(30,50,90,0.9)] hover:bg-white/80 transition-colors"
      >
        {currency}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-48 p-1.5 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_18px_40px_-16px_rgba(30,50,90,0.35)] z-50"
          >
            {CURRENCIES.map(c => (
              <li key={c.code}>
                <button
                  role="option"
                  aria-selected={currency === c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm text-[rgba(30,50,90,0.9)] hover:bg-[rgba(30,50,90,0.06)]"
                >
                  <span>
                    <span className="inline-block w-8 text-[rgba(30,50,90,0.55)]">{c.symbol}</span>
                    {c.label}
                  </span>
                  {currency === c.code && <Check className="w-4 h-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
