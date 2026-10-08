import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Leaf, Moon, Phone, Plus, ShieldCheck, Truck } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Faq from '../components/Faq';
import { Img } from '../components/Img';
import { Eyebrow, Panel, Reveal, SectionTitle, Stars } from '../components/Bits';
import { bySlug, products, ROOMS, type Product } from '../data/products';
import { CONTACT, TESTIMONIALS } from '../data/site';
import { FREE_DELIVERY_USD, useCart } from '../lib/cart';
import { useCurrency } from '../lib/currency';
import { useTitle } from '../lib/useTitle';

const TABS: { label: string; match: (p: Product) => boolean }[] = [
  { label: 'Bestsellers', match: p => Boolean(p.isBest) },
  { label: 'New in', match: p => Boolean(p.isNew) },
  { label: 'Seating', match: p => p.kind === 'Sofas' || p.kind === 'Chairs' },
  { label: 'Tables', match: p => p.kind === 'Tables' },
  { label: 'Lighting', match: p => p.kind === 'Lighting' },
];

export default function Home() {
  useTitle('Flowra | Modern Premium Furniture');
  return (
    <>
      <Hero />
      <Perks />
      <ShopByRoom />
      <Featured />
      <ShopTheRoom />
      <Craft />
      <Reviews />
      <HelpAndFaq />
    </>
  );
}

