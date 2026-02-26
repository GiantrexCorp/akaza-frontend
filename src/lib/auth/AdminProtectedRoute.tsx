'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { hasPermission } from '@/lib/permissions';
import { Spinner } from '@/components/ui';

interface AdminProtectedRouteProps {
  children: ReactNode;
  permission?: string;
}

export default function AdminProtectedRoute({ children, permission }: AdminProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (user.type !== 'admin') {
      router.push('/dashboard/bookings');
      return;
    }

    if (permission && !hasPermission(user, permission)) {
      router.push('/admin/users');
    }
  }, [user, loading, router, permission]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-page)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || user.type !== 'admin') return null;
  if (permission && !hasPermission(user, permission)) return null;

  return <>{children}</>;
}
