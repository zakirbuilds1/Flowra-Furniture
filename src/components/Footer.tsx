import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { CurrencySwitcher } from './NavParts';
import { SHOWROOMS } from '../data/site';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All furniture', to: '/shop' },
      { label: 'Living room', to: '/shop?room=living' },
      { label: 'Dining room', to: '/shop?room=dining' },
      { label: 'Bedroom', to: '/shop?room=bedroom' },
      { label: 'Outdoor', to: '/shop?room=outdoor' },
      { label: 'New arrivals', to: '/shop?collection=new' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Delivery & returns', to: '/contact#faq' },
      { label: '100-night trial', to: '/contact#faq' },
      { label: 'Warranty', to: '/contact#faq' },
      { label: 'Free design advice', to: '/contact' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our story', to: '/about' },
      { label: 'How we make it', to: '/about#craft' },
      { label: 'Showrooms', to: '/contact#showrooms' },
      { label: 'Trade program', to: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="px-3 md:px-5 pb-3 md:pb-5 pt-16 md:pt-24">
      <div className="mx-auto max-w-[1536px] rounded-[1.5rem] md:rounded-[3rem] bg-[rgba(30,50,90,0.96)] text-white overflow-hidden relative">
        <div aria-hidden className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-white/[0.06] blur-3xl" />
        <div className="relative px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-8">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 pb-12 border-b border-white/10">
            <div>
              <h2 className="text-3xl md:text-5xl tracking-tight leading-[1.05] max-w-md">Get 10% off your first piece.</h2>
              <p className="mt-4 text-white/65 max-w-md text-sm md:text-base">New collections, care tips and early access to our seasonal sale. One email a month, never more.</p>
              <Newsletter />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {COLUMNS.map(col => (
                <div key={col.title}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 mb-4">{col.title}</p>
                  <ul className="space-y-2.5 text-sm">
                    {col.links.map(l => (
                      <li key={l.label}>
                        <Link to={l.to} className="text-white/80 hover:text-white transition-colors">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 py-10 border-b border-white/10">
            {SHOWROOMS.map(s => (
              <div key={s.city}>
                <p className="text-sm">{s.city} showroom</p>
                <p className="mt-1 text-sm text-white/55 leading-relaxed">{s.address}</p>
                <a href={`tel:${s.tel}`} className="mt-1 inline-block text-sm text-white/80 hover:text-white">
                  {s.phone}
                </a>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-[64px] sm:text-[96px] md:text-[140px] leading-[0.8] tracking-tighter text-white/90 select-none">Flowra</p>
              <p className="mt-4 text-xs text-white/45">© {new Date().getFullYear()} Flowra Home, Inc. · We accept Visa, Mastercard, Amex, Apple Pay and PayPal</p>
            </div>
            <div className="md:w-[340px]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 mb-2">Shop in</p>
              <CurrencySwitcher inline className="!bg-white/10 !border-white/10 [&_button]:!text-white/80 [&_button[aria-checked=true]]:!bg-white [&_button[aria-checked=true]]:!text-[rgba(30,50,90,1)]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle');
  const [copied, setCopied] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? 'done' : 'error');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('WELCOME10');
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-6 max-w-md">
      <AnimatePresence mode="wait">
        {state === 'done' ? (
          <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/10 border border-white/15 p-4">
            <p className="text-sm">You are on the list. Here is your code:</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-full bg-white text-[rgba(30,50,90,1)] px-4 py-2 tracking-[0.2em] text-sm">WELCOME10</span>
              <button onClick={copy} className="flex items-center gap-1.5 text-xs text-white/75 hover:text-white">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -8 }}>
            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 p-1.5 focus-within:border-white/40">
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (state === 'error') setState('idle');
                }}
                placeholder="you@example.com"
                className="flex-1 min-w-0 bg-transparent px-4 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-full bg-white text-[rgba(30,50,90,1)] pl-1.5 pr-4 py-1.5 text-sm group"
              >
                <span className="bg-[rgba(30,50,90,0.1)] p-1 rounded-full">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                </span>
                Subscribe
              </motion.button>
            </div>
            {state === 'error' && <p className="mt-2 text-xs text-rose-200">Please enter a valid email address.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
