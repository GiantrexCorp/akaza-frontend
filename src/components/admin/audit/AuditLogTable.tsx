'use client';

import { Badge } from '@/components/ui';
import type { AuditLog, AuditAction } from '@/types/audit';

interface AuditLogTableProps {
  logs: AuditLog[];
  onRowClick: (log: AuditLog) => void;
}

const actionColors: Record<AuditAction, 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray'> = {
  created: 'green',
  login: 'green',
  updated: 'blue',
  settings_updated: 'blue',
  deleted: 'red',
  status_changed: 'yellow',
  reconciled: 'purple',
  role_assigned: 'purple',
  refunded: 'orange',
  markup_changed: 'orange',
  logout: 'gray',
  exported: 'gray',
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

export default function AuditLogTable({ logs, onRowClick }: AuditLogTableProps) {
  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Actor
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Action
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Entity
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Description
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              IP Address
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              When
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              onClick={() => onRowClick(log)}
              className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{log.user_name}</p>
              </td>
              <td className="px-4 py-4">
                <Badge label={log.action_label} color={actionColors[log.action] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-[var(--text-primary)] font-sans">{log.entity_type_label}</p>
                {log.entity_id && (
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">#{log.entity_id}</p>
                )}
              </td>
              <td className="px-4 py-4 max-w-[260px]">
                <p className="text-xs text-[var(--text-secondary)] font-sans truncate">{log.description}</p>
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-mono">
                {log.ip_address || '—'}
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                {formatRelativeTime(log.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
