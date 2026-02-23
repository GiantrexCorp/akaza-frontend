import Image from 'next/image';
import { Award, Shield, Globe, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const values = [
  { icon: Award, title: 'Excellence', description: 'We curate only the finest experiences across Egypt, ensuring every journey meets the highest standards of quality and sophistication.' },
  { icon: Shield, title: 'Trust', description: 'Your safety and satisfaction are our priority. We partner with licensed operators and maintain rigorous quality standards.' },
  { icon: Globe, title: 'Authenticity', description: 'We connect you with the true spirit of Egypt — its people, history, and culture — through carefully crafted experiences.' },
  { icon: Heart, title: 'Passion', description: 'Our team lives and breathes Egyptian hospitality. Every itinerary reflects our deep love for this extraordinary land.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans mb-3">About Us</p>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)] leading-none mb-6">
            Redefining <span className="italic">Luxury Travel</span> in Egypt
          </h1>
          <p className="text-lg text-[var(--text-muted)] font-sans font-light max-w-3xl leading-relaxed">
            AKAZA Travel is a premium travel company specializing in bespoke Egyptian experiences.
            From the ancient temples of Luxor to the pristine shores of the Red Sea, we craft
            journeys that transcend the ordinary.
          </p>
          <div className="mt-8 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      </section>

      {/* Story */}
      <section className="pb-20 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Our Story</h2>
              <p className="text-[var(--text-secondary)] font-sans leading-relaxed mb-4">
                Founded with a vision to showcase Egypt&apos;s timeless beauty to discerning travelers,
                AKAZA Travel has grown into one of the region&apos;s most trusted luxury travel providers.
              </p>
              <p className="text-[var(--text-secondary)] font-sans leading-relaxed mb-4">
                Our name, AKAZA, draws inspiration from the rich tapestry of Egyptian heritage —
                a symbol of the extraordinary experiences that await those who journey with us.
              </p>
              <p className="text-[var(--text-secondary)] font-sans leading-relaxed">
                Every trip we design is a masterpiece of personalization, combining world-class
                accommodations, expert guides, and exclusive access to create memories that last a lifetime.
              </p>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-bg-darker" />
              <div className="absolute inset-4 border-2 border-primary/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-32 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-4">Our Values</h2>
            <p className="text-2xl font-serif text-[var(--text-primary)] italic">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6 group hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-serif text-[var(--text-primary)] mb-2">{value.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
