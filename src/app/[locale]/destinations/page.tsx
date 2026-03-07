import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import DestinationGroups from '@/components/destinations/DestinationGroups';

export const metadata: Metadata = {
  title: 'Destinations | AKAZA Travel',
  description: 'Explore luxury destinations across Egypt, Turkey, and beyond. Curated travel programs for the discerning traveler.',
};

export default async function DestinationsPage() {
  const t = await getTranslations('destinations');

  return (
    <>
      <Navbar />

      <main className="relative bg-[var(--surface-page)] overflow-hidden">
        <SubpageHero
          badge={t('superTitle')}
          title={t('title')}
          subtitle={t('subtitle')}
          imageSrc="https://as1.ftcdn.net/v2/jpg/02/72/23/66/1000_F_272236661_FpxJjrVwxYys822eNGYtPCrRuImDykZ4.jpg"
          imageAlt={t('heroAlt')}
          primaryCta={{ label: t('heroCta1'), href: '#destinations-grid' }}
          secondaryCta={{ label: t('heroCta2'), href: '/hotels/search' }}
        />

        <DestinationGroups />
      </main>

      <Footer />
    </>
  );
}
