'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { Button, Toggle } from '@/components/ui';
import { adminUsersApi } from '@/lib/api/admin-users';
import { ApiError } from '@/lib/api/client';
import { PERMISSION_GROUPS, isSuperAdmin } from '@/lib/permissions';
import { useToast } from '@/components/ui/Toast';
import type { AdminUser, PermissionGroup } from '@/types/admin';

interface PermissionEditorProps {
  user: AdminUser;
  onUpdated: (user: AdminUser) => void;
}

function getRolePermissions(user: AdminUser): Set<string> {
  const inherited = new Set<string>();
  for (const role of user.roles) {
    if (role.name === 'super-admin') {
      for (const group of PERMISSION_GROUPS) {
        for (const perm of group.permissions) {
          inherited.add(perm.key);
        }
      }
    }
  }
  return inherited;
}

export default function PermissionEditor({ user, onUpdated }: PermissionEditorProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [directPermissions, setDirectPermissions] = useState<string[]>(user.permissions ?? []);

  const userIsSuperAdmin = isSuperAdmin(user);
  const inheritedPermissions = getRolePermissions(user);

  const hasChanges = JSON.stringify([...directPermissions].sort()) !== JSON.stringify([...(user.permissions ?? [])].sort());

  const toggleGroup = (domain: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) {
        next.delete(domain);
      } else {
        next.add(domain);
      }
      return next;
    });
  };

  const togglePermission = (key: string) => {
    setDirectPermissions((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminUsersApi.update(user.id, { permissions: directPermissions });
      onUpdated(updated);
      toast('success', 'Permissions updated');
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to update permissions');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif text-[var(--text-primary)]">Permissions</h2>
        {hasChanges && !userIsSuperAdmin && (
          <Button size="sm" loading={saving} onClick={handleSave}>
            Save Permissions
          </Button>
        )}
      </div>

      {userIsSuperAdmin && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-primary/10 border border-primary/20">
          <Shield size={16} className="text-primary shrink-0" />
          <p className="text-xs font-sans text-primary">
            Super admins have all permissions. Remove the super-admin role to manage permissions individually.
          </p>
        </div>
      )}

      <div className="space-y-1">
        {PERMISSION_GROUPS.map((group) => (
          <PermissionGroupRow
            key={group.domain}
            group={group}
            expanded={expandedGroups.has(group.domain)}
            onToggleGroup={() => toggleGroup(group.domain)}
            directPermissions={directPermissions}
            inheritedPermissions={inheritedPermissions}
            onTogglePermission={togglePermission}
            disabled={userIsSuperAdmin}
          />
        ))}
      </div>
    </div>
  );
}

interface PermissionGroupRowProps {
  group: PermissionGroup;
  expanded: boolean;
  onToggleGroup: () => void;
  directPermissions: string[];
  inheritedPermissions: Set<string>;
  onTogglePermission: (key: string) => void;
  disabled: boolean;
}

function PermissionGroupRow({
  group,
  expanded,
  onToggleGroup,
  directPermissions,
  inheritedPermissions,
  onTogglePermission,
  disabled,
}: PermissionGroupRowProps) {
  const grantedCount = group.permissions.filter(
    (p) => directPermissions.includes(p.key) || inheritedPermissions.has(p.key)
  ).length;

  return (
    <div className="border border-[var(--line-soft)]">
      <button
        type="button"
        onClick={onToggleGroup}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown size={14} className="text-[var(--text-muted)]" />
          ) : (
            <ChevronRight size={14} className="text-[var(--text-muted)]" />
          )}
          <span className="text-sm font-sans font-medium text-[var(--text-primary)]">
            {group.label}
          </span>
        </div>
        <span className="text-[10px] font-sans text-[var(--text-muted)]">
          {grantedCount}/{group.permissions.length}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
          {group.permissions.map((perm) => {
            const isInherited = inheritedPermissions.has(perm.key);
            const isDirect = directPermissions.includes(perm.key);
            const isChecked = isInherited || isDirect;

            return (
              <div key={perm.key} className="flex items-center justify-between px-4 py-3 pl-10">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-sans text-[var(--text-primary)]">{perm.label}</span>
                    {isInherited && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-sans text-[var(--text-muted)]">
                        <Shield size={10} /> role
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{perm.description}</p>
                </div>
                <Toggle
                  checked={isChecked}
                  onChange={() => onTogglePermission(perm.key)}
                  disabled={disabled || isInherited}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
