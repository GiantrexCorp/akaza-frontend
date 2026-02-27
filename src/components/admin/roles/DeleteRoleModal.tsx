'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { adminRolesApi } from '@/lib/api/admin-roles';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { AdminRole } from '@/types/admin';

interface DeleteRoleModalProps {
  open: boolean;
  onClose: () => void;
  role: AdminRole;
}

export default function DeleteRoleModal({ open, onClose, role }: DeleteRoleModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminRolesApi.delete(role.id);
      toast('success', 'Role deleted');
      router.push('/admin/roles');
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to delete role');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Role">
      <div className="flex items-start gap-3 mb-6">
        <div className="shrink-0 mt-0.5">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <div>
          <p className="text-sm text-[var(--text-secondary)] font-sans">
            Are you sure you want to permanently delete the <strong className="text-[var(--text-primary)]">{role.name}</strong> role?
          </p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-2">
            This action cannot be undone. Users assigned to this role will lose its permissions.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          loading={deleting}
          className="bg-red-500 hover:bg-red-600"
        >
          Delete Role
        </Button>
      </div>
    </Modal>
  );
}
