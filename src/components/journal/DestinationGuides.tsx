import Image from 'next/image';
import Link from 'next/link';

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

export default function DestinationGuides() {
  return (
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
  );
}
