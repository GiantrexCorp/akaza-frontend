'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ContactPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      <main className="bg-[var(--surface-page)] text-[var(--text-primary)]">
        <section className="mt-24">
          <article className="group relative h-[68vh] min-h-[540px] overflow-hidden border-y border-[var(--line-soft)]">
            <Image
              src="/images/hotel-four-seasons.jpg"
              alt="Private concierge ambiance"
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[var(--hero-overlay-start)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-[var(--surface-section)]" />

            <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
              <span className="rounded-full border border-primary/40 bg-primary/12 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Your Private Concierge
              </span>
              <h1 className="mt-6 text-3xl sm:text-5xl font-serif leading-[0.92] text-white md:text-7xl">Start Your Journey</h1>
              <p className="mt-5 max-w-3xl text-base sm:text-lg text-slate-200/90 md:text-2xl">
                Bespoke experiences tailored to the world&apos;s most discerning travelers. Tell us your vision, and we
                will curate the reality.
              </p>
            </div>
          </article>
        </section>

        <section className="relative overflow-hidden bg-[var(--surface-section)] px-6 py-16 md:py-22">
          <span className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary/12 blur-[96px]" />
          <span className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-[var(--color-accent)]/12 blur-[96px]" />

          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <ContactForm />
            <ContactInfo />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
