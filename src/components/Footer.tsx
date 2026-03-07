"use client";

import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  Instagram,
  Linkedin,
  type LucideIcon,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { Link } from '@/i18n/navigation';

type NavLink = {
  label: string;
  href: string;
};

type SocialLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const common = useTranslations('common');
  const currentYear = new Date().getFullYear();

  const siteLinks: NavLink[] = [
    { label: nav('destinations'), href: "/destinations" },
    { label: nav('tours'), href: "/tours" },
    { label: nav('experiences'), href: "/experiences" },
    { label: nav('transfers'), href: "/transfers" },
    { label: t('marketsWeServe'), href: "/markets-we-serve" },
    { label: t('journal'), href: "/journal" },
  ];

  const serviceLinks: NavLink[] = [
    { label: t('conciergeServices'), href: "/concierge-services" },
    { label: t('howWeWork'), href: "/how-we-work" },
    { label: t('corporatePartnerships'), href: "/corporate-partnerships" },
    { label: t('vipServices'), href: "/#vip" },
    { label: t('contactAkaza'), href: "/contact" },
  ];

  const companyLinks: NavLink[] = [
    { label: t('about'), href: "/about" },
    { label: t('privacy'), href: "/privacy" },
    { label: t('terms'), href: "/terms" },
  ];

  const socialLinks: SocialLink[] = [
    { label: t('instagram'), href: "https://instagram.com", icon: Instagram },
    { label: t('linkedin'), href: "https://linkedin.com", icon: Linkedin },
    { label: t('youtube'), href: "https://youtube.com", icon: Youtube },
    { label: t('emailLabel'), href: "mailto:concierge@akazatravel.com", icon: Mail },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[var(--line-soft)] bg-[var(--surface-footer)]">
      <span className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-primary/14 blur-[96px]" />
      <span className="pointer-events-none absolute right-0 top-8 h-72 w-72 rounded-full bg-[var(--color-accent)]/14 blur-[90px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 md:pt-20">
        <section className="mb-14 border border-[var(--line-soft)] bg-[linear-gradient(120deg,rgba(185,117,50,0.16),rgba(16,33,39,0.58),rgba(185,117,50,0.14))] p-7 md:p-9">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                {t('tagline')}
              </p>
              <h3 className="mt-3 text-2xl sm:text-3xl font-serif text-[var(--text-primary)] md:text-5xl">
                {t('builtFor')}
                <span className="ml-0 sm:ml-2 block sm:inline italic text-[var(--color-accent-light)]">{t('crossBorder')}</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {t('description')}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-primary/70 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:-translate-y-0.5 hover:bg-primary-gradient-end"
              >
                {common('inquireNow')}
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/how-we-work"
                className="inline-flex items-center justify-center border border-[var(--line-strong)] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:border-primary/55 hover:text-primary"
              >
                {t('howWeWork')}
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-10 border-b border-[var(--line-soft)] pb-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src="/images/logos/secondary-dark.png"
                alt="AKAZA Travel"
                width={230}
                height={74}
                className="h-auto w-[172px] theme-dark-only"
              />
              <Image
                src="/images/logos/secondary-light.png"
                alt="AKAZA Travel"
                width={230}
                height={74}
                className="h-auto w-[172px] theme-light-only"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
              {t('bottomDesc')}
            </p>

            <div className="mt-6 space-y-2.5 text-sm text-[var(--text-secondary)]">
              <p className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                {t('locations')}
              </p>
              <a
                href="mailto:concierge@akazatravel.com"
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail size={14} className="text-primary" />
                {t('emailAddress')}
              </a>
              <a href="tel:+201000123456" className="inline-flex items-center gap-2 transition-colors hover:text-primary">
                <Phone size={14} className="text-primary" />
                {t('phoneNumber')}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isExternal = social.href.startsWith("http");
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-soft)] bg-[var(--surface-card)]/55 text-[var(--text-muted)] transition-all hover:-translate-y-0.5 hover:border-primary/55 hover:text-primary"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          <FooterColumn title={t('siteLinks')} links={siteLinks} />
          <FooterColumn title={t('services')} links={serviceLinks} />
          <FooterColumn title={t('company')} links={companyLinks} />
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
          <p>{t('copyright', { year: currentYear })}</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-primary">
              {t('privacyShort')}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary">
              {t('termsShort')}
            </Link>
            <Link href="/contact" className="transition-colors hover:text-primary">
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h5 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)]">
        {title}
      </h5>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-[var(--text-muted)] transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
