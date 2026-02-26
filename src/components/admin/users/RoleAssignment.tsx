'use client';

import { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { adminUsersApi } from '@/lib/api/admin-users';
import { ApiError } from '@/lib/api/client';
import { ALL_ROLES } from '@/lib/permissions';
import { useToast } from '@/components/ui/Toast';
import type { AdminUser } from '@/types/admin';

interface RoleAssignmentProps {
  user: AdminUser;
  onUpdated: (user: AdminUser) => void;
}

export default function RoleAssignment({ user, onUpdated }: RoleAssignmentProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const currentRoleNames = user.roles.map((r) => r.name);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoleNames);

  const hasChanges = JSON.stringify([...selectedRoles].sort()) !== JSON.stringify([...currentRoleNames].sort());

  const toggleRole = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminUsersApi.update(user.id, { roles: selectedRoles });
      onUpdated(updated);
      toast('success', 'Roles updated');
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to update roles');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-6">Roles</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_ROLES.map((role) => {
          const isSelected = selectedRoles.includes(role.name);
          const isSuperAdmin = role.name === 'super-admin';

          return (
            <button
              key={role.name}
              type="button"
              onClick={() => toggleRole(role.name)}
              className={`text-left p-4 border transition-all duration-200 ${
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-transparent border-[var(--line-soft)] hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className={isSelected ? 'text-primary' : 'text-[var(--text-muted)]'} />
                <span className={`text-sm font-sans font-bold ${isSelected ? 'text-primary' : 'text-[var(--text-primary)]'}`}>
                  {role.label}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-sans">{role.description}</p>
              {isSuperAdmin && isSelected && (
                <div className="flex items-center gap-1.5 mt-2 text-yellow-400">
                  <AlertTriangle size={12} />
                  <span className="text-[10px] font-sans font-medium">Grants full unrestricted access</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {hasChanges && (
        <div className="flex justify-end mt-4">
          <Button size="sm" loading={saving} onClick={handleSave}>
            Save Roles
          </Button>
        </div>
      )}
    </div>
  );
}
