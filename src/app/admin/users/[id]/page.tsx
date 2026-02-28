'use client';

import { useState, useEffect, use } from 'react';
import UserDetailHeader from '@/components/admin/users/UserDetailHeader';
import UserInfoForm from '@/components/admin/users/UserInfoForm';
import RoleAssignment from '@/components/admin/users/RoleAssignment';
import PermissionEditor from '@/components/admin/users/PermissionEditor';
import dynamic from 'next/dynamic';
const DeleteUserModal = dynamic(() => import('@/components/admin/users/DeleteUserModal'), { ssr: false });
import { Spinner, Breadcrumb, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useAdminUserDetail, useUpdateUser } from '@/hooks/admin/useAdminUsers';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminUser } from '@/types/admin';

function UserDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const { data: user, isLoading, isError, error, refetch } = useAdminUserDetail(id);
  useQueryErrorToast(isError, error, 'Failed to load user');
  const updateMutation = useUpdateUser();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    document.title = user
      ? `${user.name} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [user]);

  const handleStatusChange = (status: 'active' | 'inactive' | 'suspended') => {
    if (!user) return;
    updateMutation.mutate(
      { id: user.id, data: { status } },
      {
        onSuccess: () => {
          refetch();
          toast('success', `Status changed to ${status}`);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast('error', err.errors[0] || 'Failed to update status');
          }
        },
      },
    );
  };

  const handleUpdated = (_updated: AdminUser) => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="py-16">
        <PageError
          status={(error as ApiError)?.status ?? 404}
          title={(error as ApiError)?.status === 404 ? 'User Not Found' : undefined}
          onRetry={() => refetch()}
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
          saving={updateMutation.isPending}
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
