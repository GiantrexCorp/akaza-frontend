import { Headphones, ShieldCheck, ReceiptText, Globe2 } from 'lucide-react';

const supportPillars = [
  {
    icon: Headphones,
    title: '24/7 Hotline',
    body: 'Instant access to senior logistics teams any hour, globally.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk Management',
    body: 'Proactive traveler safety protocols and contingency controls.',
  },
  {
    icon: ReceiptText,
    title: 'Centralized Billing',
    body: 'Consolidated reporting and corporate-grade invoicing workflows.',
  },
  {
    icon: Globe2,
    title: 'Local Liaison',
    body: 'Trusted in-market representation across priority destinations.',
  },
];

export default function SupportPillars() {
  return (
    <section className="bg-[var(--surface-page)] px-6 py-16 md:py-22">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h3 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)]">
            Concierge-Level Operational Support
          </h3>
          <p className="mt-3 text-[var(--text-muted)] max-w-3xl mx-auto">
            Reliability is core to our standard. Every route and workflow is managed to
            safeguard partner expectations and traveler confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {supportPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                data-reveal
                className="reveal-item border border-[var(--line-soft)] bg-[var(--surface-card)]/45 p-5 transition-all duration-500 hover:border-primary/55 hover:-translate-y-1"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/45 text-primary">
                  <Icon size={16} />
                </div>
                <h4 className="mt-4 text-2xl font-serif text-[var(--text-primary)]">{pillar.title}</h4>
                <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">{pillar.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