function Perks() {
  const { price } = useCurrency();
  const perks = [
    { icon: Truck, title: 'Free white-glove delivery', text: `On orders over ${price(FREE_DELIVERY_USD)}` },
    { icon: Moon, title: '100-night home trial', text: 'Live with it before you decide' },
    { icon: ShieldCheck, title: '10-year frame warranty', text: 'Built to be handed down' },
    { icon: Leaf, title: 'FSC-certified wood', text: 'Low-VOC finishes, carbon-neutral delivery' },
  ];
  return (
    <Panel className="pt-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        {perks.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.06}>
            <div className="h-full flex items-start gap-3 rounded-[1.2rem] md:rounded-[1.6rem] bg-white/60 border border-white/70 p-4 md:p-5">
              <span className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-[rgba(30,50,90,0.06)] flex items-center justify-center text-[rgba(30,50,90,0.8)]">
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              <span>
                <span className="block text-[13px] md:text-[15px] text-[rgba(30,50,90,0.95)] leading-snug">{title}</span>
                <span className="block text-[11px] md:text-[13px] text-[rgba(30,50,90,0.55)] mt-0.5">{text}</span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}

function ShopByRoom() {
  return (
    <Panel className="pt-20 md:pt-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10 px-1 md:px-4">
        <SectionTitle eyebrow="Shop by room" title={<>Start with the room<br className="hidden sm:block" /> you live in most.</>} />
        <Link to="/shop" className="self-start md:self-auto inline-flex items-center gap-2 text-sm text-[rgba(30,50,90,0.8)] hover:text-[rgba(30,50,90,1)] group">
          View all furniture <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {ROOMS.map((room, i) => (
          <Reveal key={room.id} delay={i * 0.08}>
            <Link to={`/shop?room=${room.id}`} className="group relative block rounded-[1.4rem] md:rounded-[2.2rem] overflow-hidden aspect-[3/4]">
              <Img name={room.image} alt={`${room.label} furniture`} sizes="(min-width: 1024px) 25vw, 50vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]" />
              <div className="absolute inset-x-2 bottom-2 md:inset-x-3 md:bottom-3 crystal rounded-[1.1rem] md:rounded-[1.6rem] p-3 md:p-4 flex items-center justify-between gap-2">
                <span className="sheen" />
                <span className="relative min-w-0">
                  <span className="block text-base md:text-xl text-[rgba(30,50,90,0.95)]">{room.label}</span>
                  <span className="hidden sm:block text-xs md:text-[13px] text-[rgba(30,50,90,0.6)] truncate">{room.blurb}</span>
                </span>
                <span className="relative shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 flex items-center justify-center text-[rgba(30,50,90,0.85)]">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}

function Featured() {
  const [tab, setTab] = useState(0);
  const list = products.filter(TABS[tab].match).slice(0, 8);
  return (
    <Panel className="pt-20 md:pt-28">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-10 px-1 md:px-4">
        <SectionTitle eyebrow="Most loved" title="Pieces people keep for decades." />
        <div role="tablist" aria-label="Product groups" className="flex gap-1 p-1 rounded-full bg-white/60 border border-white/70 overflow-x-auto max-w-full">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${tab === i ? 'text-white' : 'text-[rgba(30,50,90,0.75)] hover:text-[rgba(30,50,90,1)]'}`}
            >
              {tab === i && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-[rgba(30,50,90,0.88)]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4"
        >
          {list.map(p => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex justify-center">
        <Link to="/shop" className="inline-flex items-center gap-3 rounded-full bg-white border border-[rgba(30,50,90,0.1)] pl-2 pr-6 py-2 text-sm text-[rgba(30,50,90,0.9)] hover:bg-white/80 group">
          <span className="bg-[rgba(30,50,90,0.08)] p-1.5 rounded-full">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
          </span>
          Shop all {products.length} pieces
        </Link>
      </div>
    </Panel>
  );
}

const SPOTS = [
  { slug: 'drift-modular-sofa', x: 30, y: 72 },
  { slug: 'halo-round-coffee-table', x: 53, y: 81 },
  { slug: 'lumen-floor-lamp', x: 44, y: 32 },
];

function ShopTheRoom() {
  const [active, setActive] = useState(0);
  const { price } = useCurrency();
  const { add, setDrawerOpen } = useCart();
  const p = bySlug(SPOTS[active].slug)!;
  return (
    <Panel className="pt-20 md:pt-28">
      <div className="px-1 md:px-4 mb-8 md:mb-10">
        <SectionTitle eyebrow="Shop the room" title="The quiet living room." text="Tap the dots to see each piece. Every item in this room can be delivered and set up in one visit." />
      </div>
      <Reveal>
        <div className="relative">
        <div className="relative rounded-[1.5rem] md:rounded-[3rem] overflow-hidden aspect-[16/9]">
          <Img name="r-living" alt="Living room with a grey modular sofa, round coffee table and floor lamp" sizes="100vw" className="absolute inset-0" />
          {SPOTS.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => setActive(i)}
              aria-label={`Show ${bySlug(s.slug)!.name}`}
              aria-pressed={active === i}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center"
            >
              <span className={`absolute inset-0 rounded-full bg-white/50 ${active === i ? '' : 'animate-ping'}`} />
              <span className={`relative w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${active === i ? 'bg-[rgba(30,50,90,0.92)] text-white' : 'bg-white text-[rgba(30,50,90,0.9)]'}`}>
                <Plus className={`w-4 h-4 transition-transform ${active === i ? 'rotate-45' : ''}`} />
              </span>
            </button>
          ))}
        </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="crystal relative mt-2 sm:mt-0 sm:absolute sm:left-5 sm:bottom-5 md:left-8 md:bottom-8 sm:w-[340px] rounded-[1.3rem] md:rounded-[1.8rem] p-3 flex gap-3"
            >
              <Link to={`/product/${p.slug}`} className="relative shrink-0">
                <Img name={p.image} alt={p.name} sizes="96px" className="w-20 h-24 md:w-24 md:h-28 rounded-2xl" />
              </Link>
              <div className="relative flex-1 min-w-0 flex flex-col py-1">
                <p className="text-[11px] uppercase tracking-wider text-[rgba(30,50,90,0.55)]">{p.material}</p>
                <Link to={`/product/${p.slug}`} className="text-[15px] leading-snug text-[rgba(30,50,90,0.95)] hover:underline">
                  {p.name}
                </Link>
                <p className="text-sm text-[rgba(30,50,90,0.75)]">{price(p.price)}</p>
                <button
                  onClick={() => {
                    add(p.slug, p.finishes[0].name);
                    setDrawerOpen(true);
                  }}
                  className="mt-auto self-start inline-flex items-center gap-1.5 rounded-full bg-[rgba(30,50,90,0.88)] hover:bg-[rgba(30,50,90,1)] text-white pl-3 pr-4 py-1.5 text-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to cart
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Panel>
  );
}

function Craft() {
  return (
    <Panel className="pt-20 md:pt-28">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        <Reveal className="grid grid-cols-2 gap-2 md:gap-4">
          <Img name="d-wood" alt="Close-up of solid oak table joinery" sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[4/5] rounded-[1.4rem] md:rounded-[2.2rem]" />
          <Img name="d-boucle" alt="Close-up of looped bouclé fabric" sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[4/5] rounded-[1.4rem] md:rounded-[2.2rem] mt-10 md:mt-16" />
        </Reveal>
        <Reveal delay={0.1} className="px-1 md:px-4">
          <SectionTitle
            eyebrow="How it is made"
            title="Real materials. Small workshops. No shortcuts."
            text="Every Flowra piece starts with FSC-certified oak and walnut, Italian bouclé and stain-resistant linen. Frames are joined by hand in small workshops, finished with low-VOC oils, then checked twice before they leave."
          />
          <dl className="mt-8 grid grid-cols-3 gap-3">
            {[
              ['10 yr', 'Frame warranty'],
              ['100', 'Night home trial'],
              ['4.8', 'Average rating'],
            ].map(([n, l]) => (
              <div key={l} className="rounded-[1.2rem] md:rounded-[1.6rem] bg-white/60 border border-white/70 p-4">
                <dt className="text-2xl md:text-3xl tracking-tight text-[rgba(30,50,90,0.9)]">{n}</dt>
                <dd className="text-[11px] md:text-xs uppercase tracking-wider text-[rgba(30,50,90,0.55)] mt-1">{l}</dd>
              </div>
            ))}
          </dl>
          <Link to="/about" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[rgba(30,50,90,0.85)] hover:bg-[rgba(30,50,90,1)] text-white pl-2 pr-6 py-2 text-sm transition-colors group">
            <span className="bg-white/20 p-1.5 rounded-full">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
            </span>
            Read our story
          </Link>
        </Reveal>
      </div>
    </Panel>
  );
}

function Reviews() {
  return (
    <Panel className="pt-20 md:pt-28">
      <div className="rounded-[1.5rem] md:rounded-[3rem] bg-gradient-to-br from-white/80 via-white/40 to-[rgba(30,50,90,0.06)] border border-white/70 p-5 md:p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
          <SectionTitle eyebrow="Reviews" title="Loved in thousands of homes." />
          <div className="flex items-center gap-3">
            <Stars rating={4.8} size="w-4 h-4" />
            <span className="text-sm text-[rgba(30,50,90,0.7)]">4.8 average from 2,300+ reviews</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="crystal group h-full rounded-[1.4rem] md:rounded-[2rem] p-6 md:p-7 flex flex-col">
                <span className="sheen" />
                <Stars rating={5} />
                <blockquote className="relative mt-4 text-[15px] md:text-base leading-relaxed text-[rgba(30,50,90,0.85)]">“{t.quote}”</blockquote>
                <figcaption className="relative mt-auto pt-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[rgba(30,50,90,0.85)] text-white text-sm flex items-center justify-center">{t.name[0]}</span>
                  <span>
                    <span className="block text-sm text-[rgba(30,50,90,0.95)]">
                      {t.name} · {t.place}
                    </span>
                    <span className="block text-xs text-[rgba(30,50,90,0.55)]">Bought the {t.product}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function HelpAndFaq() {
  return (
    <Panel className="pt-20 md:pt-28">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 px-1 md:px-4">
        <div>
          <SectionTitle eyebrow="Questions" title="Good to know before you buy." />
          <Reveal className="mt-8">
            <div className="relative rounded-[1.5rem] md:rounded-[2.2rem] overflow-hidden">
              <Img name="a-showroom" alt="Bright Flowra showroom living area" sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3]" />
              <div className="crystal absolute inset-x-3 bottom-3 rounded-[1.2rem] md:rounded-[1.6rem] p-4 md:p-5">
                <Eyebrow className="relative">Free design advice</Eyebrow>
                <p className="relative mt-1 text-[15px] md:text-lg text-[rgba(30,50,90,0.95)]">Not sure what fits? Our designers can plan your room with you.</p>
                <div className="relative mt-3 flex flex-wrap gap-2">
                  <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-[rgba(30,50,90,0.88)] text-white px-4 py-2 text-sm hover:bg-[rgba(30,50,90,1)]">
                    Book a free call <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <a href={`tel:${CONTACT.tel}`} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-[rgba(30,50,90,0.9)] hover:bg-white">
                    <Phone className="w-4 h-4" /> {CONTACT.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div>
          <Faq limit={5} />
          <Link to="/contact#faq" className="mt-6 inline-flex items-center gap-2 text-sm text-[rgba(30,50,90,0.8)] hover:text-[rgba(30,50,90,1)] group">
            See all questions <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </Panel>
  );
}
