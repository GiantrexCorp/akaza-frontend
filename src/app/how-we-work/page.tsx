'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ClipboardList, PenTool, BadgeCheck, Compass, Handshake } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';

type ProcessStep = {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Initial Consultation',
    description:
      'We begin with a focused discovery to understand your priorities, preferences, and non-negotiables. Every journey starts with clarity.',
    image: '/images/hotel-marriott.jpg',
    alt: 'Consultation over coffee',
    icon: ClipboardList,
  },
  {
    number: '02',
    title: 'Custom Design',
    description:
      'Our strategists build a tailored itinerary with curated routes, premium stays, private experiences, and seamless transitions.',
    image: '/images/map-egypt.jpg',
    alt: 'Handwritten planning notes',
    icon: PenTool,
  },
  {
    number: '03',
    title: 'Confirmation & Preparation',
    description:
      'Once approved, we finalize logistics, confirm vendors, and prepare every operational detail before your departure.',
    image: '/images/hotel-four-seasons.jpg',
    alt: 'Prepared travel documents',
    icon: BadgeCheck,
  },
  {
    number: '04',
    title: 'In-Trip Handling',
    description:
      'During the journey, our team remains on standby for proactive oversight, smooth adjustments, and concierge-level support.',
    image: '/images/vehicle-suv.jpg',
    alt: 'Vehicle ready for route support',
    icon: Compass,
  },
  {
    number: '05',
    title: 'Post-Travel Follow-Up',
    description:
      'We review your experience, capture insights, and prepare refined recommendations for your next chapter.',
    image: '/images/marsa-alam.jpg',
    alt: 'Post-journey review',
    icon: Handshake,
  },
];

export default function HowWeWorkPage() {
  return (
    <>
      <Navbar />

      <main className="relative bg-[var(--surface-page)] overflow-hidden text-[var(--text-primary)]">
        <SubpageHero
          badge="Signature Process"
          title={
            <>
              The Akaza
              <br />
              Process
            </>
          }
          subtitle="Crafted with precision, delivered with discretion."
          imageSrc="/images/hero/hero-main.png"
          imageAlt="The AKAZA process in action"
          primaryCta={{ label: 'Discover the Method', href: '#process-steps' }}
        />

        <section id="process-steps" className="bg-[var(--surface-section)] px-6 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <span className="inline-flex items-center rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-[10px] uppercase tracking-[0.24em] font-semibold text-primary">
              Our Method
            </span>
            <h2 className="mt-6 max-w-4xl text-4xl md:text-6xl font-serif leading-tight text-[var(--text-primary)]">
              A Signature Five-Step Approach to
              <span className="italic text-primary"> Global Exploration</span>
            </h2>

            <div className="mt-10">
              <div className="relative space-y-14 md:space-y-18">
                <span className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/35 to-transparent lg:block" />
                {steps.map((step, index) => {
                  const reverse = index % 2 === 1;
                  const StepIcon = step.icon;
                  return (
                    <article
                      id={`step-${step.number}`}
                      key={step.number}
                      className="group/step grid gap-6 scroll-mt-36 lg:grid-cols-[1fr_56px_1fr] lg:gap-8 lg:items-center"
                    >
                      {reverse ? (
                        <>
                          <div className="relative overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--surface-card)] shadow-[0_20px_45px_-30px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover/step:-translate-y-1 group-hover/step:border-primary/45 group-hover/step:shadow-[0_28px_50px_-28px_rgba(185,117,50,0.85)]">
                            <Image
                              src={step.image}
                              alt={step.alt}
                              width={920}
                              height={620}
                              className="h-[250px] w-full object-cover transition-transform duration-700 group-hover/step:scale-105 md:h-[320px]"
                            />
                            <span className="pointer-events-none absolute inset-y-0 -left-[50%] w-1/3 rotate-[14deg] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover/step:left-[125%] group-hover/step:opacity-80" />
                          </div>

                          <div className="hidden lg:flex justify-center">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/55 bg-primary text-white shadow-[0_10px_24px_-12px_rgba(185,117,50,0.85)] transition-all duration-300 group-hover/step:scale-110 group-hover/step:shadow-[0_14px_26px_-12px_rgba(185,117,50,0.95)]">
                              <StepIcon size={14} />
                            </span>
                          </div>

                          <div className="lg:pr-8">
                            <span className="text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                              {step.number}
                            </span>
                            <h3 className="mt-3 text-3xl font-serif text-[var(--text-primary)]">
                              {step.title}
                            </h3>
                            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--text-muted)]">
                              {step.description}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="lg:pl-8 lg:text-right">
                            <span className="text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                              {step.number}
                            </span>
                            <h3 className="mt-3 text-3xl font-serif text-[var(--text-primary)]">
                              {step.title}
                            </h3>
                            <p className="mt-4 ml-auto max-w-xl text-[15px] leading-relaxed text-[var(--text-muted)]">
                              {step.description}
                            </p>
                          </div>

                          <div className="hidden lg:flex justify-center">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/55 bg-primary text-white shadow-[0_10px_24px_-12px_rgba(185,117,50,0.85)] transition-all duration-300 group-hover/step:scale-110 group-hover/step:shadow-[0_14px_26px_-12px_rgba(185,117,50,0.95)]">
                              <StepIcon size={14} />
                            </span>
                          </div>

                          <div className="relative overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--surface-card)] shadow-[0_20px_45px_-30px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover/step:-translate-y-1 group-hover/step:border-primary/45 group-hover/step:shadow-[0_28px_50px_-28px_rgba(185,117,50,0.85)]">
                            <Image
                              src={step.image}
                              alt={step.alt}
                              width={920}
                              height={620}
                              className="h-[250px] w-full object-cover transition-transform duration-700 group-hover/step:scale-105 md:h-[320px]"
                            />
                            <span className="pointer-events-none absolute inset-y-0 -left-[50%] w-1/3 rotate-[14deg] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover/step:left-[125%] group-hover/step:opacity-80" />
                          </div>
                        </>
                      )}

                      <div className="lg:hidden">
                        <div className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/45 text-primary">
                          <StepIcon size={14} />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--surface-section)] px-6 pb-22">
          <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-card)] p-8 md:p-12 text-center">
            <h3 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)]">
              Ready For Your Next Chapter?
            </h3>
            <p className="mt-4 text-[var(--text-muted)] max-w-2xl mx-auto">
              Share your destination goals and preferences. We will craft your journey
              blueprint with concierge-level precision.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-primary/60 bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-primary-gradient-end transition-all"
              >
                Begin Your Journey
              </Link>
              <Link
                href="/experiences"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--line-strong)] px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] hover:border-primary/55 hover:text-primary transition-all"
              >
                View Experiences
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
