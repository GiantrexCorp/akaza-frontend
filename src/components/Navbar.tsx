"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AkazaLogo from "./AkazaLogo";

const navLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Excursions", href: "#excursions" },
  { label: "Packages", href: "#packages" },
  { label: "VIP Services", href: "#vip" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-bg-dark/85 backdrop-blur-[16px] border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <a href="#">
            <AkazaLogo />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10 ml-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-300 hover:text-primary transition-colors uppercase tracking-wider text-xs font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-slate-300 hover:text-white transition-colors text-xs uppercase tracking-widest font-medium">
            Log In
          </button>
          <button className="bg-gradient-to-r from-primary to-primary-dark hover:to-primary text-white px-8 py-3 font-sans uppercase tracking-widest text-xs font-bold transition-all shadow-lg hover:shadow-primary/20">
            Book Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-dark border-t border-white/5">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-slate-300 hover:text-primary transition-colors uppercase tracking-wider text-xs font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
              <button className="text-slate-300 hover:text-white transition-colors text-xs uppercase tracking-widest font-medium text-left">
                Log In
              </button>
              <button className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 font-sans uppercase tracking-widest text-xs font-bold w-full">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
