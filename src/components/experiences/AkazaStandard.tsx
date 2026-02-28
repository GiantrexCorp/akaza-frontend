import { Shield, Sparkles, Globe2 } from 'lucide-react';

const standards = [
  {
    icon: Shield,
    title: 'Ultimate Privacy',
    body: 'Every detail is handled with layered discretion and security from inquiry to return.',
  },
  {
    icon: Sparkles,
    title: 'Bespoke Curation',
    body: 'No templates. Every experience is composed around your preferences and pace.',
  },
  {
    icon: Globe2,
    title: 'Global Reach',
    body: 'Our trusted network unlocks experiences and access beyond the ordinary.',
  },
];

export default function AkazaStandard() {
  return (
    <section className="bg-[var(--experiences-surface)] px-6 py-16 md:py-22">
      <div className="mx-auto max-w-7xl">
        <h3 className="text-center text-4xl font-serif text-[var(--text-primary)] md:text-5xl">
          The Akaza Standard
        </h3>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {standards.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="border border-[var(--line-soft)] bg-[var(--experiences-muted-card)] p-7 text-center">
                <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/45 text-primary">
                  <Icon size={20} />
                </div>
                <h4 className="text-xl font-serif italic text-[var(--text-primary)]">{item.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
