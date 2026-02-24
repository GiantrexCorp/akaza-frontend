'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Car, Plane, Ticket } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';

const signaturePrograms = [
  {
    eyebrow: 'Bespoke Celebrations',
    title: 'Special Occasions',
    body: 'From private anniversaries to destination milestones, we craft moments that feel deeply personal and flawlessly executed.',
    bullets: [
      'Tailored event design and production',
      'Access to private venues and invitation-only spaces',
    ],
    cta: 'Inquire Now',
    href: '/contact',
    image: '/images/hotel-four-seasons.jpg',
    alt: 'Luxury celebration setup',
  },
  {
    eyebrow: 'Oceanic Freedom',
    title: 'Yacht Charters',
    body: 'Navigate iconic coastlines aboard curated vessels with private crew, refined onboard hospitality, and complete itinerary control.',
    bullets: ['Private fleet access', 'Chef-led dining experiences'],
    cta: 'View Fleet',
    href: '/contact',
    image: '/images/hurghada.jpg',
    alt: 'Luxury yacht on open water',
  },
];

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

export default function ConciergeServicesPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      <main className="relative bg-[var(--surface-page)] overflow-hidden text-[var(--text-primary)]">
        <SubpageHero
          badge="Concierge Services"
          title={
            <>
              Refined
              <br />
              By Design
            </>
          }
          subtitle="Meticulous service architecture for journeys that demand precision."
          imageSrc="/images/hero/hero-main-v2.png"
          imageAlt="Concierge services overview"
          primaryCta={{ label: 'Explore Services', href: '#signature-programs' }}
          secondaryCta={{ label: 'Contact Team', href: '/contact' }}
        />

        <section id="signature-programs" className="bg-[var(--surface-section)] px-6 py-16 md:py-24">
          <div className="mx-auto max-w-7xl space-y-14">
            {signaturePrograms.map((program, index) => {
              const reverse = index % 2 === 1;
              return (
                <article
                  key={program.title}
                  data-reveal
                  className={`reveal-item group grid gap-8 border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-6 md:p-8 lg:grid-cols-2 lg:items-center ${
                    reverse ? 'lg:[&>div:first-child]:order-2' : ''
                  }`}
                >
                  <div className="relative overflow-hidden border border-[var(--line-soft)]">
                    <Image
                      src={program.image}
                      alt={program.alt}
                      width={1080}
                      height={720}
                      className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[420px]"
                    />
                    <span className="pointer-events-none absolute inset-y-0 -left-[45%] w-1/3 rotate-[12deg] bg-gradient-to-r from-transparent via-white/28 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-70" />
                  </div>

                  <div className="lg:px-4">
                    <span className="text-primary text-[11px] uppercase tracking-[0.22em] font-semibold">
                      {program.eyebrow}
                    </span>
                    <h2 className="mt-2 text-4xl md:text-5xl font-serif text-[var(--text-primary)]">
                      {program.title}
                    </h2>
                    <p className="mt-5 text-[15px] leading-relaxed text-[var(--text-muted)] max-w-xl">
                      {program.body}
                    </p>
                    <ul className="mt-6 space-y-2">
                      {program.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-[13px] text-[var(--text-secondary)] flex items-start gap-2"
                        >
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/85" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={program.href}
                      className="mt-7 inline-flex items-center justify-center border border-primary/60 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-primary-gradient-end hover:-translate-y-0.5"
                    >
                      {program.cta}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

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

        <section className="bg-[var(--surface-page)] px-6 pb-24">
          <div
            data-reveal
            className="reveal-item mx-auto max-w-6xl border border-[var(--line-soft)] bg-[linear-gradient(120deg,rgba(185,117,50,0.18),rgba(16,33,39,0.5),rgba(185,117,50,0.16))] p-8 md:p-12 text-center"
          >
            <h3 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)]">Ready to Refine Your Next Journey?</h3>
            <p className="mt-4 max-w-2xl mx-auto text-[var(--text-secondary)]">
              Our concierge specialists are ready to architect your itinerary with
              private handling, elevated access, and operational certainty.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-primary/65 bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-primary-gradient-end transition-all"
              >
                Inquire Now
              </Link>
              <Link
                href="/how-we-work"
                className="inline-flex items-center justify-center border border-[var(--line-strong)] bg-black/6 px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] hover:border-primary/55 hover:bg-primary/10 hover:text-primary transition-all"
              >
                How We Work
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
