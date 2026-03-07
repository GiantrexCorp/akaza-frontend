import { Phone, Mail } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function OfficeSection() {
  const t = await getTranslations('home');
  return (
    <section className="h-[450px] w-full relative">
      <div className="absolute inset-0 bg-[var(--map-overlay)] z-10 pointer-events-none" />
      <Image
        alt={t('officeAltMap')}
        src="/images/map-egypt.jpg"
        fill
        sizes="100vw"
        className="object-cover opacity-80"
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-[var(--surface-card)]/95 backdrop-blur-xl border border-[var(--line-soft)] p-12 text-center shadow-2xl max-w-md w-full mx-4">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-6">
            <Image
              src="/images/logos/brandmark-dark.png"
              alt={t('officeAltBrand')}
              width={64}
              height={64}
              className="h-auto w-12 mb-3 theme-dark-only"
            />
            <Image
              src="/images/logos/logotype-dark.png"
              alt={t('officeBrand')}
              width={180}
              height={46}
              className="h-auto w-[120px] theme-dark-only"
            />
            <Image
              src="/images/logos/brandmark-light.png"
              alt={t('officeAltBrand')}
              width={64}
              height={64}
              className="h-auto w-12 mb-3 theme-light-only"
            />
            <Image
              src="/images/logos/logotype-light.png"
              alt={t('officeBrand')}
              width={180}
              height={46}
              className="h-auto w-[120px] theme-light-only"
            />
          </div>

          <h5 className="text-[var(--text-primary)] text-xl font-serif mb-2 italic">{t('officeTitle')}</h5>
          <p className="text-[var(--text-muted)] text-sm font-medium mb-8 uppercase tracking-wider font-sans">
            {t('officeSubtitle')}
          </p>

          <div className="space-y-3 text-[var(--text-secondary)] font-light font-sans">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Phone size={12} className="text-primary" />
              {t('officePhone')}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Mail size={12} className="text-primary" />
              {t('officeEmail')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
