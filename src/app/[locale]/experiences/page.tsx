import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import FeaturedExperience from '@/components/experiences/FeaturedExperience';
import AkazaStandard from '@/components/experiences/AkazaStandard';

export default async function ExperiencesPage() {
  const t = await getTranslations('experiences');

  return (
    <>
      <Navbar />

      <main className="relative bg-[var(--experiences-surface)] overflow-hidden text-[var(--text-primary)]">
        <SubpageHero
          badge={t('superTitle')}
          title={t('title')}
          subtitle={t('subtitle')}
          imageSrc="/images/hero/hero-main-v2.png"
          imageAlt={t('heroAlt')}
          primaryCta={{ label: t('heroCta1'), href: '#featured-experience' }}
          secondaryCta={{ label: t('heroCta2'), href: '#gallery' }}
        />

        <FeaturedExperience />
        <AkazaStandard />
      </main>

      <Footer />
    </>
  );
}
