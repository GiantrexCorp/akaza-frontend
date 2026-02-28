'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Metric = {
  key: string;
  target: number;
  suffix: string;
  label: string;
};

const metrics: Metric[] = [
  { key: 'global_hubs', target: 50, suffix: '+', label: 'Global Hubs' },
  { key: 'local_experts', target: 1500, suffix: '+', label: 'Local Experts' },
];

export default function DmcMetrics() {
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(metrics.map((m) => [m.key, 0]))
  );
  const [hasAnimatedCounts, setHasAnimatedCounts] = useState(false);
  const metricsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = metricsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasAnimatedCounts) return;
        setHasAnimatedCounts(true);

        const start = performance.now();
        const duration = 1200;

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          const nextCounts = Object.fromEntries(
            metrics.map((metric) => [metric.key, Math.floor(metric.target * eased)])
          );
          setCounts(nextCounts);

          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimatedCounts]);

  return (
    <section className="bg-[var(--surface-section)] px-6 py-16 md:py-22" ref={metricsRef}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div data-reveal className="reveal-item">
          <span className="text-primary text-[11px] uppercase tracking-[0.22em] font-semibold">
            DMC Collaborations
          </span>
          <h3 className="mt-3 text-4xl md:text-6xl font-serif text-[var(--text-primary)]">
            Local Soul,
            <br />
            <span className="italic text-primary">Global Standard</span>
          </h3>
          <p className="mt-5 max-w-xl text-sm text-[var(--text-muted)] leading-relaxed">
            As a premium destination management partner, we blend global operational
            control with deep local intelligence for exceptional outcomes.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 max-w-sm">
            {metrics.map((metric) => (
              <div
                key={metric.key}
                className="border border-[var(--line-soft)] bg-[var(--surface-card)]/55 px-4 py-4"
              >
                <p className="text-3xl font-serif text-primary">
                  {counts[metric.key]}
                  {metric.suffix}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/destinations"
            className="mt-7 inline-flex items-center justify-center border border-primary/60 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-primary-gradient-end hover:-translate-y-0.5"
          >
            Explore Destinations
          </Link>
        </div>

        <div data-reveal className="reveal-item relative overflow-hidden border border-[var(--line-soft)]">
          <Image
            src="/images/hotel-steigenberger.jpg"
            alt="Luxury destination collaboration"
            width={1200}
            height={860}
            className="h-[360px] w-full object-cover md:h-[460px]"
          />
        </div>
      </div>
    </section>
  );
}
