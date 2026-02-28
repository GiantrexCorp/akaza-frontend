'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Building2, Globe2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { MarketPoint } from '@/components/MarketsGlobe';

const MarketsGlobe = dynamic(() => import('@/components/MarketsGlobe'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[430px] w-full items-center justify-center border border-[var(--line-soft)] bg-[linear-gradient(140deg,rgba(18,38,46,0.75),rgba(8,17,22,0.9))] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] md:h-[590px]">
      Initializing Global Interface
    </div>
  ),
});

type MarketInfo = MarketPoint & {
  region: string;
  summary: string;
  highlights: string[];
  image: string;
};

const markets: MarketInfo[] = [
  {
    id: 'germany',
    name: 'Germany',
    lat: 51.2,
    lon: 10.4,
    region: 'Central Europe',
    summary: 'Enterprise and executive travel orchestration for precision-driven markets.',
    highlights: ['Frankfurt corporate corridors', 'Berlin executive mobility', 'Private transfer reliability'],
    image: '/images/hotel-marriott.jpg',
  },
  {
    id: 'france',
    name: 'France',
    lat: 46.4,
    lon: 2.2,
    region: 'Western Europe',
    summary: 'Luxury business travel blended with cultural high-touch programming.',
    highlights: ['Paris board-level logistics', 'Cannes event handling', 'Discreet VIP support'],
    image: '/images/hotel-four-seasons.jpg',
  },
  {
    id: 'italy',
    name: 'Italy',
    lat: 42.8,
    lon: 12.5,
    region: 'Southern Europe',
    summary: 'Concierge-led travel across finance, design, and private investment networks.',
    highlights: ['Milan fashion & finance routes', 'Rome diplomatic scheduling', 'Coastal executive retreats'],
    image: '/images/cairo.jpg',
  },
  {
    id: 'gcc',
    name: 'GCC',
    lat: 24.4,
    lon: 47.6,
    region: 'Gulf Cooperation Council',
    summary: 'High-trust mobility and protocol-driven service for Gulf corporate partners.',
    highlights: ['Riyadh / Dubai / Doha coverage', 'Protocol-grade meet & assist', 'Private aviation coordination'],
    image: '/images/hero/hero-main-v2.png',
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    lat: 54.4,
    lon: -2.8,
    region: 'Northwestern Europe',
    summary: 'Boardroom-to-destination execution for institutions and private offices.',
    highlights: ['London executive operations', 'Regional business circuits', 'White-label fulfillment'],
    image: '/images/hurghada.jpg',
  },
  {
    id: 'poland',
    name: 'Poland',
    lat: 52.0,
    lon: 19.1,
    region: 'Central Europe',
    summary: 'Rapidly scaling corporate travel infrastructure with premium oversight.',
    highlights: ['Warsaw commercial hubs', 'Cross-border route planning', 'Business-class accommodation network'],
    image: '/images/vehicle-limousine.jpg',
  },
  {
    id: 'russia',
    name: 'Russia',
    lat: 56.0,
    lon: 37.6,
    region: 'Eastern Europe / Eurasia',
    summary: 'Complex-route management with discretion, compliance awareness, and resilience.',
    highlights: ['Moscow strategic operations', 'Regional partner vetting', 'Mission-critical traveler support'],
    image: '/images/hotel-steigenberger.jpg',
  },
];

