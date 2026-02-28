'use client';

import { Badge } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { HotelBookingStatusLog, HotelBookingStatus } from '@/types/hotel';

interface HotelBookingStatusLogsProps {
  logs: HotelBookingStatusLog[];
}

const statusColors: Record<HotelBookingStatus, 'yellow' | 'green' | 'red' | 'gray' | 'orange' | 'purple'> = {
  pending: 'yellow',
  confirmed: 'green',
  failed: 'red',
  cancelled: 'gray',
  pending_cancellation: 'orange',
  cancellation_failed: 'red',
  pending_reconciliation: 'purple',
};

function formatStatusLabel(status: HotelBookingStatus | null): string {
  if (!status) return '—';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function HotelBookingStatusLogs({ logs }: HotelBookingStatusLogsProps) {
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
                <Badge label={formatStatusLabel(log.from_status)} color={statusColors[log.from_status] || 'gray'} size="sm" />
              ) : (
                <span className="text-xs text-[var(--text-muted)] font-sans">—</span>
              )}
              <span className="text-xs text-[var(--text-muted)] font-sans">&rarr;</span>
              <Badge label={formatStatusLabel(log.to_status)} color={statusColors[log.to_status] || 'gray'} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-secondary)] font-sans">
                by {log.changed_by.name}
              </p>
              {log.reason && (
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5 truncate">{log.reason}</p>
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
