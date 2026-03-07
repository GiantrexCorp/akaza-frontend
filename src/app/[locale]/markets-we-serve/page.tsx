import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import MarketsContent from '@/components/markets/MarketsContent';

export default async function MarketsWeServePage() {
  const t = await getTranslations('markets');
  return (
    <>
      <Navbar />

      <main className="bg-[var(--surface-page)] text-[var(--text-primary)]">
        <SubpageHero
          badge={t('superTitle')}
          title={t('title')}
          subtitle={t('subtitle')}
          imageSrc="/images/hero/hero-main.png"
          imageAlt={t('heroAlt')}
          primaryCta={{ label: t('heroCta1'), href: '#markets-globe' }}
          secondaryCta={{ label: t('heroCta2'), href: '/contact' }}
        />

        <MarketsContent />
      </main>

      <Footer />
    </>
  );
}
