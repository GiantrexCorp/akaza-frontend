'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Mail, PhoneCall, Sparkles, Instagram, Linkedin, Youtube } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/Toast';

const destinations = [
  'Cairo & Giza',
  'Red Sea & Hurghada',
  'Luxor & Aswan',
  'Marsa Alam',
  'Sharm El Sheikh',
  'Multi-Destination Journey',
];

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [vision, setVision] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !destination || !vision) {
      toast('error', 'Please complete all required fields.');
      return;
    }

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setSending(false);
    toast('success', "Inquiry submitted. We'll contact you shortly.");
    setName('');
    setEmail('');
    setPhone('');
    setDestination('');
    setVision('');
  };

  return (
    <>
      <Navbar />

      <main className="bg-[var(--surface-page)] text-[var(--text-primary)]">
        <section className="mt-24">
          <article className="group relative h-[68vh] min-h-[540px] overflow-hidden border-y border-[var(--line-soft)]">
            <Image
              src="/images/hotel-four-seasons.jpg"
              alt="Private concierge ambiance"
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[var(--hero-overlay-start)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-[var(--surface-section)]" />

            <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
              <span className="rounded-full border border-primary/40 bg-primary/12 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Your Private Concierge
              </span>
              <h1 className="mt-6 text-5xl font-serif leading-[0.92] text-white md:text-7xl">Start Your Journey</h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-200/90 md:text-2xl">
                Bespoke experiences tailored to the world&apos;s most discerning travelers. Tell us your vision, and we
                will curate the reality.
              </p>
            </div>
          </article>
        </section>

        <section className="relative overflow-hidden bg-[var(--surface-section)] px-6 py-16 md:py-22">
          <span className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary/12 blur-[96px]" />
          <span className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-[var(--color-accent)]/12 blur-[96px]" />

          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div
              data-reveal
              className="reveal-item rounded-2xl border border-[var(--line-soft)] bg-[linear-gradient(130deg,rgba(185,117,50,0.13),rgba(16,33,39,0.52),rgba(185,117,50,0.08))] p-7 md:p-8"
            >
              <h2 className="text-4xl font-serif md:text-5xl">Inquiry Form</h2>
              <div className="mt-4 h-px w-20 bg-gradient-to-r from-primary to-primary-gradient-end" />

              <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
                  <Field
                    label="Full Name"
                    placeholder="Jonathan Doe"
                    value={name}
                    onChange={setName}
                  />
                  <Field
                    label="Email Address"
                    type="email"
                    placeholder="concierge@example.com"
                    value={email}
                    onChange={setEmail}
                  />
                  <Field
                    label="Phone Number"
                    type="tel"
                    placeholder="+44 20 7946 0000"
                    value={phone}
                    onChange={setPhone}
                  />

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                      Destination Of Interest
                    </label>
                    <div className="relative mt-2">
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="h-12 w-full appearance-none border-b border-[var(--line-strong)] bg-transparent pr-8 text-base text-[var(--field-text)] outline-none transition-colors focus:border-primary"
                      >
                        <option value="" disabled>
                          Select a destination
                        </option>
                        {destinations.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Your Vision
                  </label>
                  <textarea
                    rows={4}
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="How can we design your unforgettable journey?"
                    className="mt-2 w-full resize-none border-b border-[var(--line-strong)] bg-transparent py-2 text-base text-[var(--field-text)] placeholder-[var(--field-placeholder)] outline-none transition-colors focus:border-primary"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex h-12 items-center gap-2 rounded-lg border border-primary/65 bg-primary px-7 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:bg-primary-gradient-end disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? 'Submitting...' : 'Submit Inquiry'}
                    <ArrowRight size={13} />
                  </button>
                </div>
              </form>
            </div>

            <aside data-reveal className="reveal-item space-y-7">
              <div className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-card)]/78 p-7 shadow-[0_24px_44px_-28px_rgba(0,0,0,0.72)]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/45 bg-primary/10 text-primary">
                  <Sparkles size={17} />
                </span>
                <h3 className="mt-5 text-4xl font-serif">Speak to an Advisor</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Our travel specialists are ready to curate your next escape with concierge-level precision and direct consultation.
                </p>

                <a
                  href="tel:+442012345678"
                  className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary transition-colors hover:text-primary-gradient-end"
                >
                  <PhoneCall size={15} />
                  +44 20 1234 5678
                </a>

                <a
                  href="tel:+442012345678"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg border border-primary/55 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-white"
                >
                  Schedule A Private Call
                </a>
              </div>

              <div className="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-card)]/65 p-7">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">London Office</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                      24 Berkeley Square
                      <br />
                      Mayfair, London
                      <br />
                      W1J 6HE, UK
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Dubai Office</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                      Gate Village 05
                      <br />
                      DIFC, Dubai
                      <br />
                      PO Box 506500, UAE
                    </p>
                  </div>
                </div>

                <div className="mt-7 border-t border-[var(--line-soft)] pt-5">
                  <a
                    href="mailto:concierge@akazatravel.com"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-primary"
                  >
                    <Mail size={15} className="text-primary" />
                    concierge@akazatravel.com
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
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-soft)] text-[var(--text-muted)] transition-all hover:-translate-y-0.5 hover:border-primary/55 hover:text-primary"
                        >
                          <Icon size={14} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  type?: 'text' | 'email' | 'tel';
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full border-b border-[var(--line-strong)] bg-transparent text-base text-[var(--field-text)] placeholder-[var(--field-placeholder)] outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
