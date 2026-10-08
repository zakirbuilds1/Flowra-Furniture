import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { CartButton, CurrencySwitcher, Logo, MenuButton, NAV_ITEMS, SHOP_LINKS, useCollectionLinks } from './NavParts';
import { Img } from './Img';
import { bySlug } from '../data/products';
import { useCurrency } from '../lib/currency';
import { useDismiss } from '../lib/ui';

type MenuId = 'Shop' | 'Collections';

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<MenuId | null>(null);
  const [x, setX] = useState(0);
  const close = useCallback(() => setOpen(null), []);
  const wrapRef = useDismiss<HTMLDivElement>(open !== null, close);
  const ulRef = useRef<HTMLUListElement>(null);

  const show = (id: MenuId, el: HTMLElement) => {
    const ul = ulRef.current;
    if (ul) setX(el.offsetLeft + el.offsetWidth / 2);
    setOpen(id);
  };

  return (
    <nav className="flex items-center justify-between py-6 px-6 md:px-10 w-full relative z-10">
      {/* Left side: logo, kept flex-1 so the menu stays centred */}
      <div className="flex-1 hidden md:block">
        <Logo />
      </div>

      {/* Center menu */}
      <div ref={wrapRef} className="relative hidden md:block" onMouseLeave={close}>
        <ul ref={ulRef} className="hidden md:flex items-center gap-8 text-[rgb(45,45,45)] font-normal text-sm">
          {NAV_ITEMS.map(item =>
            item.hasDropdown ? (
              <li
                key={item.label}
                className="cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group"
                onMouseEnter={e => show(item.label as MenuId, e.currentTarget)}
              >
                <button
                  aria-haspopup="true"
                  aria-expanded={open === item.label}
                  onClick={e => (open === item.label ? close() : show(item.label as MenuId, e.currentTarget.parentElement!))}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {item.label}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${open === item.label ? 'rotate-90' : ''}`}
                  />
                </button>
              </li>
            ) : (
              <li key={item.label} className="cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group" onMouseEnter={close}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ),
          )}
        </ul>

        <AnimatePresence>
          {open && (
            <motion.div
              key={open}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ left: x }}
              className="absolute top-full pt-4 -translate-x-1/2 z-40"
            >
              <DropdownPanel id={open} onPick={close} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile logo */}
      <div className="md:hidden">
        <Logo />
      </div>

      {/* Right side */}
      <div className="flex-1 flex justify-end items-center gap-2 md:gap-3">
        <CurrencySwitcher className="hidden lg:block" />
        <CartButton />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/shop')}
          className="flex items-center bg-[rgba(30,50,90,0.8)] text-white rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-[rgba(30,50,90,1)] transition-colors group"
        >
          <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white transition-transform group-hover:rotate-45" />
          </div>
          <span className="text-xs md:text-sm font-normal">Shop Now</span>
        </motion.button>
        <MenuButton className="md:hidden" />
      </div>
    </nav>
  );
}

function DropdownPanel({ id, onPick }: { id: MenuId; onPick: () => void }) {
  const collections = useCollectionLinks();
  const { price } = useCurrency();
  const featured = bySlug(id === 'Shop' ? 'nimbus-boucle-lounge-chair' : 'still-water-bed')!;
  const links = id === 'Shop' ? SHOP_LINKS : collections;
  return (
    <div className="w-[440px] p-3 rounded-[1.6rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_24px_60px_-24px_rgba(30,50,90,0.45)] grid grid-cols-[1fr_170px] gap-3">
      <ul className="flex flex-col py-1">
        {links.map(l => (
          <li key={l.label}>
            <Link
              to={l.to}
              onClick={onPick}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-[rgba(30,50,90,0.9)] hover:bg-[rgba(30,50,90,0.06)] group/link"
            >
              {l.label}
              <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/link:opacity-60 group-hover/link:translate-x-0 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/product/${featured.slug}`} onClick={onPick} className="relative rounded-2xl overflow-hidden group/feat">
        <Img name={featured.image} alt={featured.name} sizes="170px" className="h-full min-h-[210px]" imgClassName="transition-transform duration-700 group-hover/feat:scale-105" />
        <div className="absolute inset-x-2 bottom-2 rounded-xl bg-white/70 backdrop-blur-md px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-[rgba(30,50,90,0.55)]">{id === 'Shop' ? 'Bestseller' : 'Just in'}</p>
          <p className="text-xs text-[rgba(30,50,90,0.95)] leading-snug">{featured.name}</p>
          <p className="text-xs text-[rgba(30,50,90,0.7)]">{price(featured.price)}</p>
        </div>
      </Link>
    </div>
  );
}
