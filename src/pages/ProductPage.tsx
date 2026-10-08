import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, ChevronRight, Minus, Moon, Plus, Ruler, ShieldCheck, Truck } from 'lucide-react';
import NavShell from '../components/NavShell';
import ProductCard from '../components/ProductCard';
import { Img } from '../components/Img';
import { Eyebrow, Panel, Reveal, SectionTitle, Stars } from '../components/Bits';
import { bySlug, products, ROOM_LABEL } from '../data/products';
import { FREE_DELIVERY_USD, useCart } from '../lib/cart';
import { useCurrency } from '../lib/currency';
import { useTitle } from '../lib/useTitle';
import NotFound from './NotFound';

export default function ProductPage() {
  const { slug = '' } = useParams();
  const product = bySlug(slug);
  if (!product) return <NotFound />;
  return <Detail key={slug} slug={slug} />;
}

function Detail({ slug }: { slug: string }) {
  const p = bySlug(slug)!;
  useTitle(`${p.name} | Flowra`);
  const { price, money, cents } = useCurrency();
  const { add, setDrawerOpen, setCheckoutOpen } = useCart();
  const [finish, setFinish] = useState(p.finishes[0].name);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [added, setAdded] = useState(false);
  const [openInfo, setOpenInfo] = useState<number | null>(0);
  const shots = [p.image, ...(p.detail ? [p.detail] : [])];
  const related = products.filter(o => o.slug !== p.slug && o.rooms.some(r => p.rooms.includes(r))).slice(0, 4);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const info = [
    { title: 'Details', body: <ul className="space-y-1.5">{p.details.map(d => <li key={d} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0 text-[rgba(30,50,90,0.6)]" />{d}</li>)}</ul> },
    { title: 'Dimensions', body: <p className="flex gap-2"><Ruler className="w-4 h-4 mt-0.5 shrink-0 text-[rgba(30,50,90,0.6)]" />{p.dims}</p> },
    {
      title: 'Delivery & returns',
      body: (
        <p>
          {p.leadTime}. White-glove delivery is free on orders over {price(FREE_DELIVERY_USD)}: a two-person team brings it to your room, assembles it and takes the packaging away. Not right? Return it within 100 nights for a full refund.
        </p>
      ),
    },
  ];

  return (
    <>
      <NavShell />
      <Panel className="pt-5 md:pt-8">
        <nav aria-label="Breadcrumb" className="px-1 md:px-4 mb-4 flex items-center gap-1.5 text-xs text-[rgba(30,50,90,0.55)]">
          <Link to="/shop" className="hover:text-[rgba(30,50,90,0.9)]">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop?room=${p.rooms[0]}`} className="hover:text-[rgba(30,50,90,0.9)]">
            {ROOM_LABEL[p.rooms[0]]}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[rgba(30,50,90,0.85)] truncate">{p.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-8 items-start">
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="relative rounded-[1.5rem] md:rounded-[2.6rem] overflow-hidden aspect-[4/5]">
              <AnimatePresence initial={false}>
                <motion.div key={shots[shot]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="absolute inset-0">
                  <Img name={shots[shot]} alt={shot === 0 ? p.name : `${p.material} close-up`} sizes="(min-width: 1024px) 55vw, 100vw" priority className="w-full h-full" />
                </motion.div>
              </AnimatePresence>
              {(p.isNew || p.isBest || p.compareAt) && (
                <span className="absolute top-4 left-4 rounded-full bg-white/75 backdrop-blur-md px-3 py-1 text-[11px] uppercase tracking-wider text-[rgba(30,50,90,0.85)]">
                  {p.compareAt ? 'On sale' : p.isNew ? 'New' : 'Bestseller'}
                </span>
              )}
            </div>
            {shots.length > 1 && (
              <div className="flex gap-2">
                {shots.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setShot(i)}
                    aria-label={i === 0 ? 'Show product photo' : 'Show material close-up'}
                    aria-pressed={shot === i}
                    className={`rounded-2xl overflow-hidden ring-2 transition-all ${shot === i ? 'ring-[rgba(30,50,90,0.7)]' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <Img name={s} alt="" sizes="96px" className="w-20 h-24 md:w-24 md:h-28" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="crystal rounded-[1.5rem] md:rounded-[2.6rem] p-5 md:p-8">
              <Eyebrow className="relative">
                {p.kind} · {p.material}
              </Eyebrow>
              <h1 className="relative mt-2 text-3xl md:text-5xl tracking-tight leading-[1.05] text-[#5E6470]">{p.name}</h1>
              <div className="relative mt-3 flex items-center gap-2 text-sm text-[rgba(30,50,90,0.65)]">
                <Stars rating={p.rating} /> {p.rating} · {p.reviews} reviews
              </div>
              <div className="relative mt-4 flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl text-[rgba(30,50,90,0.95)]">{price(p.price)}</span>
                {p.compareAt && <span className="text-base line-through text-[rgba(30,50,90,0.4)]">{price(p.compareAt)}</span>}
              </div>
              <p className="relative mt-4 text-[15px] leading-relaxed text-[#5E6470]">{p.blurb}</p>

              <fieldset className="relative mt-6">
                <legend className="text-sm text-[rgba(30,50,90,0.7)]">
                  Finish: <span className="text-[rgba(30,50,90,0.95)]">{finish}</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.finishes.map(f => (
                    <label
                      key={f.name}
                      className={`cursor-pointer flex items-center gap-2 rounded-full border pl-1.5 pr-3.5 py-1.5 text-sm transition-colors ${
                        finish === f.name ? 'border-[rgba(30,50,90,0.6)] bg-white text-[rgba(30,50,90,1)]' : 'border-[rgba(30,50,90,0.12)] bg-white/50 text-[rgba(30,50,90,0.75)] hover:bg-white/80'
                      }`}
                    >
                      <input type="radio" name="finish" value={f.name} checked={finish === f.name} onChange={() => setFinish(f.name)} className="sr-only" />
                      <span className="w-6 h-6 rounded-full border border-black/10" style={{ background: f.hex }} />
                      {f.name}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="relative mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full bg-white border border-[rgba(30,50,90,0.1)]">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity" className="w-11 h-11 flex items-center justify-center text-[rgba(30,50,90,0.8)]">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-[rgba(30,50,90,0.95)]" aria-live="polite">
                    {qty}
                  </span>
                  <button onClick={() => setQty(q => Math.min(20, q + 1))} aria-label="Increase quantity" className="w-11 h-11 flex items-center justify-center text-[rgba(30,50,90,0.8)]">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    add(p.slug, finish, qty);
                    setAdded(true);
                    setDrawerOpen(true);
                  }}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-full bg-[rgba(30,50,90,0.88)] hover:bg-[rgba(30,50,90,1)] text-white h-11 px-6 transition-colors"
                >
                  {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {added ? 'Added' : 'Add to cart'}
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  add(p.slug, finish, qty);
                  setCheckoutOpen(true);
                }}
                className="relative mt-3 w-full flex items-center justify-center gap-3 rounded-full bg-white border border-[rgba(30,50,90,0.15)] hover:bg-white/80 text-[rgba(30,50,90,0.95)] h-11 transition-colors group"
              >
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" /> Buy now · {money(cents(p.price) * qty)}
              </motion.button>

              <ul className="relative mt-6 grid gap-2 text-[13px] text-[rgba(30,50,90,0.75)]">
                <li className="flex items-center gap-2">
                  <Truck className="w-4 h-4" /> {p.leadTime} · free white-glove delivery over {price(FREE_DELIVERY_USD)}
                </li>
                <li className="flex items-center gap-2">
                  <Moon className="w-4 h-4" /> 100-night home trial with free returns
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> 10-year frame warranty
                </li>
              </ul>

              <div className="relative mt-6 divide-y divide-[rgba(30,50,90,0.1)] border-y border-[rgba(30,50,90,0.1)]">
                {info.map((item, i) => (
                  <div key={item.title}>
                    <button
                      onClick={() => setOpenInfo(openInfo === i ? null : i)}
                      aria-expanded={openInfo === i}
                      className="w-full flex items-center justify-between py-3.5 text-sm text-[rgba(30,50,90,0.92)]"
                    >
                      {item.title}
                      <Plus className={`w-4 h-4 transition-transform ${openInfo === i ? 'rotate-45' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openInfo === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pb-4 text-sm leading-relaxed text-[#5E6470]">{item.body}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {related.length > 0 && (
        <Panel className="pt-20 md:pt-28">
          <div className="px-1 md:px-4 mb-8">
            <SectionTitle eyebrow="Complete the room" title="Goes well with." />
          </div>
          <Reveal className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
            {related.map(o => (
              <ProductCard key={o.slug} product={o} />
            ))}
          </Reveal>
        </Panel>
      )}
    </>
  );
}
