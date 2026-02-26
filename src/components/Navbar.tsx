"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { Menu, Moon, Sun, X, User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AkazaLogo from "./AkazaLogo";

const navLinks = [
  { label: "Destinations", href: "/destinations" },
  { label: "Tours", href: "/tours" },
  { label: "Experiences", href: "/experiences" },
  { label: "Transfers", href: "/transfers" },
  { label: "VIP Services", href: "/#vip" },
];

type ThemeMode = "dark" | "light";

const getThemeSnapshot = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  const documentTheme = document.documentElement.getAttribute("data-theme");
  if (documentTheme === "light" || documentTheme === "dark") return documentTheme;
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return "dark";
};

const subscribeTheme = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("themechange", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("themechange", handler);
  };
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "dark");

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event("themechange"));
  };

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

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const resolvedTheme = theme;
  const isLight = resolvedTheme === "light";
  const shellGradient = isLight
    ? "bg-[linear-gradient(120deg,rgba(255,255,255,0.95),rgba(244,247,248,0.98)_38%,rgba(179,39,89,0.1))]"
    : "bg-[linear-gradient(120deg,rgba(185,117,50,0.16),rgba(11,23,27,0.86)_36%,rgba(226,175,109,0.08))]";
  const topAccent = isLight
    ? "via-[rgba(179,39,89,0.65)]"
    : "via-[#e2af6d]/80";
  const inactiveLinkStyle = isLight
    ? "text-[var(--text-secondary)] hover:bg-black/[0.06] hover:text-[var(--text-primary)]"
    : "text-[var(--text-secondary)] hover:bg-white/6 hover:text-[#f2d2a5]";
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

                <div className="hidden md:flex items-center gap-1">
                  {navLinks.map((link) => {
                    const isActive = isActiveLink(link.href);
                    const isVipLink = link.href === "/#vip";
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all ${
                          isVipLink
                            ? isActive
                              ? "text-[#d89a50] bg-black/[0.08] shadow-[inset_0_0_0_1px_rgba(255,210,145,0.72),0_10px_22px_-16px_rgba(216,154,80,0.95)]"
                              : isLight
                                ? "text-[#b97834] bg-white/75 shadow-[inset_0_0_0_1px_rgba(206,144,77,0.65)] hover:bg-white hover:text-[#8a5524] hover:translate-y-[-1px] hover:shadow-[inset_0_0_0_1px_rgba(206,144,77,0.9),0_12px_24px_-16px_rgba(206,144,77,0.95)]"
                                : "text-[#f7cd8f] bg-black/20 shadow-[inset_0_0_0_1px_rgba(255,210,145,0.55)] hover:bg-black/30 hover:text-[#ffe7bf] hover:translate-y-[-1px] hover:shadow-[inset_0_0_0_1px_rgba(255,214,151,0.95),0_12px_24px_-14px_rgba(241,194,122,0.95)]"
                            : isActive
                              ? activeLinkStyle
                              : inactiveLinkStyle
                        }`}
                      >
                        {isVipLink ? (
                          <span className="group inline-flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-90 transition-all group-hover:scale-125 group-hover:opacity-100" />
                            <span className="relative overflow-hidden">
                              <span className="pointer-events-none absolute inset-y-0 left-[-140%] w-1/2 rotate-[12deg] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-500 group-hover:left-[130%] group-hover:opacity-80" />
                              <span className="relative">{link.label}</span>
                            </span>
                          </span>
                        ) : (
                          link.label
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className={`h-10 w-10 rounded-full border border-[var(--line-soft)] text-[var(--text-secondary)] transition-colors flex items-center justify-center ${
                    isLight
                      ? "bg-white/70 hover:border-primary/40 hover:text-[var(--text-primary)]"
                      : "bg-black/15 hover:border-[#e2af6d]/55 hover:text-[#f2d2a5]"
                  }`}
                  aria-label="Toggle theme"
                  type="button"
                >
                  {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                </button>

                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center gap-2 rounded-full border border-[var(--line-soft)] px-2 py-1.5 text-[var(--text-secondary)] transition-colors ${
                        isLight
                          ? "bg-white/70 hover:border-primary/40 hover:text-[var(--text-primary)]"
                          : "bg-black/10 hover:border-[#e2af6d]/45 hover:text-[#f2d2a5]"
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2af6d]/50 bg-gradient-to-br from-primary/60 to-primary-gradient-end/40">
                        <span className="text-xs font-bold text-white font-sans uppercase">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="pr-2 text-[11px] uppercase tracking-[0.18em] font-semibold font-sans">
                        {user.name.split(" ")[0]}
                      </span>
                    </button>

                    {dropdownOpen && (
                      <div role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden border border-[var(--line-soft)] bg-[var(--surface-card)] shadow-2xl z-50">
                        <div className="border-b border-[var(--line-soft)] bg-white/[0.02] px-4 py-3">
                          <p className="text-sm font-serif text-[var(--text-primary)]">{user.name}</p>
                          <p className="mt-0.5 text-[10px] text-[var(--text-muted)] font-sans">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/dashboard/bookings"
                            onClick={() => setDropdownOpen(false)}
                            role="menuitem"
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider font-sans"
                          >
                            <LayoutDashboard size={14} />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            onClick={() => setDropdownOpen(false)}
                            role="menuitem"
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider font-sans"
                          >
                            <User size={14} />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            role="menuitem"
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
                    className="rounded-full border border-[var(--line-soft)] px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--text-secondary)] transition-colors hover:border-white/20 hover:text-[var(--text-primary)]"
                  >
                    Login / Register
                  </Link>
                )}

                <Link
                  href="/hotels/search"
                  className="rounded-full border border-[#e2af6d]/55 bg-gradient-to-r from-primary to-primary-gradient-end px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_-16px_rgba(226,175,109,0.8)] transition-all hover:translate-y-[-1px] hover:shadow-[0_14px_34px_-14px_rgba(226,175,109,0.95)]"
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
            <div
              className={`md:hidden border-t border-[var(--line-soft)] ${
                isLight
                  ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,248,0.98))]"
                  : "bg-[linear-gradient(180deg,rgba(11,23,27,0.86),rgba(11,23,27,0.96))]"
              }`}
            >
              <div className="space-y-4 px-5 py-5">
                <button
                  onClick={toggleTheme}
                  className={`w-full rounded-full border border-[var(--line-soft)] px-4 py-2 text-xs uppercase tracking-widest font-medium text-[var(--text-secondary)] transition-colors hover:text-primary hover:border-primary flex items-center justify-center gap-2 ${
                    isLight ? "bg-white/80" : "bg-black/15"
                  }`}
                  aria-label="Toggle theme"
                  type="button"
                >
                  {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  {resolvedTheme === "dark" ? "Light Theme" : "Dark Theme"}
                </button>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`block px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
                      link.href === "/#vip"
                        ? isActiveLink(link.href)
                          ? "text-[#d89a50] bg-black/[0.08] shadow-[inset_0_0_0_1px_rgba(255,210,145,0.72),0_10px_22px_-16px_rgba(216,154,80,0.95)]"
                          : isLight
                            ? "text-[#b97834] bg-white/80 shadow-[inset_0_0_0_1px_rgba(206,144,77,0.6)] hover:bg-white hover:text-[#8a5524]"
                            : "text-[#f7cd8f] bg-black/25 shadow-[inset_0_0_0_1px_rgba(255,210,145,0.5)] hover:bg-black/35 hover:text-[#ffe7bf]"
                        : isActiveLink(link.href)
                        ? isLight
                          ? "text-primary bg-black/[0.06]"
                          : "text-primary bg-white/6"
                        : isLight
                          ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04]"
                          : "text-[var(--text-secondary)] hover:text-primary hover:bg-white/[0.04]"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-[var(--line-soft)] flex flex-col gap-3">
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
                    className="rounded-full border border-[#e2af6d]/50 bg-gradient-to-r from-primary to-primary-gradient-end px-8 py-3 font-sans uppercase tracking-widest text-xs font-bold text-white w-full text-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
