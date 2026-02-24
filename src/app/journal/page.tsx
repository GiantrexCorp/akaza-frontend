'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Leaf,
  UtensilsCrossed,
  Plane,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';

const insightHighlights = [
  {
    category: 'Curation',
    title: 'A Guide to Mindful Travel',
    body: 'How to connect deeply with your surroundings through sensory awareness and intentional disconnection.',
  },
  {
    category: 'Heritage',
    title: 'Preserving the Intangible',
    body: 'Supporting local craftsmanship and ancestral knowledge through conscious travel choices.',
  },
];

const guideCards = [
  {
    title: "Kyoto's Hidden Ryokans",
    body: 'Finding serenity in the quiet districts of Gion and beyond.',
    image: '/images/hotel-marriott.jpg',
    alt: 'Quiet Japanese room',
  },
  {
    title: 'The Golden Triangle Revisited',
    body: "A new perspective on Rajasthan's most iconic landmarks.",
    image: '/images/map-egypt.jpg',
    alt: 'Architectural landmark',
  },
  {
    title: 'Venetian Sovereignty',
    body: 'Exploring the private islands of the Venetian Lagoon.',
    image: '/images/hurghada.jpg',
    alt: 'Canal waters and city reflections',
  },
];

const trendCards = [
  {
    icon: Plane,
    title: 'Private Aviation: The New Standard',
    body: 'Why exclusivity and security are driving growth in private global mobility.',
    image: '/images/vehicle-limousine.jpg',
  },
  {
    icon: Leaf,
    title: 'Ultra-Eco Estates',
    body: 'The rise of carbon-negative retreats offering luxury without compromise.',
    image: '/images/hotel-steigenberger.jpg',
  },
  {
    icon: UtensilsCrossed,
    title: 'Regenerative Fine Dining',
    body: 'How Michelin-level chefs are leading farm-to-table evolution on remote estates.',
    image: '/images/hotel-four-seasons.jpg',
  },
  {
    icon: Sparkles,
    title: 'Longevity Retreats',
    body: 'Medical-grade wellness integrated into bespoke travel itineraries.',
    image: '/images/marsa-alam.jpg',
  },
];

