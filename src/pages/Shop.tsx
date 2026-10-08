import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Search, SlidersHorizontal, Truck, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import { Panel } from '../components/Bits';
import { KINDS, products, ROOM_LABEL, type Room } from '../data/products';
import { FREE_DELIVERY_USD } from '../lib/cart';
import { useCurrency } from '../lib/currency';
import { useTitle } from '../lib/useTitle';

const ROOM_IDS = Object.keys(ROOM_LABEL) as Room[];
const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
  { id: 'new', label: 'Newest' },
];

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Shop() {
  useTitle('Shop all furniture | Flowra');
  const [params, setParams] = useSearchParams();
  const { price } = useCurrency();

  const q = params.get('q') ?? '';
  const room = (params.get('room') ?? '') as Room | '';
  const kind = params.get('kind') ?? '';
  const collection = params.get('collection') ?? '';
  const sort = params.get('sort') ?? 'featured';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const list = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    let out = products.filter(p => {
      if (room && !p.rooms.includes(room)) return false;
      if (kind && p.kind !== kind) return false;
      if (collection === 'new' && !p.isNew) return false;
      if (collection === 'best' && !p.isBest) return false;
      if (collection === 'under1000' && p.price >= 1000) return false;
      if (words.length) {
        const hay = norm([p.name, p.material, p.kind, p.blurb, ...p.rooms, ...p.finishes.map(f => f.name)].join(' '));
        if (!words.every(w => hay.includes(w))) return false;
      }
      return true;
    });
    if (sort === 'price-asc') out = [...out].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') out = [...out].sort((a, b) => b.price - a.price);
    if (sort === 'rating') out = [...out].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sort === 'new') out = [...out].sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    return out;
  }, [q, room, kind, collection, sort]);

  const collectionLabel: Record<string, string> = { new: 'New arrivals', best: 'Bestsellers', under1000: `Under ${price(1000)}` };
  const active = [
    collection && { key: 'collection', label: collectionLabel[collection] ?? collection },
    kind && { key: 'kind', label: kind },
    q && { key: 'q', label: `“${q}”` },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <>
      <PageHeader
        image="h-shop"
        eyebrow="The shop"
        title="Everything for a calmer home."
        text={`${products.length} pieces in solid wood, bouclé, linen and brass. Made to order or ready to ship.`}
        corner={
          <>
            <span className="bg-[rgba(30,50,90,0.05)] w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-[rgba(30,50,90,0.1)]">
              <Truck className="w-5 h-5 md:w-6 md:h-6 text-[rgba(30,50,90,0.8)]" />
            </span>
            <span className="flex flex-col">
              <span className="text-[16px] md:text-[20px] text-[rgba(30,50,90,0.95)]">Free delivery</span>
              <span className="text-[12px] md:text-[15px] text-[rgba(30,50,90,0.6)]">On orders over {price(FREE_DELIVERY_USD)}</span>
            </span>
          </>
        }
      />

      <Panel className="pt-6 md:pt-10">
        <div className="rounded-[1.4rem] md:rounded-[2rem] bg-white/60 border border-white/70 p-3 md:p-4 flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <label className="relative flex-1">
              <span className="sr-only">Search furniture</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(30,50,90,0.45)]" />
              <input
                type="search"
                value={q}
                onChange={e => update('q', e.target.value)}
                placeholder="Search sofas, oak, bouclé…"
                className="w-full rounded-full bg-white border border-[rgba(30,50,90,0.1)] pl-11 pr-4 py-2.5 text-sm text-[rgba(30,50,90,0.95)] placeholder:text-[rgba(30,50,90,0.4)] outline-none focus:border-[rgba(30,50,90,0.4)]"
              />
            </label>
            <div className="flex gap-2">
              <label className="relative flex-1 lg:flex-none">
                <span className="sr-only">Type</span>
                <select
                  value={kind}
                  onChange={e => update('kind', e.target.value)}
                  className="w-full lg:w-44 appearance-none rounded-full bg-white border border-[rgba(30,50,90,0.1)] pl-4 pr-9 py-2.5 text-sm text-[rgba(30,50,90,0.9)] outline-none focus:border-[rgba(30,50,90,0.4)]"
                >
                  <option value="">All types</option>
                  {KINDS.map(k => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(30,50,90,0.5)]" />
              </label>
              <label className="relative flex-1 lg:flex-none">
                <span className="sr-only">Sort by</span>
                <select
                  value={sort}
                  onChange={e => update('sort', e.target.value === 'featured' ? '' : e.target.value)}
                  className="w-full lg:w-52 appearance-none rounded-full bg-white border border-[rgba(30,50,90,0.1)] pl-4 pr-9 py-2.5 text-sm text-[rgba(30,50,90,0.9)] outline-none focus:border-[rgba(30,50,90,0.4)]"
                >
                  {SORTS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(30,50,90,0.5)] rotate-90" />
              </label>
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-0.5" role="group" aria-label="Filter by room">
            {[{ id: '', label: 'All rooms' }, ...ROOM_IDS.map(id => ({ id, label: ROOM_LABEL[id] }))].map(r => (
              <button
                key={r.id || 'all'}
                onClick={() => update('room', r.id)}
                aria-pressed={room === r.id}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${room === r.id ? 'text-white' : 'text-[rgba(30,50,90,0.75)] bg-white/70 hover:bg-white'}`}
              >
                {room === r.id && <motion.span layoutId="room-pill" className="absolute inset-0 rounded-full bg-[rgba(30,50,90,0.88)]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 mb-4 flex flex-wrap items-center gap-2 px-1">
          <p className="text-sm text-[rgba(30,50,90,0.65)] mr-2" aria-live="polite">
            {list.length} {list.length === 1 ? 'piece' : 'pieces'}
          </p>
          {active.map(a => (
            <button
              key={a.key}
              onClick={() => update(a.key, '')}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-[rgba(30,50,90,0.1)] pl-3 pr-2 py-1 text-xs text-[rgba(30,50,90,0.85)] hover:bg-white"
            >
              {a.label} <X className="w-3.5 h-3.5" />
            </button>
          ))}
          {(active.length > 0 || room) && (
            <button onClick={() => setParams({}, { replace: true, preventScrollReset: true })} className="text-xs underline text-[rgba(30,50,90,0.6)] hover:text-[rgba(30,50,90,0.9)]">
              Clear all
            </button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {list.length ? (
            <motion.div key="grid" layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => (
                  <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                    <ProductCard product={p} priority={i < 4} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] bg-white/60 border border-white/70 p-10 text-center">
              <p className="text-xl text-[rgba(30,50,90,0.9)]">No pieces match those filters.</p>
              <p className="mt-2 text-sm text-[rgba(30,50,90,0.6)]">Try another room or search word.</p>
              <button
                onClick={() => setParams({}, { replace: true, preventScrollReset: true })}
                className="mt-5 rounded-full bg-[rgba(30,50,90,0.88)] text-white px-5 py-2.5 text-sm hover:bg-[rgba(30,50,90,1)]"
              >
                Show everything
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Panel>
    </>
  );
}
