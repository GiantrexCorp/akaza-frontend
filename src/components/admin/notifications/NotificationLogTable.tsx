'use client';

import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { AdminNotificationLog, NotificationChannel } from '@/types/admin-notification';

import { NOTIFICATION_STATUS_COLORS } from '@/lib/constants';

interface NotificationLogTableProps {
  logs: AdminNotificationLog[];
  onRowClick: (log: AdminNotificationLog) => void;
}

const channelColors: Record<NotificationChannel, 'blue' | 'purple'> = {
  mail: 'blue',
  database: 'purple',
};
const columns: Column<AdminNotificationLog>[] = [
  {
    key: 'recipient',
    header: 'Recipient',
    render: (log) => (
      <>
        <p className="text-sm font-serif text-[var(--text-primary)]">
          {log.recipient_email || '—'}
        </p>
        {log.user && (
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{log.user.name}</p>
        )}
      </>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    render: (log) => (
      <p className="text-xs text-[var(--text-secondary)] font-sans">{log.type_label}</p>
    ),
  },
  {
    key: 'channel',
    header: 'Channel',
    render: (log) => (
      <Badge label={log.channel_label || log.channel} color={channelColors[log.channel] || 'gray'} size="sm" />
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (log) => (
      <Badge label={log.status_label} color={NOTIFICATION_STATUS_COLORS[log.status] || 'gray'} size="sm" />
    ),
  },
  {
    key: 'sent_at',
    header: 'Sent At',
    render: (log) => (
      <span className="text-xs text-[var(--text-muted)] font-sans">{formatRelativeTime(log.sent_at, '—')}</span>
    ),
  },
];

export default function NotificationLogTable({ logs, onRowClick }: NotificationLogTableProps) {
  return (
    <DataTable
      columns={columns}
      data={logs}
      keyExtractor={(log) => log.id}
      onRowClick={onRowClick}
    />
  );
}
