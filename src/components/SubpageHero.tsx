import Image from "next/image";
import Link from "next/link";

interface SubpageHeroProps {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

export default function SubpageHero({
  badge,
  title,
  subtitle,
  imageSrc,
  imageAlt,
  primaryCta,
  secondaryCta,
}: SubpageHeroProps) {
  return (
    <section className="mt-24">
      <article className="relative w-full h-[72vh] min-h-[560px] overflow-hidden border border-[var(--line-soft)] group">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-[var(--hero-overlay-end)]" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <span className="inline-flex items-center rounded-full border border-primary/35 bg-primary/15 px-5 py-2 text-[11px] uppercase tracking-[0.24em] font-bold font-sans text-primary mb-7">
            {badge}
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white leading-[0.9] tracking-tight mb-4">
            {title}
          </h1>

          <p className="text-xl sm:text-2xl md:text-4xl font-serif italic text-slate-200/90 mb-10">{subtitle}</p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-primary-gradient-end text-white min-w-[220px] px-8 py-4 text-xs uppercase tracking-[0.18em] font-sans font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center min-w-[220px] px-8 py-4 text-xs uppercase tracking-[0.18em] font-sans font-bold text-white border border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/50 hover:bg-white/15 transition-all"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
