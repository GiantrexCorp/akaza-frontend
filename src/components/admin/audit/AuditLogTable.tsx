'use client';

import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
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

const columns: Column<AuditLog>[] = [
  {
    key: 'actor',
    header: 'Actor',
    render: (log) => (
      <p className="text-sm font-serif text-[var(--text-primary)]">{log.user_name}</p>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    render: (log) => (
      <Badge label={log.action_label} color={actionColors[log.action] || 'gray'} size="sm" />
    ),
  },
  {
    key: 'entity',
    header: 'Entity',
    render: (log) => (
      <>
        <p className="text-sm text-[var(--text-primary)] font-sans">{log.entity_type_label}</p>
        {log.entity_id && (
          <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">#{log.entity_id}</p>
        )}
      </>
    ),
  },
  {
    key: 'description',
    header: 'Description',
    className: 'max-w-[260px]',
    render: (log) => (
      <p className="text-xs text-[var(--text-secondary)] font-sans truncate">{log.description}</p>
    ),
  },
  {
    key: 'ip_address',
    header: 'IP Address',
    render: (log) => (
      <span className="text-xs text-[var(--text-muted)] font-mono">{log.ip_address || '—'}</span>
    ),
  },
  {
    key: 'when',
    header: 'When',
    render: (log) => (
      <span className="text-xs text-[var(--text-muted)] font-sans">{formatRelativeTime(log.created_at)}</span>
    ),
  },
];

export default function AuditLogTable({ logs, onRowClick }: AuditLogTableProps) {
  return (
    <DataTable
      columns={columns}
      data={logs}
      keyExtractor={(log) => log.id}
      onRowClick={onRowClick}
    />
  );
}
