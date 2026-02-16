"use client";

import { Facebook, Camera, AtSign } from "lucide-react";
import AkazaLogo from "./AkazaLogo";

const destinations = [
  "Hurghada & Red Sea",
  "Cairo & Giza",
  "Luxor & Aswan",
  "Marsa Alam",
  "Sharm El Sheikh",
];

const support = [
  "Help Center",
  "Safety Information",
  "Booking Policy",
  "Terms of Service",
  "Contact Us",
];

const socials = [
  { icon: Facebook, label: "Facebook" },
  { icon: Camera, label: "Instagram" },
  { icon: AtSign, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-footer border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div>
            <div className="flex flex-col items-start gap-1 mb-8">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 22H7L12 12L17 22H22L12 2ZM12 5.8L15.1 12H8.9L12 5.8Z" />
                </svg>
                <span className="text-white text-xl font-serif tracking-widest">
                  AKAZA
                </span>
              </div>
              <span className="text-slate-500 text-[10px] uppercase tracking-[0.4em] ml-8">
                Travel
              </span>
            </div>
            <p className="text-slate-500 font-light text-sm leading-relaxed mb-8">
              Defining luxury travel in Egypt since 1998. Your gateway to
              exclusive excursions and unparalleled concierge care.
            </p>
            <div className="flex gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-all border border-slate-800 hover:border-primary"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">
              Destinations
            </h5>
            <ul className="space-y-4 text-slate-500 text-sm font-light">
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
            <h5 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">
              Support
            </h5>
            <ul className="space-y-4 text-slate-500 text-sm font-light">
              {support.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">
              Newsletter
            </h5>
            <p className="text-slate-500 text-sm mb-6 font-light">
              Subscribe for exclusive offers and travel insights.
            </p>
            <form
              className="space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 bg-bg-dark border border-white/5 focus:border-primary text-slate-200 outline-none text-sm placeholder-slate-600 transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-white text-black hover:bg-primary hover:text-white py-3 font-bold uppercase tracking-widest text-xs transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[10px] tracking-wider uppercase">
            &copy; {new Date().getFullYear()} AKAZA Travel. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8 text-slate-600 text-[10px] tracking-wider uppercase">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
