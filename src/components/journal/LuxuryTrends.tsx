import Image from 'next/image';
import { Leaf, UtensilsCrossed, Plane, Sparkles } from 'lucide-react';

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

export default function LuxuryTrends() {
  return (
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
  );
}
