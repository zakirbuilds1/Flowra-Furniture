import { useRef, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Plus } from 'lucide-react';
import { Img, lqipOf } from './Img';
import { Stars } from './Bits';
import type { Product } from '../data/products';
import { useCurrency } from '../lib/currency';
import { useCart } from '../lib/cart';

const SIZES = '(min-width: 1280px) 340px, (min-width: 768px) 30vw, 50vw';

/** Crystal glass product card: frosted info panel, hairline edge, light sweep, 3D tilt and cursor glare. */
export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { price } = useCurrency();
  const { add, setDrawerOpen } = useCart();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 180, damping: 18 });
  const gx = useTransform(px, v => `${v * 100}%`);
  const gy = useTransform(py, v => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.38), transparent 45%)`;

  const onMove = (e: PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const badge = product.compareAt ? 'Save' : product.isNew ? 'New' : product.isBest ? 'Bestseller' : null;

  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative rounded-[1.4rem] md:rounded-[2rem] overflow-hidden aspect-[4/5.6]"
      >
        <Link to={`/product/${product.slug}`} className="absolute inset-0" aria-label={product.name}>
          {/* Photo takes the top of the card and fades into its own blurred placeholder */}
          <div className="absolute inset-0 bg-cover bg-center scale-110" style={{ backgroundImage: `url(${lqipOf(product.image)})` }} />
          <Img
            name={product.image}
            alt={product.name}
            sizes={SIZES}
            priority={priority}
            className="absolute inset-x-0 top-0 aspect-[4/5] [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]"
            imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {badge && (
          <span className="absolute top-3 left-3 md:top-4 md:left-4 rounded-full bg-white/70 backdrop-blur-md px-3 py-1 text-[10px] md:text-[11px] uppercase tracking-wider text-[rgba(30,50,90,0.85)]">
            {badge}
          </span>
        )}

        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light" style={{ background: glare }} />

        <div className="crystal absolute inset-x-2 bottom-2 md:inset-x-3 md:bottom-3 rounded-[1.1rem] md:rounded-[1.5rem] p-3 md:p-4 flex items-end justify-between gap-2">
          <span className="sheen" />
          <Link to={`/product/${product.slug}`} className="min-w-0 relative">
            <p className="hidden sm:block text-[10px] md:text-[11px] uppercase tracking-wider text-[rgba(30,50,90,0.55)] truncate">{product.material}</p>
            <h3 className="text-[13px] md:text-[15px] leading-snug text-[rgba(30,50,90,0.95)] line-clamp-2">{product.name}</h3>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-[13px] md:text-sm text-[rgba(30,50,90,0.9)]">{price(product.price)}</span>
              {product.compareAt && <span className="text-[11px] md:text-xs line-through text-[rgba(30,50,90,0.45)]">{price(product.compareAt)}</span>}
              <span className="hidden sm:inline-flex">
                <Stars rating={product.rating} size="w-3 h-3" />
              </span>
            </div>
          </Link>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              add(product.slug, product.finishes[0].name);
              setDrawerOpen(true);
            }}
            aria-label={`Add ${product.name} to cart`}
            className="relative shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-[rgba(30,50,90,0.85)] hover:bg-[rgba(30,50,90,1)] text-white flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
