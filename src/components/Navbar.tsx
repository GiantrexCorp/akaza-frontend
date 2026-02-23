"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import AkazaLogo from "./AkazaLogo";

const navLinks = [
  { label: "Destinations", href: "#destinations" },
  { label: "Excursions", href: "#excursions" },
  { label: "Packages", href: "#packages" },
  { label: "VIP Services", href: "#vip" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
  });

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--surface-nav)] backdrop-blur-[16px] border-b border-[var(--line-soft)] transition-all duration-300">
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
                className="text-[var(--text-secondary)] hover:text-primary transition-colors uppercase tracking-wider text-xs font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-[var(--line-soft)] text-[var(--text-secondary)] hover:text-primary hover:border-primary transition-colors flex items-center justify-center"
            aria-label="Toggle theme"
            type="button"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs uppercase tracking-widest font-medium">
            Login/Register
          </button>
          <button className="bg-gradient-to-r from-primary to-primary-gradient-end hover:to-primary text-white px-8 py-3 font-sans uppercase tracking-widest text-xs font-bold transition-all shadow-lg hover:shadow-primary/20">
            Book Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[var(--text-primary)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--surface-nav)] border-t border-[var(--line-soft)]">
          <div className="px-6 py-6 space-y-4">
            <button
              onClick={toggleTheme}
              className="w-full px-4 py-2 rounded-full border border-[var(--line-soft)] text-[var(--text-secondary)] hover:text-primary hover:border-primary transition-colors text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2"
              aria-label="Toggle theme"
              type="button"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {theme === "dark" ? "Light Theme" : "Dark Theme"}
            </button>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-[var(--text-secondary)] hover:text-primary transition-colors uppercase tracking-wider text-xs font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[var(--line-soft)] flex flex-col gap-4">
              <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs uppercase tracking-widest font-medium text-left">
                Login/Register
              </button>
              <button className="bg-gradient-to-r from-primary to-primary-gradient-end text-white px-8 py-3 font-sans uppercase tracking-widest text-xs font-bold w-full">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
