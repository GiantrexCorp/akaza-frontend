'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import DmcMetrics from '@/components/corporate/DmcMetrics';
import SupportPillars from '@/components/corporate/SupportPillars';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function CorporatePartnershipsPage() {
  useScrollReveal();
  const t = useTranslations('corporate');
  const common = useTranslations('common');

  const whiteLabelCards = [
    {
      title: t('brandIntegration'),
      body: t('brandIntegrationDesc'),
      image: '/images/logos/logotype-light.png',
      alt: t('brandAlt'),
    },
    {
      title: t('seamlessExecution'),
      body: t('seamlessExecutionDesc'),
      image: '/images/vehicle-van.jpg',
      alt: t('seamlessAlt'),
    },
    {
      title: t('globalNetwork'),
      body: t('globalNetworkDesc'),
      image: '/images/hero/hero-main.png',
      alt: t('globalAlt'),
    },
  ];

  return (
    <>
      <Navbar />

      <main className="bg-[var(--surface-page)] text-[var(--text-primary)]">
        <SubpageHero
          badge={t('superTitle')}
          title={t('title')}
          subtitle={t('subtitle')}
          imageSrc="/images/vehicle-limousine.jpg"
          imageAlt={t('heroAlt')}
          primaryCta={{ label: t('heroCta1'), href: '/contact' }}
          secondaryCta={{ label: t('heroCta2'), href: '#portfolio' }}
        />

        <section id="portfolio" className="bg-[var(--surface-section)] px-6 py-16 md:py-22">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)]">
              {t('solutionsTitle')}
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
                <h3 className="text-3xl font-serif text-[var(--text-primary)]">{t('executiveTitle')}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                  {t('executiveDesc')}
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    t('executiveF1'),
                    t('executiveF2'),
                    t('executiveF3'),
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
                  {common('learnMore')}
                  <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-[var(--surface-page)] px-6 py-16 md:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h3 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)]">{t('whiteLabelTitle')}</h3>
              <p className="mt-4 text-[var(--text-muted)]">
                {t('whiteLabelDesc')}
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

        <DmcMetrics />
        <SupportPillars />

        <section className="bg-primary px-6 py-14 md:py-18">
          <div className="mx-auto max-w-5xl text-center">
            <h3 className="text-4xl md:text-6xl font-serif text-white">{t('ctaTitle')}</h3>
            <p className="mt-4 text-white/90">
              {t('ctaDesc')}
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center justify-center border border-black/35 bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all hover:bg-black/80"
            >
              {t('ctaCta')}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
