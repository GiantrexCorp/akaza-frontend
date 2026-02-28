"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AkazaLogo from "./AkazaLogo";
import NavLinks from "./navbar/NavLinks";
import { useTheme } from "./navbar/ThemeToggle";
import ThemeToggle from "./navbar/ThemeToggle";
import UserMenu from "./navbar/UserMenu";
import MobileMenu from "./navbar/MobileMenu";

const navLinks = [
  { label: "Destinations", href: "/destinations" },
  { label: "Tours", href: "/tours" },
  { label: "Experiences", href: "/experiences" },
  { label: "Transfers", href: "/transfers" },
  { label: "VIP Services", href: "/#vip" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, isLight, toggleTheme } = useTheme();

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
  };

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const shellGradient = isLight
    ? "bg-[linear-gradient(120deg,rgba(255,255,255,0.95),rgba(244,247,248,0.98)_38%,rgba(179,39,89,0.1))]"
    : "bg-[linear-gradient(120deg,rgba(185,117,50,0.16),rgba(11,23,27,0.86)_36%,rgba(226,175,109,0.08))]";
  const topAccent = isLight
    ? "via-[rgba(179,39,89,0.65)]"
    : "via-[#e2af6d]/80";
  const inactiveLinkStyle = isLight
    ? "text-[var(--text-secondary)] hover:bg-black/[0.06] hover:text-[var(--text-primary)]"
    : "text-[var(--text-secondary)] hover:bg-white/6 hover:text-[var(--nav-user-hover-text)]";
  const activeLinkStyle = isLight
    ? "bg-black/[0.06] text-primary shadow-[inset_0_0_0_1px_rgba(179,39,89,0.25)]"
    : "bg-white/8 text-primary shadow-[inset_0_0_0_1px_rgba(226,175,109,0.35)]";

  return (
    <nav className="fixed top-0 w-full z-50 px-3 pt-3 transition-all duration-300 md:px-6 md:pt-4">
      <div className="pointer-events-none mx-auto max-w-7xl">
        <div className={`pointer-events-auto relative overflow-visible border border-[var(--line-soft)] ${shellGradient} shadow-[0_20px_48px_-24px_rgba(0,0,0,0.75)] backdrop-blur-2xl`}>
          <span className={`pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent ${topAccent} to-transparent`} />
          <div className="px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-8 md:gap-10">
                <Link href="/" className="shrink-0">
                  <AkazaLogo className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]" />
                </Link>
                <NavLinks
                  links={navLinks}
                  isActiveLink={isActiveLink}
                  isLight={isLight}
                  inactiveLinkStyle={inactiveLinkStyle}
                  activeLinkStyle={activeLinkStyle}
                />
              </div>

              <div className="hidden md:flex items-center gap-3">
                <ThemeToggle isLight={isLight} theme={theme} onToggle={toggleTheme} />

                {user ? (
                  <UserMenu user={user} isLight={isLight} onLogout={handleLogout} />
                ) : (
                  <Link
                    href="/login"
                    className="rounded-full border border-[var(--line-soft)] px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--text-secondary)] transition-colors hover:border-white/20 hover:text-[var(--text-primary)]"
                  >
                    Login / Register
                  </Link>
                )}

                <Link
                  href="/hotels/search"
                  className="rounded-full border border-[var(--nav-avatar-border)] bg-gradient-to-r from-primary to-primary-gradient-end px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_-16px_rgba(226,175,109,0.8)] transition-all hover:translate-y-[-1px] hover:shadow-[0_14px_34px_-14px_rgba(226,175,109,0.95)]"
                >
                  Book Now
                </Link>
              </div>

              <button
                className={`md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-soft)] text-[var(--text-primary)] ${
                  isLight ? "bg-white/75" : "bg-black/15"
                }`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <MobileMenu
              links={navLinks}
              isActiveLink={isActiveLink}
              isLight={isLight}
              theme={theme}
              onToggleTheme={toggleTheme}
              user={user}
              onLogout={handleLogout}
              onClose={() => setMobileOpen(false)}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
