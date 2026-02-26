'use client';

import { Badge } from '@/components/ui';
import type { StatusLog, TourBookingStatus } from '@/types/tour';

interface TourBookingStatusLogsProps {
  logs: StatusLog[];
}

const statusColors: Record<TourBookingStatus, 'yellow' | 'green' | 'gray' | 'blue' | 'red'> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'gray',
  completed: 'blue',
  no_show: 'red',
};

function formatStatusLabel(status: string | null): string {
  if (!status) return '—';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRelativeTime(dateStr: string): string {
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

export default function TourBookingStatusLogs({ logs }: TourBookingStatusLogsProps) {
  if (logs.length === 0) return null;

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--line-soft)]">
      <div className="px-6 py-4 border-b border-[var(--line-soft)]">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans">
          Status History ({logs.length})
        </h3>
      </div>
      <div className="divide-y divide-[var(--line-soft)]">
        {logs.map((log) => (
          <div key={log.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              {log.from_status ? (
                <Badge
                  label={formatStatusLabel(log.from_status)}
                  color={statusColors[log.from_status as TourBookingStatus] || 'gray'}
                  size="sm"
                />
              ) : (
                <span className="text-xs text-[var(--text-muted)] font-sans">—</span>
              )}
              <span className="text-xs text-[var(--text-muted)] font-sans">&rarr;</span>
              <Badge
                label={formatStatusLabel(log.to_status)}
                color={statusColors[log.to_status as TourBookingStatus] || 'gray'}
                size="sm"
              />
            </div>
            <div className="flex-1 min-w-0">
              {log.notes && (
                <p className="text-xs text-[var(--text-muted)] font-sans truncate">{log.notes}</p>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans shrink-0">
              {formatRelativeTime(log.created_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
