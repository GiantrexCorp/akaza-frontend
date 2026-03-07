import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function TravelInsights() {
  const t = useTranslations('journal');
  const common = useTranslations('common');

  const insightHighlights = [
    {
      category: t('insight2Tag'),
      title: t('insight2Title'),
      body: t('insight2Desc'),
    },
    {
      category: t('insight3Tag'),
      title: t('insight3Title'),
      body: t('insight3Desc'),
    },
  ];
  return (
    <section id="travel-insights" className="bg-[var(--surface-section)] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--line-soft)] pb-5">
          <h2 className="text-4xl md:text-5xl font-serif italic">{t('insightsTitle')}</h2>
          <Link
            href="#"
            className="text-[11px] uppercase tracking-[0.2em] font-semibold text-primary hover:text-primary-gradient-end transition-colors"
          >
            {t('viewArchive')}
          </Link>
        </div>

        <div className="mt-9 grid gap-7 lg:grid-cols-[1.05fr_0.95fr]">
          <article
            data-reveal
            className="reveal-item group overflow-hidden border border-[var(--line-soft)] bg-[var(--surface-card)]/45 transition-all duration-500 hover:border-primary/55 hover:shadow-[0_24px_48px_-28px_rgba(185,117,50,0.8)]"
          >
            <div className="relative overflow-hidden">
              <Image
                src="/images/hotel-marriott.jpg"
                alt="The Philosophy of Wandering"
                width={1200}
                height={760}
                className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{t('insight1Tag')}</p>
              <h3 className="mt-3 text-4xl font-serif">{t('insight1Title')}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                {t('insight1Desc')}
              </p>
              <Link
                href="#"
                className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-primary hover:text-primary-gradient-end transition-colors"
              >
                {common('readMore')}
                <ArrowRight size={13} />
              </Link>
            </div>
          </article>

          <div className="space-y-5">
            {insightHighlights.map((item) => (
              <article
                key={item.title}
                data-reveal
                className="reveal-item border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/45"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{item.category}</p>
                <h4 className="mt-2 text-3xl font-serif">{item.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{item.body}</p>
                <Link
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--text-secondary)] hover:text-primary transition-colors"
                >
                  {t('insight3Read')}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
