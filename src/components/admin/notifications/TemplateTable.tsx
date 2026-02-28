'use client';

import { useRouter } from 'next/navigation';
import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { NotificationTemplate, NotificationChannel } from '@/types/admin-notification';

interface TemplateTableProps {
  templates: NotificationTemplate[];
}

const channelColors: Record<NotificationChannel, 'blue' | 'purple'> = {
  mail: 'blue',
  database: 'purple',
};

const columns: Column<NotificationTemplate>[] = [
  {
    key: 'type',
    header: 'Type',
    render: (template) => (
      <p className="text-sm font-serif text-[var(--text-primary)]">{template.type_label}</p>
    ),
  },
  {
    key: 'channel',
    header: 'Channel',
    render: (template) => (
      <Badge label={template.channel_label} color={channelColors[template.channel] || 'gray'} size="sm" />
    ),
  },
  {
    key: 'active',
    header: 'Active',
    render: (template) => (
      <Badge
        label={template.is_active ? 'Active' : 'Inactive'}
        color={template.is_active ? 'green' : 'gray'}
        size="sm"
      />
    ),
  },
  {
    key: 'locales',
    header: 'Locales',
    render: (template) => (
      <span className="text-xs text-[var(--text-secondary)] font-sans">
        {Object.keys(template.subject).join(', ')}
      </span>
    ),
  },
  {
    key: 'updated',
    header: 'Updated',
    render: (template) => (
      <span className="text-xs text-[var(--text-muted)] font-sans">{formatRelativeTime(template.updated_at)}</span>
    ),
  },
];

export default function TemplateTable({ templates }: TemplateTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={templates}
      keyExtractor={(template) => template.id}
      onRowClick={(template) => router.push(`/admin/notifications/templates/${template.id}`)}
    />
  );
}
