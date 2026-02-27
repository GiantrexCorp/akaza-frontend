'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button, Input, Modal, Toggle } from '@/components/ui';
import { adminRolesApi } from '@/lib/api/admin-roles';
import { ApiError } from '@/lib/api/client';
import { PERMISSION_GROUPS } from '@/lib/permissions';
import { useToast } from '@/components/ui/Toast';
import type { PermissionGroup } from '@/types/admin';

interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateRoleModal({ open, onClose, onCreated }: CreateRoleModalProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const resetForm = () => {
    setName('');
    setSelectedPermissions([]);
    setExpandedGroups(new Set());
    setFieldErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});

    try {
      await adminRolesApi.create({
        name,
        permissions: selectedPermissions.length > 0 ? selectedPermissions : undefined,
      });
      toast('success', 'Role created successfully');
      resetForm();
      onCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        toast('error', err.errors[0] || 'Failed to create role');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create Role" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Role Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name?.[0]}
          placeholder="e.g. content-editor"
          required
        />

        <div>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
            Permissions
          </p>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {PERMISSION_GROUPS.map((group) => (
              <PermissionGroupToggle
                key={group.domain}
                group={group}
                expanded={expandedGroups.has(group.domain)}
                onToggleGroup={() => toggleGroup(group.domain)}
                selectedPermissions={selectedPermissions}
                onTogglePermission={togglePermission}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Create Role
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface PermissionGroupToggleProps {
  group: PermissionGroup;
  expanded: boolean;
  onToggleGroup: () => void;
  selectedPermissions: string[];
  onTogglePermission: (key: string) => void;
}

function PermissionGroupToggle({
  group,
  expanded,
  onToggleGroup,
  selectedPermissions,
  onTogglePermission,
}: PermissionGroupToggleProps) {
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
                size="sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
