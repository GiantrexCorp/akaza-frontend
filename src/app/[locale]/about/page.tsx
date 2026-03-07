import type { Metadata } from 'next';
import Image from 'next/image';
import { Award, Shield, Globe, Heart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About | AKAZA Travel',
  description: 'Learn about AKAZA Travel — luxury Egypt travel experiences, our values, and our commitment to exceptional journeys.',
};

export default async function AboutPage() {
  const t = await getTranslations('about');

  const values = [
    { icon: Award, title: t('excellence'), description: t('excellenceDesc') },
    { icon: Shield, title: t('trust'), description: t('trustDesc') },
    { icon: Globe, title: t('authenticity'), description: t('authenticityDesc') },
    { icon: Heart, title: t('passion'), description: t('passionDesc') },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans mb-3">{t('superTitle')}</p>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)] leading-none mb-6">
            {t('title')}
          </h1>
          <p className="text-lg text-[var(--text-muted)] font-sans font-light max-w-3xl leading-relaxed">
            {t('intro')}
          </p>
          <div className="mt-8 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      </section>

      {/* Story */}
      <section className="pb-20 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">{t('storyTitle')}</h2>
              <p className="text-[var(--text-secondary)] font-sans leading-relaxed mb-4">
                {t('storyP1')}
              </p>
              <p className="text-[var(--text-secondary)] font-sans leading-relaxed mb-4">
                {t('storyP2')}
              </p>
              <p className="text-[var(--text-secondary)] font-sans leading-relaxed">
                {t('storyP3')}
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
            <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-4">{t('valuesTitle')}</h2>
            <p className="text-2xl font-serif text-[var(--text-primary)] italic">{t('valuesSubtitle')}</p>
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
