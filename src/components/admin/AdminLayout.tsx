'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Users2,
  Target,
  Hotel,
  Ship,
  Car,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  FileText,
  ScrollText,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ChevronRight,
  Shield,
  Menu,
} from 'lucide-react';
import AkazaLogo from '@/components/AkazaLogo';
import { useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import type { ReactNode } from 'react';
import type { User } from '@/types/auth';

interface NavSection {
  title: string;
  links: NavLink[];
}

interface NavLink {
  label: string;
  href: string;
  icon: typeof Users;
  permission?: string;
  active?: boolean;
}

function getNavSections(): NavSection[] {
  return [
    {
      title: 'Management',
      links: [
        { label: 'Users', href: '/admin/users', icon: Users, permission: 'list-users' },
        { label: 'Roles', href: '/admin/roles', icon: Shield, permission: 'list-roles' },
        { label: 'Customers', href: '/admin/customers', icon: Users2, permission: 'list-customers' },
        { label: 'Leads', href: '/admin/leads', icon: Target, permission: 'manage-leads' },
        { label: 'Hotels', href: '/admin/hotels', icon: Hotel, permission: 'manage-hotel-bookings' },
        { label: 'Tours', href: '/admin/tours', icon: Ship, permission: 'create-tour' },
        { label: 'Transfers', href: '/admin/transfers', icon: Car, permission: 'create-transfer' },
      ],
    },
    {
      title: 'Bookings',
      links: [
        { label: 'Hotel Bookings', href: '/admin/bookings/hotels', icon: Hotel, permission: 'manage-hotel-bookings' },
        { label: 'Tour Bookings', href: '/admin/bookings/tours', icon: Ship, permission: 'manage-tour-bookings' },
        { label: 'Transfer Bookings', href: '/admin/bookings/transfers', icon: Car, permission: 'manage-transfer-bookings' },
      ],
    },
    {
      title: 'Finance',
      links: [
        { label: 'Transactions', href: '/admin/finance', icon: DollarSign, permission: 'view-financial-dashboard' },
        { label: 'Reports', href: '/admin/reports', icon: BarChart3, permission: 'view-financial-reports' },
      ],
    },
    {
      title: 'System',
      links: [
        { label: 'Templates', href: '/admin/notifications/templates', icon: FileText, permission: 'manage-notification-templates' },
        { label: 'Notification Logs', href: '/admin/notifications/logs', icon: Bell, permission: 'view-notification-logs' },
        { label: 'Settings', href: '/admin/settings', icon: Settings, permission: 'manage-settings' },
        { label: 'Audit Log', href: '/admin/audit', icon: ScrollText, permission: 'view-audit-logs' },
      ],
    },
  ];
}

function filterSections(sections: NavSection[], user: User): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      links: section.links.filter(
        (link) => !link.permission || hasPermission(user, link.permission)
      ),
    }))
    .filter((section) => section.links.length > 0);
}

interface AdminLayoutProps {
  children: ReactNode;
}

const SIDEBAR_KEY = 'admin_sidebar_collapsed';

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SIDEBAR_KEY) === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(SIDEBAR_KEY, String(next));
  };

  if (!user) return null;

  const sections = filterSections(getNavSections(), user);

  return (
    <div className="min-h-screen bg-[var(--surface-page)] flex">
      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[var(--surface-card)] border-b border-[var(--line-soft)] flex items-center justify-between px-4 z-50 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[var(--text-muted)] hover:text-primary transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <Link href="/admin" className="flex items-center">
          <AkazaLogo className="!w-[120px]" />
        </Link>
        <div className="w-10" />
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[var(--surface-card)] border-r border-[var(--line-soft)] flex flex-col transition-all duration-300 z-50 ${
          collapsed ? 'lg:w-[68px]' : 'lg:w-[260px]'
        } w-[260px] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--line-soft)] shrink-0">
          <Link href="/admin" className={`flex items-center ${collapsed ? 'lg:hidden' : ''}`}>
            <AkazaLogo className="!w-[120px]" />
          </Link>
          <button
            onClick={toggleCollapsed}
            className="p-2 text-[var(--text-muted)] hover:text-primary transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className={`px-3 mb-2 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans ${collapsed ? 'lg:hidden' : ''}`}>
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      title={collapsed ? link.label : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-xs font-sans font-medium transition-all duration-200 ${
                        collapsed ? 'lg:justify-center' : ''
                      } ${
                        isActive
                          ? 'bg-primary/10 text-primary border-l-2 border-primary'
                          : 'text-[var(--text-muted)] hover:text-primary hover:bg-white/5 border-l-2 border-transparent'
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{link.label}</span>
                      {isActive && <ChevronRight size={12} className={`ml-auto shrink-0 ${collapsed ? 'lg:hidden' : ''}`} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User card + logout */}
        <div className="border-t border-[var(--line-soft)] p-3 shrink-0">
          <div className={`flex items-center gap-3 mb-3 px-2 ${collapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary font-sans">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="text-sm font-serif text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-sans truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            title={collapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-sans font-medium text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 ${
              collapsed ? 'lg:justify-center' : ''
            }`}
          >
            <LogOut size={16} className="shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 pt-20 lg:pt-0 ${
          collapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
