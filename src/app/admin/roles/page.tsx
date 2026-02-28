'use client';

import { useState, useEffect } from 'react';
import { Plus, Shield } from 'lucide-react';
import RoleCard from '@/components/admin/roles/RoleCard';
import dynamic from 'next/dynamic';
const CreateRoleModal = dynamic(() => import('@/components/admin/roles/CreateRoleModal'), { ssr: false });
import { Button, Spinner, EmptyState } from '@/components/ui';
import { useAdminRoleList } from '@/hooks/admin/useAdminRoles';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute, useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import type { AdminRole } from '@/types/admin';

export default function AdminRolesPage() {
  useEffect(() => { document.title = 'Roles | Akaza Admin'; }, []);
  const { user } = useAuth();
  const canCreate = hasPermission(user, 'create-role');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const queryParams = 'include=permissions&sort=name';
  const { data: raw, isLoading, isError, error } = useAdminRoleList(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load roles');

  const roles: AdminRole[] = Array.isArray(raw) ? raw : (raw?.data ?? []);

  const handleRoleCreated = () => {
    setCreateModalOpen(false);
  };

  return (
    <AdminProtectedRoute permission="list-roles">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Roles</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {roles.length} role{roles.length !== 1 ? 's' : ''} total
            </p>
          </div>
          {canCreate && (
            <Button
              icon={<Plus size={14} />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create Role
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="py-16">
            <Spinner size="lg" />
          </div>
        ) : roles.length === 0 ? (
          <EmptyState
            icon={<Shield size={48} strokeWidth={1} />}
            title="No Roles Found"
            description="Create a role to get started with permission management."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        )}
      </div>

      <CreateRoleModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleRoleCreated}
      />
    </AdminProtectedRoute>
  );
}
