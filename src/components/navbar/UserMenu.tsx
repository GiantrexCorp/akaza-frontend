'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import type { User as UserType } from '@/types/auth';

interface UserMenuProps {
  user: UserType;
  isLight: boolean;
  onLogout: () => void;
}

export default function UserMenu({ user, isLight, onLogout }: UserMenuProps) {
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
        className={`flex items-center gap-2 rounded-full border border-[var(--line-soft)] px-2 py-1.5 text-[var(--text-secondary)] transition-colors ${
          isLight
            ? 'bg-white/70 hover:border-primary/40 hover:text-[var(--text-primary)]'
            : 'bg-black/10 hover:border-[var(--nav-avatar-border)] hover:text-[var(--nav-user-hover-text)]'
        }`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--nav-avatar-border)] bg-gradient-to-br from-primary/60 to-primary-gradient-end/40">
          <span className="text-xs font-bold text-white font-sans uppercase">
            {user.name.charAt(0)}
          </span>
        </div>
        <span className="pr-2 text-[11px] uppercase tracking-[0.18em] font-semibold font-sans">
          {user.name.split(' ')[0]}
        </span>
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden border border-[var(--line-soft)] bg-[var(--surface-card)] shadow-2xl z-50">
          <div className="border-b border-[var(--line-soft)] bg-white/[0.02] px-4 py-3">
            <p className="text-sm font-serif text-[var(--text-primary)]">{user.name}</p>
            <p className="mt-0.5 text-[10px] text-[var(--text-muted)] font-sans">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/dashboard/bookings"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider font-sans"
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2 px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider font-sans"
            >
              <User size={14} />
              Profile
            </Link>
            <button
              onClick={() => { setOpen(false); onLogout(); }}
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
  );
}