export default function MarketsContent() {
  const [selectedId, setSelectedId] = useState(markets[0].id);
  const [hoverId, setHoverId] = useState<string | null>(null);

  useScrollReveal();

  const activeMarket = useMemo(
    () => markets.find((m) => m.id === (hoverId || selectedId)) ?? markets[0],
    [hoverId, selectedId]
  );

  return (
    <>
      <section
        id="markets-globe"
        className="relative overflow-hidden bg-[var(--surface-section)] px-6 py-20 md:py-24"
      >
        <span className="pointer-events-none absolute -left-24 top-4 h-[340px] w-[340px] rounded-full bg-primary/12 blur-[96px]" />
        <span className="pointer-events-none absolute right-0 top-10 h-[320px] w-[320px] rounded-full bg-[var(--color-accent)]/12 blur-[96px]" />

        <div className="mx-auto max-w-7xl">
          <div data-reveal className="reveal-item mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                Market Command Center
              </span>
              <h2 className="mt-4 text-3xl md:text-5xl font-serif text-[var(--text-primary)]">
                Strategic Coverage
                <span className="block italic text-[var(--color-accent-light)]">Across Priority Regions</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
              Rotate the globe to inspect key markets and select any region for a focused operational profile.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div data-reveal className="reveal-item">
              <MarketsGlobe
                markets={markets}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onHover={setHoverId}
              />
            </div>

            <aside
              data-reveal
              className="reveal-item border border-[var(--line-soft)] bg-[var(--surface-card)]/92 p-6 md:p-8 backdrop-blur-sm shadow-[0_26px_44px_-32px_rgba(0,0,0,0.35)]"
            >
              <div className="relative mb-5 overflow-hidden border border-[var(--line-soft)]">
                <Image
                  src={activeMarket.image}
                  alt={activeMarket.name}
                  width={960}
                  height={560}
                  className="h-[238px] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  <Globe2 size={12} />
                  Active Market
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {activeMarket.region}
                </span>
              </div>

              <h2 className="mt-5 text-3xl md:text-4xl font-serif text-[var(--text-primary)]">{activeMarket.name}</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--text-secondary)]">{activeMarket.summary}</p>

              <ul className="mt-6 space-y-2.5">
                {activeMarket.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/90" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 border border-primary/70 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:-translate-y-0.5 hover:bg-primary-gradient-end hover:shadow-[0_16px_32px_-18px_rgba(185,117,50,0.95)]"
              >
                Start Partnership
                <ArrowRight size={13} />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface-page)] px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h3 className="text-3xl md:text-4xl font-serif">Priority Markets</h3>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Click a market to focus on the globe
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {markets.map((market) => {
              const isActive = market.id === activeMarket.id;
              return (
                <button
                  key={market.id}
                  onClick={() => setSelectedId(market.id)}
                  className={`group border p-3 text-left transition-all duration-500 ${
                    isActive
                      ? 'border-primary/65 bg-primary/10 shadow-[0_18px_36px_-24px_rgba(185,117,50,0.75)]'
                      : 'border-[var(--line-soft)] bg-[var(--surface-card)]/70 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_16px_32px_-24px_rgba(185,117,50,0.56)]'
                  }`}
                >
                  <div className="relative mb-3 overflow-hidden border border-[var(--line-soft)]">
                    <Image
                      src={market.image}
                      alt={market.name}
                      width={640}
                      height={380}
                      className="h-[126px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/45 bg-primary/10 text-primary">
                    <Building2 size={14} />
                  </div>
                  <h4 className="mt-3 text-xl font-serif">{market.name}</h4>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {market.region}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface-section)] px-6 py-14">
        <div
          data-reveal
          className="reveal-item mx-auto max-w-5xl border border-[var(--line-soft)] bg-[linear-gradient(120deg,rgba(185,117,50,0.2),rgba(16,33,39,0.52),rgba(185,117,50,0.18))] p-8 md:p-11 text-center"
        >
          <h3 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)]">Built For Cross-Border Excellence</h3>
          <p className="mt-4 max-w-3xl mx-auto text-[var(--text-secondary)]">
            Our corporate framework scales across regions while preserving discretion, reliability, and premium execution for your teams.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href="/corporate-partnerships"
              className="inline-flex items-center gap-2 border border-primary/65 bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-primary-gradient-end hover:-translate-y-0.5"
            >
              View Corporate Partnerships
              <Sparkles size={13} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
