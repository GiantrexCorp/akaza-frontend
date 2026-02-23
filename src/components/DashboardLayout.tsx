'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Hotel, Ship, Car, User, Bell, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { ReactNode } from 'react';

const sidebarLinks = [
  { label: 'My Bookings', href: '/dashboard/bookings', icon: Hotel },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen pt-24 bg-[var(--surface-page)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            {/* User card */}
            <div className="p-6 bg-[var(--surface-card)] border border-[var(--line-soft)] mb-6">
              <p className="text-lg font-serif text-[var(--text-primary)]">{user?.name}</p>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-1">{user?.email}</p>
            </div>

            {/* Nav links */}
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-sans font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                        : 'text-[var(--text-muted)] hover:text-primary hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                    {isActive && <ChevronRight size={14} className="ml-auto" />}
                  </Link>
                );
              })}

              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-sans font-medium text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
              >
                <LogOut size={16} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
