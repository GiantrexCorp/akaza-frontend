import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import FeaturedExperience from '@/components/experiences/FeaturedExperience';
import AkazaStandard from '@/components/experiences/AkazaStandard';

export default function ExperiencesPage() {
  return (
    <>
      <Navbar />

      <main className="relative bg-[var(--experiences-surface)] overflow-hidden text-[var(--text-primary)]">
        <SubpageHero
          badge="Exclusivity Redefined"
          title={
            <>
              Unrivaled
              <br />
              Experiences
            </>
          }
          subtitle="Tailored for discerning travelers."
          imageSrc="/images/hero/hero-main-v2.png"
          imageAlt="AKAZA luxury experiences"
          primaryCta={{ label: 'Explore Now', href: '#featured-experience' }}
          secondaryCta={{ label: 'View Gallery', href: '#gallery' }}
        />

        <FeaturedExperience />
        <AkazaStandard />
      </main>

      <Footer />
    </>
  );
}
