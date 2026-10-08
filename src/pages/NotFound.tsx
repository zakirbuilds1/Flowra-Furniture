import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import NavShell from '../components/NavShell';
import { Panel } from '../components/Bits';
import { useTitle } from '../lib/useTitle';

export default function NotFound() {
  useTitle('Page not found | Flowra');
  return (
    <>
      <NavShell />
      <Panel className="pt-6">
        <div className="rounded-[1.5rem] md:rounded-[3rem] bg-white/60 border border-white/70 px-6 py-20 md:py-28 text-center">
          <p className="text-[96px] md:text-[160px] leading-none tracking-tighter text-[rgba(30,50,90,0.15)]">404</p>
          <h1 className="mt-2 text-3xl md:text-5xl tracking-tight text-[#5E6470]">This room is empty.</h1>
          <p className="mt-3 text-[rgba(30,50,90,0.65)]">The page you are looking for has moved or no longer exists.</p>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[rgba(30,50,90,0.85)] hover:bg-[rgba(30,50,90,1)] text-white pl-2 pr-6 py-2 text-sm group">
            <span className="bg-white/20 p-1.5 rounded-full">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
            </span>
            Shop Now
          </Link>
        </div>
      </Panel>
    </>
  );
}
