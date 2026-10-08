import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

/** Fade-and-rise when the block scrolls into view. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stars({ rating, size = 'w-3.5 h-3.5' }: { rating: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${size} ${i <= Math.round(rating) ? 'fill-[#b8925a] text-[#b8925a]' : 'text-[rgba(30,50,90,0.25)]'}`}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-[11px] md:text-xs uppercase tracking-[0.18em] text-[rgba(30,50,90,0.55)] ${className}`}>{children}</p>;
}

export function SectionTitle({ eyebrow, title, text, className = '' }: { eyebrow: string; title: ReactNode; text?: string; className?: string }) {
  return (
    <div className={className}>
      <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
      <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-[#5E6470]">{title}</h2>
      {text && <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-[#5E6470]/80">{text}</p>}
    </div>
  );
}

/** Rounded content panel that matches the hero frame. */
export function Panel({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`px-3 md:px-5 ${className}`}>
      <div className="mx-auto w-full max-w-[1536px]">{children}</div>
    </section>
  );
}
