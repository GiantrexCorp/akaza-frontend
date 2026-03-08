'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import type { User as UserType } from '@/types/auth';

interface UserMenuProps {
  user: UserType;
  isLight: boolean;
  onLogout: () => void;
}

export default function UserMenu({ user, isLight, onLogout }: UserMenuProps) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1.5 border border-[var(--line-soft)] px-2.5 py-2 transition-colors ${
          isLight
            ? 'bg-white/70 text-[var(--text-secondary)] hover:border-primary/40 hover:text-[var(--text-primary)]'
            : 'bg-black/15 text-[var(--text-secondary)] hover:border-primary/40 hover:text-[var(--nav-user-hover-text)]'
        }`}
      >
        <span className="flex h-5 w-5 items-center justify-center bg-gradient-to-br from-primary to-primary-gradient-end text-[9px] font-bold text-white font-sans uppercase">
          {user.name.charAt(0)}
        </span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div role="menu" className={`absolute right-0 mt-1.5 w-52 border border-[var(--line-soft)] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.65)] z-50 ${
          isLight ? 'bg-white' : 'bg-[var(--surface-card)]'
        }`}>
          <div className="border-b border-[var(--line-soft)] px-4 py-3">
            <p className="text-sm font-serif text-[var(--text-primary)]">{user.name}</p>
            <p className="mt-0.5 text-[10px] text-[var(--text-muted)] font-sans">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/dashboard/bookings"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-primary hover:bg-primary/5 transition-colors font-sans"
            >
              <LayoutDashboard size={14} />
              {t('dashboard')}
            </Link>
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-primary hover:bg-primary/5 transition-colors font-sans"
            >
              <User size={14} />
              {t('profile')}
            </Link>
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              role="menuitem"
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/5 transition-colors font-sans"
            >
              <LogOut size={14} />
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
