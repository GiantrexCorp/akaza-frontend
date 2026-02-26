'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { adminUsersApi } from '@/lib/api/admin-users';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { AdminUser } from '@/types/admin';

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser;
}

export default function DeleteUserModal({ open, onClose, user }: DeleteUserModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminUsersApi.delete(user.id);
      toast('success', 'User deleted');
      router.push('/admin/users');
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to delete user');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete User">
      <div className="flex items-start gap-3 mb-6">
        <div className="shrink-0 mt-0.5">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <div>
          <p className="text-sm text-[var(--text-secondary)] font-sans">
            Are you sure you want to permanently delete <strong className="text-[var(--text-primary)]">{user.name}</strong>?
          </p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-2">
            This action cannot be undone. All associated data will be removed.
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
          Delete User
        </Button>
      </div>
    </Modal>
  );
}
