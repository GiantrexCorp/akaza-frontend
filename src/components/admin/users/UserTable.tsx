'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui';
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

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

export default function UserTable({ users }: UserTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Name / Email
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Type
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Roles
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Status
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Last Active
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => router.push(`/admin/users/${user.id}`)}
              className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{user.name}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{user.email}</p>
              </td>
              <td className="px-4 py-4">
                <Badge label={user.type} color={typeColors[user.type] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-1">
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role.id} label={role.name} color="orange" size="sm" />
                    ))
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] font-sans">—</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge label={user.status} color={statusColors[user.status] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                {formatRelativeTime(user.last_active_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
