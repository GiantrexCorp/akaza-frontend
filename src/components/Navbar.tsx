"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, Moon, Sun, X, User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import AkazaLogo from "./AkazaLogo";

const navLinks = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Tours", href: "/tours" },
  { label: "Transfers", href: "/transfers" },
  { label: "VIP Services", href: "/#vip" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await logout();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--surface-nav)] backdrop-blur-[16px] border-b border-[var(--line-soft)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/">
            <AkazaLogo />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[var(--text-secondary)] hover:text-primary transition-colors uppercase tracking-wider text-xs font-medium"
              >
                {link.label}
              </Link>
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

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-primary transition-colors"
              >
                <div className="w-8 h-8 bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary font-sans uppercase">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-widest font-medium font-sans">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[var(--surface-card)] border border-[var(--line-soft)] shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-[var(--line-soft)]">
                    <p className="text-sm font-serif text-[var(--text-primary)]">{user.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] font-sans mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider font-sans"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider font-sans"
                    >
                      <User size={14} />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/5 transition-colors uppercase tracking-wider font-sans"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs uppercase tracking-widest font-medium"
            >
              Login / Register
            </Link>
          )}

          <Link
            href="/hotels/search"
            className="bg-gradient-to-r from-primary to-primary-gradient-end hover:to-primary text-white px-8 py-3 font-sans uppercase tracking-widest text-xs font-bold transition-all shadow-lg hover:shadow-primary/20"
          >
            Book Now
          </Link>
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
              <Link
                key={link.label}
                href={link.href}
                className="block text-[var(--text-secondary)] hover:text-primary transition-colors uppercase tracking-wider text-xs font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[var(--line-soft)] flex flex-col gap-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard/bookings"
                    onClick={() => setMobileOpen(false)}
                    className="text-[var(--text-secondary)] hover:text-primary transition-colors text-xs uppercase tracking-widest font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-[var(--text-secondary)] hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs uppercase tracking-widest font-medium"
                >
                  Login / Register
                </Link>
              )}
              <Link
                href="/hotels/search"
                onClick={() => setMobileOpen(false)}
                className="bg-gradient-to-r from-primary to-primary-gradient-end text-white px-8 py-3 font-sans uppercase tracking-widest text-xs font-bold w-full text-center"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
