'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  ShieldCheck,
  ReceiptText,
  Globe2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';

type Metric = {
  key: string;
  target: number;
  suffix: string;
  label: string;
};

const metrics: Metric[] = [
  { key: 'global_hubs', target: 50, suffix: '+', label: 'Global Hubs' },
  { key: 'local_experts', target: 1500, suffix: '+', label: 'Local Experts' },
];

const whiteLabelCards = [
  {
    title: 'Brand Integration',
    body: 'Client-facing touchpoints are delivered under your identity with consistent brand standards.',
    image: '/images/logos/logotype-light.png',
    alt: 'White label brand manual',
  },
  {
    title: 'Seamless Execution',
    body: 'From booking to concierge handling, every movement is coordinated under one operational framework.',
    image: '/images/vehicle-van.jpg',
    alt: 'Concierge operations in action',
  },
  {
    title: 'Global Network',
    body: 'Leverage pre-vetted partners and destination capabilities for executive-level travel outcomes.',
    image: '/images/hero/hero-main.png',
    alt: 'Aircraft over global route',
  },
];

const supportPillars = [
  {
    icon: Headphones,
    title: '24/7 Hotline',
    body: 'Instant access to senior logistics teams any hour, globally.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk Management',
    body: 'Proactive traveler safety protocols and contingency controls.',
  },
  {
    icon: ReceiptText,
    title: 'Centralized Billing',
    body: 'Consolidated reporting and corporate-grade invoicing workflows.',
  },
  {
    icon: Globe2,
    title: 'Local Liaison',
    body: 'Trusted in-market representation across priority destinations.',
  },
];

export default function CorporatePartnershipsPage() {
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(metrics.map((m) => [m.key, 0]))
  );
  const [hasAnimatedCounts, setHasAnimatedCounts] = useState(false);
  const metricsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'));
    revealNodes.forEach((node) => revealObserver.observe(node));

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const node = metricsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasAnimatedCounts) return;
        setHasAnimatedCounts(true);

        const start = performance.now();
        const duration = 1200;

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          const nextCounts = Object.fromEntries(
            metrics.map((metric) => [metric.key, Math.floor(metric.target * eased)])
          );
          setCounts(nextCounts);

          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimatedCounts]);

  return (
    <>
      <Navbar />

      <main className="bg-[var(--surface-page)] text-[var(--text-primary)]">
        <SubpageHero
          badge="B2B Excellence"
          title={
            <>
              Corporate &
              <br />
              Partnerships
            </>
          }
          subtitle="Elevating business travel through bespoke management and global operational excellence."
          imageSrc="/images/vehicle-limousine.jpg"
          imageAlt="Corporate partnership premium travel"
          primaryCta={{ label: 'Inquire Now', href: '/contact' }}
          secondaryCta={{ label: 'View Portfolio', href: '#portfolio' }}
        />

        <section id="portfolio" className="bg-[var(--surface-section)] px-6 py-16 md:py-22">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)]">
              Corporate Travel Solutions
            </h2>
            <div className="mt-8 h-px w-36 bg-gradient-to-r from-primary via-primary/40 to-transparent" />

            <article
              data-reveal
              className="reveal-item mt-10 grid overflow-hidden border border-[var(--line-soft)] bg-[var(--surface-card)] shadow-[0_28px_54px_-34px_rgba(0,0,0,0.8)] md:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="relative overflow-hidden">
                <Image
                  src="/images/hotel-four-seasons.jpg"
                  alt="Executive management meeting space"
                  width={1200}
                  height={800}
                  className="h-[340px] w-full object-cover transition-transform duration-700 hover:scale-105 md:h-full"
                />
              </div>
              <div className="p-7 md:p-9">
                <h3 className="text-3xl font-serif text-[var(--text-primary)]">Bespoke Executive Management</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                  Tailored business mobility programs designed for consistency, speed,
                  and executive comfort across every route.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Global access to private aviation and luxury chauffeuring',
                    'Priority bookings in premium business-class properties',
                    'Dedicated multi-lingual account management',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <CheckCircle2 size={15} className="mt-0.5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:text-primary-gradient-end"
                >
                  Learn More
                  <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-[var(--surface-page)] px-6 py-16 md:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h3 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)]">White-Label Fulfillment</h3>
              <p className="mt-4 text-[var(--text-muted)]">
                Deliver seamless branded travel experiences under your company identity,
                powered by AKAZA’s private infrastructure.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {whiteLabelCards.map((card) => (
                <article
                  key={card.title}
                  data-reveal
                  className="reveal-item group border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_24px_45px_-28px_rgba(185,117,50,0.8)]"
                >
                  <div className="relative overflow-hidden border border-[var(--line-soft)]">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      width={760}
                      height={460}
                      className="h-[150px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="mt-4 text-xl font-serif text-[var(--text-primary)]">{card.title}</h4>
                  <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--surface-section)] px-6 py-16 md:py-22" ref={metricsRef}>
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div data-reveal className="reveal-item">
              <span className="text-primary text-[11px] uppercase tracking-[0.22em] font-semibold">
                DMC Collaborations
              </span>
              <h3 className="mt-3 text-4xl md:text-6xl font-serif text-[var(--text-primary)]">
                Local Soul,
                <br />
                <span className="italic text-primary">Global Standard</span>
              </h3>
              <p className="mt-5 max-w-xl text-sm text-[var(--text-muted)] leading-relaxed">
                As a premium destination management partner, we blend global operational
                control with deep local intelligence for exceptional outcomes.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3 max-w-sm">
                {metrics.map((metric) => (
                  <div
                    key={metric.key}
                    className="border border-[var(--line-soft)] bg-[var(--surface-card)]/55 px-4 py-4"
                  >
                    <p className="text-3xl font-serif text-primary">
                      {counts[metric.key]}
                      {metric.suffix}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/destinations"
                className="mt-7 inline-flex items-center justify-center border border-primary/60 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-primary-gradient-end hover:-translate-y-0.5"
              >
                Explore Destinations
              </Link>
            </div>

            <div data-reveal className="reveal-item relative overflow-hidden border border-[var(--line-soft)]">
              <Image
                src="/images/hotel-steigenberger.jpg"
                alt="Luxury destination collaboration"
                width={1200}
                height={860}
                className="h-[360px] w-full object-cover md:h-[460px]"
              />
            </div>
          </div>
        </section>

        <section className="bg-[var(--surface-page)] px-6 py-16 md:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h3 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)]">
                Concierge-Level Operational Support
              </h3>
              <p className="mt-3 text-[var(--text-muted)] max-w-3xl mx-auto">
                Reliability is core to our standard. Every route and workflow is managed to
                safeguard partner expectations and traveler confidence.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {supportPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article
                    key={pillar.title}
                    data-reveal
                    className="reveal-item border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-5 transition-all duration-500 hover:border-primary/55 hover:-translate-y-1"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/45 text-primary">
                      <Icon size={16} />
                    </div>
                    <h4 className="mt-4 text-2xl font-serif text-[var(--text-primary)]">{pillar.title}</h4>
                    <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">{pillar.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-primary px-6 py-14 md:py-18">
          <div className="mx-auto max-w-5xl text-center">
            <h3 className="text-4xl md:text-6xl font-serif text-white">Ready to Elevate Corporate Travel Standards?</h3>
            <p className="mt-4 text-white/90">
              Connect with our partnership division to build tailored travel infrastructure for your teams.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center justify-center border border-black/35 bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all hover:bg-black/80"
            >
              Request a Proposal
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