export default function JournalPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -12% 0px' }
    );

    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      <main className="bg-[var(--surface-page)] text-[var(--text-primary)]">
        <SubpageHero
          badge="Feature Story"
          title={
            <>
              The Art of Slow Living
              <br />
              in the Amalfi Coast
            </>
          }
          subtitle="An exploration into timeless Mediterranean philosophy, where every sunset is ceremony and every meal carries a story."
          imageSrc="/images/hero/hero-main.png"
          imageAlt="Journal feature destination"
          primaryCta={{ label: 'Read Story', href: '#travel-insights' }}
          secondaryCta={{ label: 'Explore Guides', href: '#destination-guides' }}
        />

        <section id="travel-insights" className="bg-[var(--surface-section)] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4 border-b border-[var(--line-soft)] pb-5">
              <h2 className="text-4xl md:text-5xl font-serif italic">Travel Insights</h2>
              <Link
                href="#"
                className="text-[11px] uppercase tracking-[0.2em] font-semibold text-primary hover:text-primary-gradient-end transition-colors"
              >
                View Archive
              </Link>
            </div>

            <div className="mt-9 grid gap-7 lg:grid-cols-[1.05fr_0.95fr]">
              <article
                data-reveal
                className="reveal-item group overflow-hidden border border-[var(--line-soft)] bg-[var(--surface-card)]/45 transition-all duration-500 hover:border-primary/55 hover:shadow-[0_24px_48px_-28px_rgba(185,117,50,0.8)]"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src="/images/hotel-marriott.jpg"
                    alt="The Philosophy of Wandering"
                    width={1200}
                    height={760}
                    className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Philosophy</p>
                  <h3 className="mt-3 text-4xl font-serif">The Philosophy of Wandering</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                    A renewed perspective on curated anonymity and meaningful movement
                    for travelers who prioritize depth over spectacle.
                  </p>
                  <Link
                    href="#"
                    className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-primary hover:text-primary-gradient-end transition-colors"
                  >
                    Read More
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>

              <div className="space-y-5">
                {insightHighlights.map((item) => (
                  <article
                    key={item.title}
                    data-reveal
                    className="reveal-item border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/45"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{item.category}</p>
                    <h4 className="mt-2 text-3xl font-serif">{item.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{item.body}</p>
                    <Link
                      href="#"
                      className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--text-secondary)] hover:text-primary transition-colors"
                    >
                      8 Min Read
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--surface-section)] px-6 pb-16">
          <div
            data-reveal
            className="reveal-item mx-auto max-w-5xl border border-[var(--line-soft)] bg-[linear-gradient(120deg,rgba(185,117,50,0.2),rgba(16,33,39,0.5),rgba(185,117,50,0.18))] p-8 md:p-10 text-center"
          >
            <h3 className="text-4xl md:text-5xl font-serif italic text-[var(--text-primary)]">The Akaza Ledger</h3>
            <p className="mt-3 max-w-2xl mx-auto text-[var(--text-secondary)]">
              Subscribe for rare insights, destination previews, and early access to private journals.
            </p>
            <form className="mt-7 mx-auto flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="h-12 flex-1 border border-[var(--line-strong)] bg-[var(--surface-card)]/65 px-4 text-sm text-[var(--field-text)] placeholder-[var(--field-placeholder)] outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="h-12 border border-primary/65 bg-primary px-7 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-primary-gradient-end"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        <section id="destination-guides" className="bg-[var(--surface-page)] px-6 py-16 md:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4 border-b border-[var(--line-soft)] pb-5">
              <h3 className="text-4xl md:text-5xl font-serif italic">Destination Guides</h3>
              <Link
                href="/destinations"
                className="text-[11px] uppercase tracking-[0.2em] font-semibold text-primary hover:text-primary-gradient-end transition-colors"
              >
                Explore All
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {guideCards.map((card) => (
                <article
                  key={card.title}
                  data-reveal
                  className="reveal-item group border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-3 transition-all duration-500 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_24px_45px_-28px_rgba(185,117,50,0.75)]"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      width={760}
                      height={980}
                      className="h-[280px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="mt-4 text-2xl font-serif">{card.title}</h4>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--surface-page)] px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="border-b border-[var(--line-soft)] pb-5">
              <h3 className="text-4xl md:text-5xl font-serif italic">Luxury Travel Trends</h3>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {trendCards.map((trend) => {
                const Icon = trend.icon;
                return (
                  <article
                    key={trend.title}
                    data-reveal
                    className="reveal-item group flex gap-4 border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-4 transition-all duration-500 hover:border-primary/55 hover:-translate-y-0.5"
                  >
                    <div className="relative h-18 w-28 shrink-0 overflow-hidden border border-[var(--line-soft)]">
                      <Image
                        src={trend.image}
                        alt={trend.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/45 text-primary">
                        <Icon size={13} />
                      </div>
                      <h4 className="mt-2 text-2xl font-serif">{trend.title}</h4>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{trend.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[var(--surface-section)] px-6 pb-24">
          <div
            data-reveal
            className="reveal-item mx-auto max-w-5xl border border-[var(--line-soft)] bg-[var(--surface-card)] p-8 md:p-10 text-center"
          >
            <h3 className="text-4xl md:text-6xl font-serif">Ready to Curate Your Next Story?</h3>
            <p className="mt-4 text-[var(--text-muted)]">
              Partner with Akaza editors and concierges for private destination narratives.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-primary/65 bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-primary-gradient-end"
              >
                Speak With Editorial
              </Link>
              <Link
                href="/experiences"
                className="inline-flex items-center justify-center border border-[var(--line-strong)] px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-all hover:border-primary/55 hover:text-primary"
              >
                Explore Experiences
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
