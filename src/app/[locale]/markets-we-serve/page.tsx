import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import MarketsContent from '@/components/markets/MarketsContent';

export default function MarketsWeServePage() {
  return (
    <>
      <Navbar />

      <main className="bg-[var(--surface-page)] text-[var(--text-primary)]">
        <SubpageHero
          badge="Global Reach"
          title={
            <>
              Markets
              <br />
              We Serve
            </>
          }
          subtitle="Explore AKAZA's active corporate markets through an immersive global interface."
          imageSrc="/images/hero/hero-main.png"
          imageAlt="Global corporate market coverage"
          primaryCta={{ label: 'Explore Globe', href: '#markets-globe' }}
          secondaryCta={{ label: 'Partner With Us', href: '/contact' }}
        />

        <MarketsContent />
      </main>

      <Footer />
    </>
  );
}
