import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | AKAZA Travel',
  description: 'AKAZA Travel terms of service — the terms and conditions governing your use of our platform.',
};

export default async function TermsPage() {
  const t = await getTranslations('legal');

  const sections = [
    { title: t('termsS1Title'), content: t('termsS1') },
    { title: t('termsS2Title'), content: t('termsS2') },
    { title: t('termsS3Title'), content: t('termsS3') },
    { title: t('termsS4Title'), content: t('termsS4') },
    { title: t('termsS5Title'), content: t('termsS5') },
    { title: t('termsS6Title'), content: t('termsS6') },
    { title: t('termsS7Title'), content: t('termsS7') },
    { title: t('termsS8Title'), content: t('termsS8') },
  ];
  return (
    <>
      <Navbar />

      <section className="pt-32 pb-32 bg-[var(--surface-page)]">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans mb-3">{t('termsSuperTitle')}</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] leading-none mb-4">
            {t('termsTitle')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mb-2">{t('lastUpdated')}</p>
          <div className="mt-6 mb-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={section.title}>
                <h2 className="text-lg font-serif text-[var(--text-primary)] mb-3">{i + 1}. {section.title}</h2>
                <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
