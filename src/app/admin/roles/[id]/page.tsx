'use client';

import { useState, useEffect, use } from 'react';
import { Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
const RolePermissionEditor = dynamic(() => import('@/components/admin/roles/RolePermissionEditor'), { ssr: false });
const DeleteRoleModal = dynamic(() => import('@/components/admin/roles/DeleteRoleModal'), { ssr: false });
import { Spinner, Breadcrumb, Button, Input, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useAdminRoleDetail, useUpdateRole } from '@/hooks/admin/useAdminRoles';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/lib/auth';
import type { AdminRole } from '@/types/admin';

function RoleDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: role, isLoading, isError, error, refetch } = useAdminRoleDetail(id);
  useQueryErrorToast(isError, error, 'Failed to load role');
  const updateMutation = useUpdateRole();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');

  useEffect(() => {
    if (role) setNameValue(role.name);
  }, [role]);

  const isSuperAdmin = role?.name === 'super-admin';
  const canUpdate = hasPermission(user, 'update-role');
  const canDelete = hasPermission(user, 'delete-role');

  useEffect(() => {
    document.title = role
      ? `${role.name} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [role]);

  const handleNameSave = () => {
    if (!role || nameValue === role.name) {
      setEditingName(false);
      return;
    }
    updateMutation.mutate(
      { id: role.id, data: { name: nameValue } },
      {
        onSuccess: () => {
          refetch();
          setEditingName(false);
          toast('success', 'Role name updated');
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast('error', err.errors[0] || 'Failed to update role name');
          }
        },
      },
    );
  };

  const handlePermissionsUpdated = (_updated: AdminRole) => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !role) {
    return (
      <div className="py-16">
        <PageError
          status={(error as ApiError)?.status ?? 404}
          title={(error as ApiError)?.status === 404 ? 'Role Not Found' : undefined}
          onRetry={() => refetch()}
          backHref="/admin/roles"
          backLabel="Back to Roles"
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Roles', href: '/admin/roles' },
          { label: role.name },
        ]}
      />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {editingName && !isSuperAdmin ? (
                  <div className="flex items-center gap-3">
                    <Input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button size="sm" loading={updateMutation.isPending} onClick={handleNameSave}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setNameValue(role.name);
                        setEditingName(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-serif text-[var(--text-primary)]">{role.name}</h1>
                    {canUpdate && !isSuperAdmin && (
                      <button
                        onClick={() => setEditingName(true)}
                        className="text-xs font-sans text-primary hover:text-primary/80 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-[var(--text-muted)] font-sans">
                {role.users_count ?? 0} user{(role.users_count ?? 0) !== 1 ? 's' : ''} assigned
                {isSuperAdmin && ' — This role cannot be modified'}
              </p>
            </div>
            {canDelete && !isSuperAdmin && (
              <Button
                variant="ghost"
                onClick={() => setDeleteModalOpen(true)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        </div>

        {/* Permission Editor */}
        <RolePermissionEditor
          role={role}
          onUpdated={handlePermissionsUpdated}
          disabled={isSuperAdmin || !canUpdate}
        />
      </div>

      <DeleteRoleModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        role={role}
      />
    </div>
  );
}

export default function AdminRoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="list-roles">
      <RoleDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
