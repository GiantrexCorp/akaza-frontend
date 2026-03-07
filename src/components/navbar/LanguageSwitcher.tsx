'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/config';
import { profileApi } from '@/lib/api/profile';

const labels: Record<Locale, string> = { en: 'EN', de: 'DE', fr: 'FR' };

interface LanguageSwitcherProps {
  isLight: boolean;
  mobile?: boolean;
}

export default function LanguageSwitcher({ isLight, mobile }: LanguageSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (locale: Locale) => {
    if (locale === currentLocale) return;
    localStorage.setItem('locale', locale);
    router.replace(pathname, { locale });

    if (localStorage.getItem('auth_token')) {
      profileApi.update({ locale }).catch(() => {});
    }
  };

  if (mobile) {
    return (
      <div className="flex gap-2">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleChange(locale)}
            className={`flex-1 border border-[var(--line-soft)] px-3 py-2 text-xs uppercase tracking-widest font-semibold transition-colors ${
              locale === currentLocale
                ? 'bg-primary/15 text-primary border-primary/40'
                : isLight
                  ? 'text-[var(--text-secondary)] bg-white/80 hover:text-primary hover:border-primary/30'
                  : 'text-[var(--text-secondary)] bg-black/15 hover:text-primary hover:border-primary/30'
            }`}
            type="button"
          >
            {labels[locale]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex items-center">
      <div className={`flex items-center border border-[var(--line-soft)] overflow-hidden ${
        isLight ? 'bg-white/70' : 'bg-black/15'
      }`}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleChange(locale)}
            className={`px-2.5 py-2 text-[10px] uppercase tracking-[0.15em] font-semibold transition-colors ${
              locale === currentLocale
                ? 'bg-primary/15 text-primary'
                : isLight
                  ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--nav-user-hover-text)] hover:bg-white/[0.06]'
            }`}
            type="button"
          >
            {labels[locale]}
          </button>
        ))}
      </div>
    </div>
  );
}
