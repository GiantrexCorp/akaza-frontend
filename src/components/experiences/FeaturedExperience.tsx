'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  'Private Sea Escapes',
  'Cultural Heritage',
  'Luxury Family',
  'Executive Travel',
  'Romantic Getaways',
  'VIP & Discreet',
];

const featuredExperiences = [
  {
    title: 'Private Sea Escapes',
    subtitle: 'Set sail on a journey defined by absolute privacy and bespoke service.',
    description:
      'From secluded Mediterranean coves to untouched Red Sea routes, our yacht charters combine refined hospitality, precise logistics, and complete discretion.',
    image: '/images/hurghada.jpg',
    price: '$12,500 / Day',
    tags: ['Luxury Charters', 'Private Chef', 'Hidden Bays'],
  },
  {
    title: 'Cultural Heritage',
    subtitle: 'Exclusive entry windows and expert-led storytelling at iconic sites.',
    description:
      'Designed for travelers who value depth without crowds, with seamless handling from VIP transfers to private fine dining transitions.',
    image: '/images/cairo.jpg',
    price: '$3,900 / Program',
    tags: ['Private Access', 'Expert Curator', 'Executive Logistics'],
  },
  {
    title: 'Luxury Family',
    subtitle: 'Thoughtfully paced programs balancing comfort, wonder, and privacy.',
    description:
      'From villa stays to marine adventures, each moment is curated to align with your family rhythm while preserving premium standards.',
    image: '/images/marsa-alam.jpg',
    price: '$6,400 / Program',
    tags: ['Bespoke Pacing', 'Private Stays', 'Concierge Support'],
  },
];

export default function FeaturedExperience() {
  const [activeCategory, setActiveCategory] = useState(0);
  const featured = featuredExperiences[activeCategory % featuredExperiences.length];

  return (
    <>
      <section
        id="experience-categories"
        className="border-y border-[var(--line-soft)] bg-[var(--experiences-section)]/85"
      >
        <div className="mx-auto max-w-7xl overflow-x-auto px-6">
          <div className="flex min-w-max items-center gap-3 py-5">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveCategory(index)}
                className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-all ${
                  activeCategory === index
                    ? 'border-primary/65 bg-primary/12 text-primary'
                    : 'border-transparent text-[var(--text-muted)] hover:border-[var(--line-soft)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="featured-experience"
        className="bg-[var(--experiences-section)] px-6 py-16 md:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
          <div
            id="gallery"
            className="relative overflow-hidden border border-[var(--line-soft)] bg-[var(--experiences-muted-card)]"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              width={1000}
              height={1200}
              className="h-[480px] w-full object-cover md:h-[640px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <div className="relative self-center">
            <span className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              <span className="h-px w-8 bg-primary/65" /> Featured Experience
            </span>
            <h2 className="text-4xl font-serif leading-[0.95] text-[var(--text-primary)] md:text-6xl">
              {featured.title}
            </h2>
            <p className="mt-5 text-lg text-[var(--text-secondary)]">{featured.subtitle}</p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
              {featured.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {featured.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--line-soft)] bg-[var(--experiences-muted-card)] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-4 border-t border-[var(--line-soft)] pt-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Starting From
                </p>
                <p className="mt-1 text-2xl font-serif text-primary">{featured.price}</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 border border-primary/65 bg-primary px-7 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-primary-gradient-end"
              >
                Inquire Now
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
