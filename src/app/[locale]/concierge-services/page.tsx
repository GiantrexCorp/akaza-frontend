'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import SignaturePrograms from '@/components/concierge/SignaturePrograms';
import EssentialsGrid from '@/components/concierge/EssentialsGrid';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ConciergeServicesPage() {
  useScrollReveal({ threshold: 0.2 });
  const t = useTranslations('concierge');

  return (
    <>
      <Navbar />

      <main className="relative bg-[var(--surface-page)] overflow-hidden text-[var(--text-primary)]">
        <SubpageHero
          badge={t('superTitle')}
          title={t('title')}
          subtitle={t('subtitle')}
          imageSrc="/images/hero/hero-main-v2.png"
          imageAlt={t('heroAlt')}
          primaryCta={{ label: t('heroCta1'), href: '#signature-programs' }}
          secondaryCta={{ label: t('heroCta2'), href: '/contact' }}
        />

        <SignaturePrograms />
        <EssentialsGrid />

        <section className="bg-[var(--surface-page)] px-6 pb-24">
          <div
            data-reveal
            className="reveal-item mx-auto max-w-6xl border border-[var(--line-soft)] bg-[linear-gradient(120deg,rgba(185,117,50,0.18),rgba(16,33,39,0.5),rgba(185,117,50,0.16))] p-8 md:p-12 text-center"
          >
            <h3 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)]">{t('ctaTitle')}</h3>
            <p className="mt-4 max-w-2xl mx-auto text-[var(--text-secondary)]">
              {t('ctaDesc')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-primary/65 bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-primary-gradient-end transition-all"
              >
                {t('ctaCta1')}
              </Link>
              <Link
                href="/how-we-work"
                className="inline-flex items-center justify-center border border-[var(--line-strong)] bg-black/6 px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] hover:border-primary/55 hover:bg-primary/10 hover:text-primary transition-all"
              >
                {t('ctaCta2')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
