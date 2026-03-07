'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/config';
import { profileApi } from '@/lib/api/profile';
import { ChevronDown } from 'lucide-react';

function FlagGB({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 302 82 480H0v-60l239-178L0 64V0z"/>
      <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
    </svg>
  );
}

function FlagDE({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFCE00" d="M0 320h640v160H0z"/>
      <path fill="#000" d="M0 0h640v160H0z"/>
      <path fill="#DD0000" d="M0 160h640v160H0z"/>
    </svg>
  );
}

function FlagFR({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#002395" d="M0 0h213.3v480H0z"/>
      <path fill="#FFF" d="M213.3 0h213.4v480H213.3z"/>
      <path fill="#ED2939" d="M426.7 0H640v480H426.7z"/>
    </svg>
  );
}

const FlagIcon: Record<Locale, React.FC<{ className?: string }>> = {
  en: FlagGB,
  de: FlagDE,
  fr: FlagFR,
};

const labels: Record<Locale, string> = { en: 'English', de: 'Deutsch', fr: 'Français' };
const shortLabels: Record<Locale, string> = { en: 'EN', de: 'DE', fr: 'FR' };

interface LanguageSwitcherProps {
  isLight: boolean;
  mobile?: boolean;
}

export default function LanguageSwitcher({ isLight, mobile }: LanguageSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (locale: Locale) => {
    if (locale === currentLocale) {
      setOpen(false);
      return;
    }
    localStorage.setItem('locale', locale);
    router.replace(pathname, { locale });
    setOpen(false);

    if (localStorage.getItem('auth_token')) {
      profileApi.update({ locale }).catch(() => {});
    }
  };

  if (mobile) {
    return (
      <div className="flex gap-2">
        {locales.map((locale) => {
          const Flag = FlagIcon[locale];
          return (
            <button
              key={locale}
              onClick={() => handleChange(locale)}
              className={`flex-1 flex items-center justify-center gap-1.5 border border-[var(--line-soft)] px-3 py-2 text-xs font-semibold transition-colors ${
                locale === currentLocale
                  ? 'bg-primary/15 text-primary border-primary/40'
                  : isLight
                    ? 'text-[var(--text-secondary)] bg-white/80 hover:text-primary hover:border-primary/30'
                    : 'text-[var(--text-secondary)] bg-black/15 hover:text-primary hover:border-primary/30'
              }`}
              type="button"
            >
              <Flag className="w-4 h-3 shrink-0" />
              {shortLabels[locale]}
            </button>
          );
        })}
      </div>
    );
  }

  const CurrentFlag = FlagIcon[currentLocale];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 border border-[var(--line-soft)] px-2.5 py-2 transition-colors ${
          isLight
            ? 'bg-white/70 text-[var(--text-secondary)] hover:border-primary/40 hover:text-[var(--text-primary)]'
            : 'bg-black/15 text-[var(--text-secondary)] hover:border-primary/40 hover:text-[var(--nav-user-hover-text)]'
        } ${open ? 'border-primary/40' : ''}`}
      >
        <CurrentFlag className="w-4 h-3 shrink-0" />
        <span className="text-[10px] uppercase tracking-[0.15em] font-semibold">{shortLabels[currentLocale]}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-1.5 min-w-[160px] border border-[var(--line-soft)] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.65)] z-50 overflow-hidden ${
          isLight ? 'bg-white' : 'bg-[var(--surface-card)]'
        }`}>
          {locales.map((locale) => {
            const Flag = FlagIcon[locale];
            return (
              <button
                key={locale}
                type="button"
                onClick={() => handleChange(locale)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  locale === currentLocale
                    ? 'bg-primary/10 text-primary'
                    : isLight
                      ? 'text-[var(--text-secondary)] hover:bg-black/[0.04] hover:text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-white/[0.06] hover:text-[var(--nav-user-hover-text)]'
                }`}
              >
                <Flag className="w-5 h-3.5 shrink-0" />
                <span className="text-xs font-semibold">{labels[locale]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
