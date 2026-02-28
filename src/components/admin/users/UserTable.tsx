'use client';

import { useRouter } from 'next/navigation';
import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { AdminUser } from '@/types/admin';

interface UserTableProps {
  users: AdminUser[];
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

export default function UserTable({ users }: UserTableProps) {
  const router = useRouter();

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'Name / Email',
      render: (user) => (
        <>
          <p className="text-sm font-serif text-[var(--text-primary)]">{user.name}</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{user.email}</p>
        </>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (user) => (
        <Badge label={user.type} color={typeColors[user.type] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.length > 0 ? (
            user.roles.map((role) => (
              <Badge key={role.id} label={role.name} color="orange" size="sm" />
            ))
          ) : (
            <span className="text-xs text-[var(--text-muted)] font-sans">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <Badge label={user.status} color={statusColors[user.status] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: (user) => (
        <span className="text-xs text-[var(--text-muted)] font-sans">
          {formatRelativeTime(user.last_active_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      keyExtractor={(user) => user.id}
      onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
    />
  );
}
