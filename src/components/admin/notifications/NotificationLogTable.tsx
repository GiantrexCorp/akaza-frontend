'use client';

import { Badge } from '@/components/ui';
import type { AdminNotificationLog, NotificationChannel, NotificationLogStatus } from '@/types/admin-notification';

interface NotificationLogTableProps {
  logs: AdminNotificationLog[];
  onRowClick: (log: AdminNotificationLog) => void;
}

const channelColors: Record<NotificationChannel, 'blue' | 'purple'> = {
  mail: 'blue',
  database: 'purple',
};

const statusColors: Record<NotificationLogStatus, 'yellow' | 'green' | 'red'> = {
  pending: 'yellow',
  sent: 'green',
  failed: 'red',
};

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '—';
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

export default function NotificationLogTable({ logs, onRowClick }: NotificationLogTableProps) {
  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Recipient
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Type
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Channel
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Status
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Sent At
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
                <p className="text-sm font-serif text-[var(--text-primary)]">
                  {log.recipient_email || '—'}
                </p>
                {log.user && (
                  <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{log.user.name}</p>
                )}
              </td>
              <td className="px-4 py-4">
                <p className="text-xs text-[var(--text-secondary)] font-sans">{log.type_label}</p>
              </td>
              <td className="px-4 py-4">
                <Badge label={log.channel_label || log.channel} color={channelColors[log.channel] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4">
                <Badge label={log.status_label} color={statusColors[log.status] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                {formatRelativeTime(log.sent_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
