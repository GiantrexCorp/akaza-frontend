'use client';

import { Badge, Button, Select } from '@/components/ui';
import { Trash2 } from 'lucide-react';
import type { AdminUser } from '@/types/admin';

interface UserDetailHeaderProps {
  user: AdminUser;
  onStatusChange: (status: 'active' | 'inactive' | 'suspended') => void;
  onDelete: () => void;
  saving: boolean;
}

const statusColors: Record<string, 'green' | 'gray' | 'red'> = {
  active: 'green',
  inactive: 'gray',
  suspended: 'red',
};

const typeColors: Record<string, 'purple' | 'blue'> = {
  admin: 'purple',
  customer: 'blue',
};

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

export default function UserDetailHeader({ user, onStatusChange, onDelete, saving }: UserDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line-soft)]">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-serif text-[var(--text-primary)]">{user.name}</h1>
          <Badge label={user.type} color={typeColors[user.type] || 'gray'} size="sm" />
          <Badge label={user.status} color={statusColors[user.status] || 'gray'} size="sm" />
        </div>
        <p className="text-sm text-[var(--text-muted)] font-sans">{user.email}</p>
      </div>

      <div className="flex items-end gap-3">
        <div className="w-36">
          <Select
            size="sm"
            options={statusOptions}
            value={user.status}
            onChange={(e) => onStatusChange(e.target.value as 'active' | 'inactive' | 'suspended')}
            disabled={saving}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/5"
          icon={<Trash2 size={14} />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
