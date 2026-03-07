import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | AKAZA Travel',
  description: 'AKAZA Travel privacy policy — how we collect, use, and protect your personal information.',
};

export default async function PrivacyPage() {
  const t = await getTranslations('legal');

  const sections = [
    { title: t('privacyS1Title'), content: t('privacyS1') },
    { title: t('privacyS2Title'), content: t('privacyS2') },
    { title: t('privacyS3Title'), content: t('privacyS3') },
    { title: t('privacyS4Title'), content: t('privacyS4') },
    { title: t('privacyS5Title'), content: t('privacyS5') },
    { title: t('privacyS6Title'), content: t('privacyS6') },
    { title: t('privacyS7Title'), content: t('privacyS7') },
    { title: t('privacyS8Title'), content: t('privacyS8') },
    { title: t('privacyS9Title'), content: t('privacyS9') },
  ];
  return (
    <>
      <Navbar />

      <section className="pt-32 pb-32 bg-[var(--surface-page)]">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans mb-3">{t('privacySuperTitle')}</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] leading-none mb-4">
            {t('privacyTitle')}
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
