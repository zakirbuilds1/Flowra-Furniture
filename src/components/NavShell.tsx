import Navbar from './Navbar';

/** Navbar in a light rounded bar, for pages without a photo header. */
export default function NavShell() {
  return (
    <div className="w-full px-3 pt-3 md:px-5 md:pt-5">
      <div className="mx-auto max-w-[1536px] rounded-[1.5rem] md:rounded-[3rem] bg-white/55 border border-white/70">
        <Navbar />
      </div>
    </div>
  );
}
