'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Spinner } from '@/components/ui';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    } else if (user.type !== 'admin') {
      router.push('/dashboard/bookings');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-page)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || user.type !== 'admin') return null;

  return <AdminLayout>{children}</AdminLayout>;
}
