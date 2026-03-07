import Image from 'next/image';
import { Leaf, UtensilsCrossed, Plane, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LuxuryTrends() {
  const t = useTranslations('journal');

  const trendCards = [
    {
      icon: Plane,
      title: t('trend1Title'),
      body: t('trend1Desc'),
      image: '/images/vehicle-limousine.jpg',
    },
    {
      icon: Leaf,
      title: t('trend2Title'),
      body: t('trend2Desc'),
      image: '/images/hotel-steigenberger.jpg',
    },
    {
      icon: UtensilsCrossed,
      title: t('trend3Title'),
      body: t('trend3Desc'),
      image: '/images/hotel-four-seasons.jpg',
    },
    {
      icon: Sparkles,
      title: t('trend4Title'),
      body: t('trend4Desc'),
      image: '/images/marsa-alam.jpg',
    },
  ];
  return (
    <section className="bg-[var(--surface-page)] px-6 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[var(--line-soft)] pb-5">
          <h3 className="text-4xl md:text-5xl font-serif italic">{t('trendsTitle')}</h3>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {trendCards.map((trend) => {
            const Icon = trend.icon;
            return (
              <article
                key={trend.title}
                data-reveal
                className="reveal-item group flex gap-4 border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-4 transition-all duration-500 hover:border-primary/55 hover:-translate-y-0.5"
              >
                <div className="relative h-20 w-20 sm:h-18 sm:w-28 shrink-0 overflow-hidden border border-[var(--line-soft)]">
                  <Image
                    src={trend.image}
                    alt={trend.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div>
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/45 text-primary">
                    <Icon size={13} />
                  </div>
                  <h4 className="mt-2 text-2xl font-serif">{trend.title}</h4>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{trend.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
