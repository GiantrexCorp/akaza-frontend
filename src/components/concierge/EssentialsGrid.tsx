import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Car, Plane, Ticket } from 'lucide-react';

const essentials = [
  {
    icon: Car,
    title: 'Private Transfers',
    body: 'Professional chauffeur-led mobility with route-level precision and premium vehicle standards.',
    image: '/images/vehicle-limousine.jpg',
    alt: 'Private transfer vehicle',
  },
  {
    icon: Plane,
    title: 'VIP Airport Services',
    body: 'Fast-track immigration, private lounge access, and seamless handover from runway to residence.',
    image: '/images/vehicle-van.jpg',
    alt: 'VIP transport and airport support',
  },
  {
    icon: Ticket,
    title: 'Exclusive Access',
    body: 'Hard-to-secure tickets, closed-door events, and private cultural programs beyond the public schedule.',
    image: '/images/hotel-marriott.jpg',
    alt: 'Exclusive private dining table',
  },
];

export default function EssentialsGrid() {
  return (
    <section className="bg-[var(--surface-section)] px-6 pb-18">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h3 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)]">
            Seamless Sophistication
          </h3>
          <p className="mt-3 text-[var(--text-muted)]">
            Elevating each stage of your itinerary through proactive concierge execution.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {essentials.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                data-reveal
                className="reveal-item group border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_22px_40px_-24px_rgba(185,117,50,0.8)]"
              >
                <div className="relative overflow-hidden border border-[var(--line-soft)]">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    width={760}
                    height={460}
                    className="h-[170px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/45 text-primary">
                  <Icon size={15} />
                </div>
                <h4 className="mt-4 text-3xl font-serif text-[var(--text-primary)]">{service.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{service.body}</p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:text-primary-gradient-end"
                >
                  Learn More
                  <ArrowRight size={13} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
