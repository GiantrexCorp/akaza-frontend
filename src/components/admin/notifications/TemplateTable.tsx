'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui';
import type { NotificationTemplate, NotificationChannel } from '@/types/admin-notification';

interface TemplateTableProps {
  templates: NotificationTemplate[];
}

const channelColors: Record<NotificationChannel, 'blue' | 'purple'> = {
  mail: 'blue',
  database: 'purple',
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

export default function TemplateTable({ templates }: TemplateTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Type
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Channel
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Active
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Locales
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr
              key={template.id}
              onClick={() => router.push(`/admin/notifications/templates/${template.id}`)}
              className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{template.type_label}</p>
              </td>
              <td className="px-4 py-4">
                <Badge label={template.channel_label} color={channelColors[template.channel] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4">
                <Badge
                  label={template.is_active ? 'Active' : 'Inactive'}
                  color={template.is_active ? 'green' : 'gray'}
                  size="sm"
                />
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-secondary)] font-sans">
                {Object.keys(template.subject).join(', ')}
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                {formatRelativeTime(template.updated_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
