import { useEffect, useRef, useState } from 'react';
import lqipData from '../data/lqip.json';

const LQIP = lqipData as Record<string, { lq: string; w: number[] }>;
export const BASE = import.meta.env.BASE_URL;
export const lqipOf = (name: string) => LQIP[name].lq;
export const imgUrl = (name: string, w?: number) => `${BASE}images/${name}-${w ?? LQIP[name].w[LQIP[name].w.length - 1]}.webp`;

interface Props {
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

/** Responsive WebP with a ~150-byte blurred placeholder that fades into the real photo. */
export function Img({ name, alt, sizes, className = '', imgClassName = '', priority }: Props) {
  const meta = LQIP[name];
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = ref.current;
    setLoaded(Boolean(el?.complete && el.naturalWidth));
  }, [name]);
  return (
    <div className={`lqip overflow-hidden ${className}`} style={{ backgroundImage: `url(${meta.lq})` }}>
      <img
        ref={ref}
        src={imgUrl(name)}
        srcSet={meta.w.map(w => `${imgUrl(name, w)} ${w}w`).join(', ')}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`block w-full h-full object-cover ${loaded ? 'is-loaded' : ''} ${imgClassName}`}
      />
    </div>
  );
}
