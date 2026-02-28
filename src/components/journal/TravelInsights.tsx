import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

export default function TravelInsights() {
  return (
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
  );
}
