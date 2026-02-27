'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { Button, Toggle } from '@/components/ui';
import { adminRolesApi } from '@/lib/api/admin-roles';
import { ApiError } from '@/lib/api/client';
import { PERMISSION_GROUPS } from '@/lib/permissions';
import { useToast } from '@/components/ui/Toast';
import type { AdminRole, PermissionGroup } from '@/types/admin';

interface RolePermissionEditorProps {
  role: AdminRole;
  onUpdated: (role: AdminRole) => void;
  disabled?: boolean;
}

export default function RolePermissionEditor({ role, onUpdated, disabled }: RolePermissionEditorProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const currentPermissionNames = (role.permissions ?? []).map((p) => p.name);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissionNames);

  const hasChanges =
    JSON.stringify([...selectedPermissions].sort()) !==
    JSON.stringify([...currentPermissionNames].sort());

  const toggleGroup = (domain: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });
  };

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminRolesApi.update(role.id, { permissions: selectedPermissions });
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
        {hasChanges && !disabled && (
          <Button size="sm" loading={saving} onClick={handleSave}>
            Save Permissions
          </Button>
        )}
      </div>

      {disabled && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-primary/10 border border-primary/20">
          <Shield size={16} className="text-primary shrink-0" />
          <p className="text-xs font-sans text-primary">
            The super-admin role has all permissions implicitly and cannot be modified.
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
            selectedPermissions={selectedPermissions}
            onTogglePermission={togglePermission}
            disabled={!!disabled}
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
  selectedPermissions: string[];
  onTogglePermission: (key: string) => void;
  disabled: boolean;
}

function PermissionGroupRow({
  group,
  expanded,
  onToggleGroup,
  selectedPermissions,
  onTogglePermission,
  disabled,
}: PermissionGroupRowProps) {
  const selectedCount = group.permissions.filter((p) => selectedPermissions.includes(p.key)).length;

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
          {selectedCount}/{group.permissions.length}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
          {group.permissions.map((perm) => (
            <div key={perm.key} className="flex items-center justify-between px-4 py-3 pl-10">
              <div className="flex-1 min-w-0 mr-4">
                <span className="text-sm font-sans text-[var(--text-primary)]">{perm.label}</span>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{perm.description}</p>
              </div>
              <Toggle
                checked={selectedPermissions.includes(perm.key)}
                onChange={() => onTogglePermission(perm.key)}
                disabled={disabled}
                size="sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
