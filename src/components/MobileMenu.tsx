import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Phone, X } from 'lucide-react';
import { CurrencySwitcher, Logo, SHOP_LINKS, useCollectionLinks } from './NavParts';
import { useScrollLock, useUi } from '../lib/ui';

export default function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUi();
  const collections = useCollectionLinks();
  const location = useLocation();
  useScrollLock(menuOpen);
  useEffect(() => setMenuOpen(false), [location, setMenuOpen]);

  const main = [
    { label: 'Home', to: '/' },
    { label: 'Shop all', to: '/shop' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return createPortal(
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] bg-[#f0f0f0]/85 backdrop-blur-2xl overflow-y-auto"
        >
          <div className="flex items-center justify-between px-6 py-6">
            <Logo />
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-[rgba(30,50,90,0.9)]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <nav className="px-6 pb-10">
            <ul>
              {main.map((m, i) => (
                <motion.li key={m.to} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                  <Link to={m.to} className="flex items-center justify-between py-3 text-3xl tracking-tight text-[#5E6470] border-b border-[rgba(30,50,90,0.08)]">
                    {m.label}
                    <ArrowUpRight className="w-5 h-5 text-[rgba(30,50,90,0.5)]" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <p className="mt-8 mb-3 text-[11px] uppercase tracking-[0.18em] text-[rgba(30,50,90,0.55)]">Shop by room</p>
            <div className="flex flex-wrap gap-2">
              {SHOP_LINKS.slice(1).map(l => (
                <Link key={l.to} to={l.to} className="rounded-full bg-white/70 px-4 py-2 text-sm text-[rgba(30,50,90,0.9)]">
                  {l.label}
                </Link>
              ))}
            </div>

            <p className="mt-6 mb-3 text-[11px] uppercase tracking-[0.18em] text-[rgba(30,50,90,0.55)]">Collections</p>
            <div className="flex flex-wrap gap-2">
              {collections.map(l => (
                <Link key={l.to} to={l.to} className="rounded-full bg-white/70 px-4 py-2 text-sm text-[rgba(30,50,90,0.9)]">
                  {l.label}
                </Link>
              ))}
            </div>

            <p className="mt-6 mb-3 text-[11px] uppercase tracking-[0.18em] text-[rgba(30,50,90,0.55)]">Currency</p>
            <CurrencySwitcher inline />

            <a href="tel:+18005550142" className="mt-8 flex items-center gap-2 text-sm text-[rgba(30,50,90,0.75)]">
              <Phone className="w-4 h-4" /> Design help: (800) 555-0142
            </a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
