import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import type { User } from '@/types/auth';

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  links: NavLink[];
  isActiveLink: (href: string) => boolean;
  isLight: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  user: User | null;
  onLogout: () => void;
  onClose: () => void;
}

export default function MobileMenu({ links, isActiveLink, isLight, theme, onToggleTheme, user, onLogout, onClose }: MobileMenuProps) {
  return (
    <div
      className={`md:hidden border-t border-[var(--line-soft)] ${
        isLight
          ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,248,0.98))]'
          : 'bg-[linear-gradient(180deg,rgba(11,23,27,0.86),rgba(11,23,27,0.96))]'
      }`}
    >
      <div className="space-y-4 px-5 py-5">
        <ThemeToggle isLight={isLight} theme={theme} onToggle={onToggleTheme} mobile />
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`block px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
              link.href === '/#vip'
                ? isActiveLink(link.href)
                  ? 'text-[var(--nav-vip-text)] bg-black/[0.08] shadow-[inset_0_0_0_1px_rgba(255,210,145,0.72),0_10px_22px_-16px_rgba(216,154,80,0.95)]'
                  : isLight
                    ? 'text-[var(--nav-vip-text)] bg-white/80 shadow-[inset_0_0_0_1px_rgba(206,144,77,0.6)] hover:bg-white hover:text-[var(--nav-vip-hover)]'
                    : 'text-[var(--nav-vip-hover)] bg-black/25 shadow-[inset_0_0_0_1px_rgba(255,210,145,0.5)] hover:bg-black/35 hover:text-[var(--nav-vip-hover-bright)]'
                : isActiveLink(link.href)
                ? isLight
                  ? 'text-primary bg-black/[0.06]'
                  : 'text-primary bg-white/6'
                : isLight
                  ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04]'
                  : 'text-[var(--text-secondary)] hover:text-primary hover:bg-white/[0.04]'
            }`}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
        <div className="pt-4 border-t border-[var(--line-soft)] flex flex-col gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard/bookings"
                onClick={onClose}
                className="text-[var(--text-secondary)] hover:text-primary transition-colors text-xs uppercase tracking-widest font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { onClose(); onLogout(); }}
                className="text-[var(--text-secondary)] hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-medium text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs uppercase tracking-widest font-medium"
            >
              Login / Register
            </Link>
          )}
          <Link
            href="/hotels/search"
            onClick={onClose}
            className="rounded-full border border-[var(--nav-avatar-border)] bg-gradient-to-r from-primary to-primary-gradient-end px-8 py-3 font-sans uppercase tracking-widest text-xs font-bold text-white w-full text-center"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
