import Image from 'next/image';
import Link from 'next/link';

type Program = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  cta: string;
  href: string;
  image: string;
  alt: string;
};

const signaturePrograms: Program[] = [
  {
    eyebrow: 'Bespoke Celebrations',
    title: 'Special Occasions',
    body: 'From private anniversaries to destination milestones, we craft moments that feel deeply personal and flawlessly executed.',
    bullets: [
      'Tailored event design and production',
      'Access to private venues and invitation-only spaces',
    ],
    cta: 'Inquire Now',
    href: '/contact',
    image: '/images/hotel-four-seasons.jpg',
    alt: 'Luxury celebration setup',
  },
  {
    eyebrow: 'Oceanic Freedom',
    title: 'Yacht Charters',
    body: 'Navigate iconic coastlines aboard curated vessels with private crew, refined onboard hospitality, and complete itinerary control.',
    bullets: ['Private fleet access', 'Chef-led dining experiences'],
    cta: 'View Fleet',
    href: '/contact',
    image: '/images/hurghada.jpg',
    alt: 'Luxury yacht on open water',
  },
];

export default function SignaturePrograms() {
  return (
    <section id="signature-programs" className="bg-[var(--surface-section)] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl space-y-14">
        {signaturePrograms.map((program, index) => {
          const reverse = index % 2 === 1;
          return (
            <article
              key={program.title}
              data-reveal
              className={`reveal-item group grid gap-8 border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-6 md:p-8 lg:grid-cols-2 lg:items-center ${
                reverse ? 'lg:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div className="relative overflow-hidden border border-[var(--line-soft)]">
                <Image
                  src={program.image}
                  alt={program.alt}
                  width={1080}
                  height={720}
                  className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[420px]"
                />
                <span className="pointer-events-none absolute inset-y-0 -left-[45%] w-1/3 rotate-[12deg] bg-gradient-to-r from-transparent via-white/28 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-70" />
              </div>

              <div className="lg:px-4">
                <span className="text-primary text-[11px] uppercase tracking-[0.22em] font-semibold">
                  {program.eyebrow}
                </span>
                <h2 className="mt-2 text-4xl md:text-5xl font-serif text-[var(--text-primary)]">
                  {program.title}
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-[var(--text-muted)] max-w-xl">
                  {program.body}
                </p>
                <ul className="mt-6 space-y-2">
                  {program.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-[13px] text-[var(--text-secondary)] flex items-start gap-2"
                    >
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/85" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <Link
                  href={program.href}
                  className="mt-7 inline-flex items-center justify-center border border-primary/60 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-primary-gradient-end hover:-translate-y-0.5"
                >
                  {program.cta}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
