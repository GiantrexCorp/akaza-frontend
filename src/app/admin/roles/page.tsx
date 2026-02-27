'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Shield } from 'lucide-react';
import RoleCard from '@/components/admin/roles/RoleCard';
import CreateRoleModal from '@/components/admin/roles/CreateRoleModal';
import { Button, Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminRolesApi } from '@/lib/api/admin-roles';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute, useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import type { AdminRole } from '@/types/admin';

export default function AdminRolesPage() {
  useEffect(() => { document.title = 'Roles | Akaza Admin'; }, []);
  const { user } = useAuth();
  const { toast } = useToast();
  const canCreate = hasPermission(user, 'create-role');
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('include', 'permissions');
      params.set('sort', 'name');
      const raw = await adminRolesApi.list(params.toString());
      if (Array.isArray(raw)) {
        setRoles(raw);
      } else {
        setRoles(raw?.data ?? []);
      }
    } catch (err) {
      setRoles([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load roles');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleRoleCreated = () => {
    setCreateModalOpen(false);
    fetchRoles();
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

        {loading ? (
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
