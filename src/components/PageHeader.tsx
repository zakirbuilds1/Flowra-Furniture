import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import Navbar from './Navbar';
import { Img } from './Img';

interface Props {
  image: string;
  eyebrow: string;
  title: ReactNode;
  text?: string;
  corner?: ReactNode;
}

/** Inner-page header: same rounded frame, navbar and faux-cutout corner as the home hero. */
export default function PageHeader({ image, eyebrow, title, text, corner }: Props) {
  return (
    <div className="w-full p-3 md:p-5">
      <section className="relative mx-auto w-full max-w-[1536px] h-[68vh] min-h-[520px] max-h-[760px] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden flex flex-col">
        <Img name={image} alt="" sizes="100vw" priority className="absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/10 to-transparent" />
        <div className="relative z-10 flex flex-col h-full">
          <Navbar />
          <div className="mt-auto p-3 sm:p-4 md:p-8 lg:p-10 pb-24 sm:pb-24 md:pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="crystal max-w-xl rounded-[1.4rem] md:rounded-[2.2rem] p-5 md:p-8"
            >
              <p className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-[rgba(30,50,90,0.6)]">{eyebrow}</p>
              <h1 className="mt-2 text-4xl md:text-6xl tracking-tight leading-[1.02] text-[#5E6470]">{title}</h1>
              {text && <p className="mt-3 text-sm md:text-base leading-relaxed text-[#5E6470]/85">{text}</p>}
            </motion.div>
          </div>
        </div>
        {corner && <Corner>{corner}</Corner>}
      </section>
    </div>
  );
}

/** Generic version of the hero's bottom-right faux cutout. */
export function Corner({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute z-20 bottom-0 right-0 p-3 pt-5 pl-8 sm:p-4 sm:pt-6 sm:pl-10 md:p-6 md:pt-8 md:pl-14 bg-[#f0f0f0] rounded-tl-[1.5rem] sm:rounded-tl-[2rem] md:rounded-tl-[3.5rem] flex items-center gap-3 sm:gap-4 md:gap-6"
    >
      <div className="absolute -top-[1.5rem] sm:-top-[2rem] md:-top-[3.5rem] right-0 w-[1.5rem] sm:w-[2rem] md:w-[3.5rem] h-[1.5rem] sm:h-[2rem] md:h-[3.5rem] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#f0f0f0" />
        </svg>
      </div>
      <div className="absolute bottom-0 -left-[1.5rem] sm:-left-[2rem] md:-left-[3.5rem] w-[1.5rem] sm:w-[2rem] md:w-[3.5rem] h-[1.5rem] sm:h-[2rem] md:h-[3.5rem] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="#f0f0f0" />
        </svg>
      </div>
      {children}
    </motion.div>
  );
}
