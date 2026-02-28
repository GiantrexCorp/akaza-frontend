import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import ProcessTimeline from '@/components/how-we-work/ProcessTimeline';

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

        <ProcessTimeline />

        <section className="bg-[var(--surface-section)] px-6 pb-22">
          <div className="mx-auto max-w-4xl border border-[var(--line-soft)] bg-[var(--surface-card)] p-8 md:p-12 text-center">
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
                className="inline-flex items-center justify-center border border-primary/60 bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-primary-gradient-end transition-all"
              >
                Begin Your Journey
              </Link>
              <Link
                href="/experiences"
                className="inline-flex items-center justify-center border border-[var(--line-strong)] px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] hover:border-primary/55 hover:text-primary transition-all"
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
