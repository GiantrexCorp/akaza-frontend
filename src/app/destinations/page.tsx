import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHero from '@/components/SubpageHero';
import DestinationGroups from '@/components/destinations/DestinationGroups';

export const metadata: Metadata = {
  title: 'Destinations | AKAZA Travel',
  description: 'Explore luxury destinations across Egypt, Turkey, and beyond. Curated travel programs for the discerning traveler.',
};

export default function DestinationsPage() {
  return (
    <>
      <Navbar />

      <main className="relative bg-[var(--surface-page)] overflow-hidden">
        <SubpageHero
          badge="Luxury Experiences"
          title={
            <>
              Discover Our
              <br />
              Destinations
            </>
          }
          subtitle="Your journey, privately handled."
          imageSrc="https://as1.ftcdn.net/v2/jpg/02/72/23/66/1000_F_272236661_FpxJjrVwxYys822eNGYtPCrRuImDykZ4.jpg"
          imageAlt="AKAZA destination programs"
          primaryCta={{ label: 'Start Exploring', href: '#destinations-grid' }}
          secondaryCta={{ label: 'View All Offers', href: '/hotels/search' }}
        />

        <DestinationGroups />
      </main>

      <Footer />
    </>
  );
}
