'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import TravelInsights from '@/components/journal/TravelInsights';
import NewsletterSignup from '@/components/journal/NewsletterSignup';
import DestinationGuides from '@/components/journal/DestinationGuides';
import LuxuryTrends from '@/components/journal/LuxuryTrends';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function JournalPage() {
  useScrollReveal({ rootMargin: '0px 0px -12% 0px' });

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

        <TravelInsights />
        <NewsletterSignup />
        <DestinationGuides />
        <LuxuryTrends />

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
