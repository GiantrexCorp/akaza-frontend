import { Mail, PhoneCall, Sparkles, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useTranslations } from 'next-intl';

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
];

export default function ContactInfo() {
  const t = useTranslations('contact');

  return (
    <aside data-reveal className="reveal-item space-y-7">
      <div className="border border-[var(--line-soft)] bg-[var(--surface-card)]/78 p-7 shadow-[0_24px_44px_-28px_rgba(0,0,0,0.72)]">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/45 bg-primary/10 text-primary">
          <Sparkles size={17} />
        </span>
        <h3 className="mt-5 text-4xl font-serif">{t('speakToAdvisor')}</h3>
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
          {t('advisorDesc')}
        </p>

        <a
          href="tel:+442012345678"
          className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary transition-colors hover:text-primary-gradient-end"
        >
          <PhoneCall size={15} />
          {t('advisorPhone')}
        </a>

        <a
          href="tel:+442012345678"
          className="mt-6 inline-flex h-11 w-full items-center justify-center border border-primary/55 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-white"
        >
          {t('scheduleCall')}
        </a>
      </div>

      <div className="border border-[var(--line-soft)] bg-[var(--surface-card)]/65 p-7">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{t('londonOffice')}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {t('londonAddress1')}
              <br />
              {t('londonAddress2')}
              <br />
              {t('londonAddress3')}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{t('dubaiOffice')}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {t('dubaiAddress1')}
              <br />
              {t('dubaiAddress2')}
              <br />
              {t('dubaiAddress3')}
            </p>
          </div>
        </div>

        <div className="mt-7 border-t border-[var(--line-soft)] pt-5">
          <a
            href="mailto:concierge@akazatravel.com"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-primary"
          >
            <Mail size={15} className="text-primary" />
            {t('emailDirect')}
          </a>

          <div className="mt-5 flex gap-2.5">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-soft)] text-[var(--text-muted)] transition-all hover:-translate-y-0.5 hover:border-primary/55 hover:text-primary"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
