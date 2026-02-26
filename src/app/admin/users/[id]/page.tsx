'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserDetailHeader from '@/components/admin/users/UserDetailHeader';
import UserInfoForm from '@/components/admin/users/UserInfoForm';
import RoleAssignment from '@/components/admin/users/RoleAssignment';
import PermissionEditor from '@/components/admin/users/PermissionEditor';
import DeleteUserModal from '@/components/admin/users/DeleteUserModal';
import { Spinner, Breadcrumb, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminUsersApi } from '@/lib/api/admin-users';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminUser } from '@/types/admin';

function UserDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminUsersApi.get(id);
        setUser(data);
      } catch (err) {
        if (err instanceof ApiError) {
          toast('error', err.errors[0] || 'Failed to load user');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

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

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-4">User Not Found</h2>
        <Link href="/admin/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
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
      <AdminLayout>
        <UserDetail id={Number(id)} />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
