import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { FAQ } from '../data/site';
import { DELIVERY_USD, FREE_DELIVERY_USD } from '../lib/cart';
import { useCurrency } from '../lib/currency';

export default function Faq({ limit }: { limit?: number }) {
  const { price } = useCurrency();
  const [open, setOpen] = useState<number | null>(0);
  const items = limit ? FAQ.slice(0, limit) : FAQ;
  return (
    <ul className="divide-y divide-[rgba(30,50,90,0.1)] border-y border-[rgba(30,50,90,0.1)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-6 py-5 text-left text-base md:text-lg text-[rgba(30,50,90,0.92)] hover:text-[rgba(30,50,90,1)]"
            >
              {item.q}
              <span className={`shrink-0 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                <Plus className="w-4 h-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <p className="pb-5 pr-12 text-sm md:text-[15px] leading-relaxed text-[#5E6470]">
                    {item.a.replace('{free}', price(FREE_DELIVERY_USD)).replace('{fee}', price(DELIVERY_USD))}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
