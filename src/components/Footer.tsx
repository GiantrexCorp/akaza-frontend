"use client";

import { Facebook, Camera, AtSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const destinations = [
  "Hurghada & Red Sea",
  "Cairo & Giza",
  "Luxor & Aswan",
  "Marsa Alam",
  "Sharm El Sheikh",
  "Istanbul & Antalya",
];

const support = [
  { label: "Journal", href: "/journal" },
  { label: "Markets We Serve", href: "/markets-we-serve" },
  { label: "Experiences", href: "/experiences" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "Concierge Services", href: "/concierge-services" },
  { label: "Concierge Support", href: "#" },
  { label: "B2B Partnerships", href: "/corporate-partnerships" },
  { label: "Trust Framework", href: "#" },
  { label: "Service Philosophy", href: "/how-we-work" },
  { label: "Contact Akaza", href: "#" },
];

const socials = [
  { icon: Facebook, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: AtSign, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--surface-footer)] border-t border-[var(--line-soft)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div>
            <div className="flex flex-col items-start gap-1 mb-8">
              <Image
                src="/images/logos/secondary-dark.png"
                alt="AKAZA Travel"
                width={220}
                height={72}
                className="h-auto w-[160px] theme-dark-only"
              />
              <Image
                src="/images/logos/secondary-light.png"
                alt="AKAZA Travel"
                width={220}
                height={72}
                className="h-auto w-[160px] theme-light-only"
              />
            </div>
            <p className="text-[var(--text-muted)] font-light text-sm leading-relaxed mb-8">
              Premium travel handling for clients who value certainty,
              discretion, and complete peace of mind from inquiry to return.
            </p>
            <div className="flex gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-primary transition-all border border-[var(--line-soft)] hover:border-primary"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h5 className="text-[var(--text-primary)] font-bold mb-8 uppercase tracking-[0.2em] text-xs">
              Destinations
            </h5>
            <ul className="space-y-4 text-[var(--text-muted)] text-sm font-light">
              {destinations.map((dest) => (
                <li key={dest}>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-[var(--text-primary)] font-bold mb-8 uppercase tracking-[0.2em] text-xs">
              Support
            </h5>
            <ul className="space-y-4 text-[var(--text-muted)] text-sm font-light">
              {support.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-[var(--text-primary)] font-bold mb-8 uppercase tracking-[0.2em] text-xs">
              Newsletter
            </h5>
            <p className="text-[var(--text-muted)] text-sm mb-6 font-light">
              Receive destination insights and premium program updates by market.
            </p>
            <form
              className="space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 bg-[var(--surface-card)] border border-[var(--line-soft)] focus:border-primary text-[var(--text-secondary)] outline-none text-sm placeholder-[var(--text-muted)] transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary-gradient-end py-3 font-bold uppercase tracking-widest text-xs transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-10 border-t border-[var(--line-soft)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[var(--text-muted)] text-[10px] tracking-wider uppercase">
            &copy; {new Date().getFullYear()} AKAZA Travel. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8 text-[var(--text-muted)] text-[10px] tracking-wider uppercase">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
