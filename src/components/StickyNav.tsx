import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { CartButton, CurrencySwitcher, Logo, MenuButton } from './NavParts';

/** Slim glass bar that slides in once the page header has scrolled away. */
export default function StickyNav() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Shop', to: '/shop' },
    { label: 'New', to: '/shop?collection=new' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="fixed top-3 inset-x-3 z-[60] flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-[1100px] flex items-center justify-between gap-3 rounded-full bg-white/70 backdrop-blur-xl border border-white/70 shadow-[0_14px_40px_-20px_rgba(30,50,90,0.45)] pl-5 pr-2 py-2">
            <Logo />
            <ul className="hidden md:flex items-center gap-7 text-sm text-[rgb(45,45,45)]">
              {links.map(l => (
                <li key={l.label} className="hover:opacity-70 transition-opacity">
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              <CurrencySwitcher className="hidden sm:block" />
              <CartButton />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/shop')}
                className="hidden sm:flex items-center bg-[rgba(30,50,90,0.8)] text-white rounded-full pl-1.5 pr-4 py-1.5 gap-2 hover:bg-[rgba(30,50,90,1)] transition-colors group"
              >
                <span className="bg-white/20 p-1 rounded-full">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                </span>
                <span className="text-sm">Shop Now</span>
              </motion.button>
              <MenuButton className="md:hidden" />
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
