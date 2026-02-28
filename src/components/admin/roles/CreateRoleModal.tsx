'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import PermissionGroupAccordion from '@/components/admin/roles/PermissionGroupAccordion';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createRoleSchema } from '@/lib/validation/schemas/admin';
import { adminRolesApi } from '@/lib/api/admin-roles';
import { ApiError } from '@/lib/api/client';
import { PERMISSION_GROUPS } from '@/lib/permissions';
import { useToast } from '@/components/ui/Toast';

interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateRoleModal({ open, onClose, onCreated }: CreateRoleModalProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [apiFieldErrors, setApiFieldErrors] = useState<Record<string, string[]>>({});
  const { errors: validationErrors, validate, clearError, clearErrors } = useFormValidation(createRoleSchema);
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const resetForm = () => {
    setName('');
    setSelectedPermissions([]);
    setExpandedGroups(new Set());
    setApiFieldErrors({});
    clearErrors();
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

  const fieldError = (field: string): string | undefined =>
    validationErrors[field] || apiFieldErrors[field]?.[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiFieldErrors({});

    if (!validate({ name })) {
      return;
    }

    setSubmitting(true);

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
        setApiFieldErrors(err.fieldErrors);
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
          onChange={(e) => { setName(e.target.value); clearError('name'); }}
          error={fieldError('name')}
          placeholder="e.g. content-editor"
          required
        />

        <div>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
            Permissions
          </p>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {PERMISSION_GROUPS.map((group) => (
              <PermissionGroupAccordion
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
