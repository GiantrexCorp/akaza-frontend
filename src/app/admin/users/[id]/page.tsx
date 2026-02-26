'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UserDetailHeader from '@/components/admin/users/UserDetailHeader';
import UserInfoForm from '@/components/admin/users/UserInfoForm';
import RoleAssignment from '@/components/admin/users/RoleAssignment';
import PermissionEditor from '@/components/admin/users/PermissionEditor';
import DeleteUserModal from '@/components/admin/users/DeleteUserModal';
import { Spinner, Breadcrumb, Button, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminUsersApi } from '@/lib/api/admin-users';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminUser } from '@/types/admin';

function UserDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const data = await adminUsersApi.get(id);
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled && err instanceof ApiError) {
          setError(err);
          toast('error', err.errors[0] || 'Failed to load user');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, retryCount]);

  useEffect(() => {
    document.title = user
      ? `${user.name} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [user]);

  const handleStatusChange = async (status: 'active' | 'inactive' | 'suspended') => {
    if (!user) return;
    setStatusSaving(true);
    try {
      const updated = await adminUsersApi.update(user.id, { status });
      setUser(updated);
      toast('success', `Status changed to ${status}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to update status');
      }
    } finally {
      setStatusSaving(false);
    }
  };

  const handleUpdated = (updated: AdminUser) => {
    setUser(updated);
  };

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="py-16">
        <PageError
          status={error?.status ?? 404}
          title={error?.status === 404 ? 'User Not Found' : undefined}
          onRetry={() => setRetryCount((c) => c + 1)}
          backHref="/admin/users"
          backLabel="Back to Users"
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Users', href: '/admin/users' },
          { label: user.name },
        ]}
      />

      <div className="mt-6 space-y-6">
        <UserDetailHeader
          user={user}
          onStatusChange={handleStatusChange}
          onDelete={() => setDeleteModalOpen(true)}
          saving={statusSaving}
        />

        <UserInfoForm user={user} onUpdated={handleUpdated} />

        <RoleAssignment user={user} onUpdated={handleUpdated} />

        <PermissionEditor user={user} onUpdated={handleUpdated} />
      </div>

      <DeleteUserModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        user={user}
      />
    </div>
  );
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="show-user">
      <UserDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
