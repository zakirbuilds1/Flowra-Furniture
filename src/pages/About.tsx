import { Link } from 'react-router-dom';
import { ArrowUpRight, Hammer, Leaf, RotateCcw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Img } from '../components/Img';
import { Eyebrow, Panel, Reveal, SectionTitle } from '../components/Bits';
import { useTitle } from '../lib/useTitle';

const STATS = [
  ['2016', 'Founded in Brooklyn'],
  ['12,400+', 'Homes furnished'],
  ['3', 'Showrooms: NYC, London, Toronto'],
  ['10 yr', 'Warranty on every frame'],
];

const STEPS = [
  {
    n: '01',
    image: 'd-wood',
    title: 'Responsibly sourced',
    text: 'FSC-certified oak and walnut from managed forests, Italian bouclé and stain-resistant linen. We trace every material to its mill.',
  },
  {
    n: '02',
    image: 'a-plane',
    title: 'Made by hand',
    text: 'Frames are cut, joined and finished by small workshops in North Carolina and Portugal, using mortise-and-tenon joinery and low-VOC oils.',
  },
  {
    n: '03',
    image: 'a-entry',
    title: 'Delivered with care',
    text: 'A two-person team brings each piece into your home, assembles it and takes every scrap of packaging away. Carbon-neutral, every time.',
  },
];

const VALUES = [
  { icon: Leaf, title: 'Kinder to the planet', text: 'Low-VOC finishes, plastic-free packaging and carbon-neutral delivery on every order.' },
  { icon: Hammer, title: 'Made to be repaired', text: 'Removable covers and replaceable parts, so a spill or a move never ends a sofa’s life.' },
  { icon: RotateCcw, title: 'No-pressure buying', text: 'A 100-night home trial with free collection, because furniture should feel right at home.' },
];

const TEAM = [
  { image: 't-maya', name: 'Maya Ellison', role: 'Founder & Creative Director' },
  { image: 't-james', name: 'James Whitfield', role: 'Head of Craft' },
  { image: 't-lena', name: 'Lena Park', role: 'Client Experience Lead' },
];

export default function About() {
  useTitle('Our story | Flowra');
  return (
    <>
      <PageHeader
        image="h-about"
        eyebrow="Our story"
        title="Made slowly. Built to last."
        text="Flowra began in a small Brooklyn workshop with one idea: beautiful furniture should be comfortable, honest about its materials and made to stay."
        corner={
          <span className="flex flex-col">
            <span className="text-[16px] md:text-[20px] text-[rgba(30,50,90,0.95)]">Since 2016</span>
            <span className="text-[12px] md:text-[15px] text-[rgba(30,50,90,0.6)]">12,400+ homes furnished</span>
          </span>
        }
      />

      <Panel className="pt-16 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center px-1 md:px-4">
          <Reveal>
            <SectionTitle eyebrow="Where we started" title="From one workshop to homes across three continents." />
            <div className="mt-6 space-y-4 text-[15px] md:text-base leading-relaxed text-[#5E6470]">
              <p>
                Our founder Maya Ellison spent ten years designing hotel interiors and kept hearing the same thing from guests: “Where can I buy this chair?” The answer was usually nowhere, or for a price few people could justify.
              </p>
              <p>
                So in 2016 she partnered with a family-run joinery and made twelve lounge chairs. They sold in a weekend. Today Flowra designs every piece in-house, makes it in small workshops and sells it directly to you, which keeps the quality high and the price fair.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Img name="a-showroom" alt="A bright living room furnished by Flowra" sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] rounded-[1.5rem] md:rounded-[2.6rem]" />
          </Reveal>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          {STATS.map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.06}>
              <dl className="h-full rounded-[1.2rem] md:rounded-[2rem] bg-white/60 border border-white/70 p-5 md:p-7">
                <dt className="text-3xl md:text-5xl tracking-tight text-[rgba(30,50,90,0.9)]">{n}</dt>
                <dd className="mt-2 text-xs md:text-sm text-[rgba(30,50,90,0.6)]">{l}</dd>
              </dl>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel className="pt-20 md:pt-28" id="craft">
        <div className="px-1 md:px-4 mb-8 md:mb-10">
          <SectionTitle eyebrow="How we make it" title="Three steps, no shortcuts." />
        </div>
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <article className="group relative rounded-[1.5rem] md:rounded-[2.4rem] overflow-hidden aspect-[4/5]">
                <Img name={s.image} alt={s.title} sizes="(min-width: 768px) 33vw, 100vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.4s] group-hover:scale-105" />
                <div className="crystal absolute inset-x-3 bottom-3 rounded-[1.2rem] md:rounded-[1.8rem] p-5">
                  <span className="sheen" />
                  <p className="relative text-xs tracking-[0.2em] text-[rgba(30,50,90,0.55)]">{s.n}</p>
                  <h3 className="relative mt-1 text-xl text-[rgba(30,50,90,0.95)]">{s.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-[rgba(30,50,90,0.75)]">{s.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel className="pt-20 md:pt-28">
        <div className="rounded-[1.5rem] md:rounded-[3rem] bg-gradient-to-br from-white/80 via-white/40 to-[rgba(30,50,90,0.06)] border border-white/70 p-6 md:p-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-8">
          <SectionTitle eyebrow="What we believe" title="Better furniture, fewer regrets." />
          <div className="grid sm:grid-cols-3 gap-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[1.2rem] md:rounded-[1.8rem] bg-white/70 p-5">
                <span className="w-10 h-10 rounded-full bg-[rgba(30,50,90,0.06)] flex items-center justify-center text-[rgba(30,50,90,0.8)]">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="mt-4 text-[rgba(30,50,90,0.95)]">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[rgba(30,50,90,0.65)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel className="pt-20 md:pt-28">
        <div className="px-1 md:px-4 mb-8 md:mb-10">
          <SectionTitle eyebrow="The people" title="Meet the team behind every piece." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <figure className="relative rounded-[1.5rem] md:rounded-[2.4rem] overflow-hidden aspect-[4/5]">
                <Img name={m.image} alt={`${m.name}, ${m.role}`} sizes="(min-width: 640px) 33vw, 100vw" className="absolute inset-0" />
                <figcaption className="crystal absolute inset-x-3 bottom-3 rounded-[1.2rem] md:rounded-[1.6rem] px-5 py-4">
                  <p className="relative text-[rgba(30,50,90,0.95)]">{m.name}</p>
                  <Eyebrow className="relative mt-0.5">{m.role}</Eyebrow>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Panel>

      <Panel className="pt-20 md:pt-28">
        <div className="relative rounded-[1.5rem] md:rounded-[3rem] overflow-hidden">
          <Img name="r-living" alt="" sizes="100vw" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />
          <div className="relative p-6 py-14 md:p-16 max-w-xl">
            <SectionTitle eyebrow="Ready when you are" title="Find the piece that makes the room." />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center gap-3 rounded-full bg-[rgba(30,50,90,0.85)] hover:bg-[rgba(30,50,90,1)] text-white pl-2 pr-6 py-2 text-sm transition-colors group">
                <span className="bg-white/20 p-1.5 rounded-full">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                </span>
                Shop Now
              </Link>
              <Link to="/contact#showrooms" className="inline-flex items-center rounded-full bg-white/80 hover:bg-white px-6 py-2 text-sm text-[rgba(30,50,90,0.9)]">
                Visit a showroom
              </Link>
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
}
