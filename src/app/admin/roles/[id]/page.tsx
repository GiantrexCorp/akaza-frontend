'use client';

import { useState, useEffect, use } from 'react';
import { Trash2 } from 'lucide-react';
import RolePermissionEditor from '@/components/admin/roles/RolePermissionEditor';
import DeleteRoleModal from '@/components/admin/roles/DeleteRoleModal';
import { Spinner, Breadcrumb, Button, Input, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminRolesApi } from '@/lib/api/admin-roles';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/lib/auth';
import type { AdminRole } from '@/types/admin';

function RoleDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  const isSuperAdmin = role?.name === 'super-admin';
  const canUpdate = hasPermission(user, 'update-role');
  const canDelete = hasPermission(user, 'delete-role');

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const data = await adminRolesApi.get(id);
        if (!cancelled) {
          setRole(data);
          setNameValue(data.name);
        }
      } catch (err) {
        if (!cancelled && err instanceof ApiError) {
          setError(err);
          toast('error', err.errors[0] || 'Failed to load role');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, retryCount]);

  useEffect(() => {
    document.title = role
      ? `${role.name} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [role]);

  const handleNameSave = async () => {
    if (!role || nameValue === role.name) {
      setEditingName(false);
      return;
    }
    setNameSaving(true);
    try {
      const updated = await adminRolesApi.update(role.id, { name: nameValue });
      setRole(updated);
      setEditingName(false);
      toast('success', 'Role name updated');
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to update role name');
      }
    } finally {
      setNameSaving(false);
    }
  };

  const handlePermissionsUpdated = (updated: AdminRole) => {
    setRole(updated);
  };

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="py-16">
        <PageError
          status={error?.status ?? 404}
          title={error?.status === 404 ? 'Role Not Found' : undefined}
          onRetry={() => setRetryCount((c) => c + 1)}
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
                    <Button size="sm" loading={nameSaving} onClick={handleNameSave}>
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
