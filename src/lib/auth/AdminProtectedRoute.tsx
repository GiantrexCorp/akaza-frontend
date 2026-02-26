'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { hasPermission } from '@/lib/permissions';

interface AdminProtectedRouteProps {
  children: ReactNode;
  permission?: string;
}

export default function AdminProtectedRoute({ children, permission }: AdminProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (permission && user && !hasPermission(user, permission)) {
      router.push('/admin/users');
    }
  }, [user, router, permission]);

  if (!user || (permission && !hasPermission(user, permission))) return null;

  return <>{children}</>;
}
