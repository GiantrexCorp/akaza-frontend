'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui';
import { adminNotificationsApi } from '@/lib/api/admin-notifications';
import type { AdminNotificationLog, NotificationChannel } from '@/types/admin-notification';

import { NOTIFICATION_STATUS_COLORS } from '@/lib/constants';

interface NotificationLogDetailProps {
  log: AdminNotificationLog | null;
  onClose: () => void;
}

const channelColors: Record<NotificationChannel, 'blue' | 'purple'> = {
  mail: 'blue',
  database: 'purple',
};
function formatTimestamp(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function NotificationLogDetail({ log, onClose }: NotificationLogDetailProps) {
  const [enrichedLog, setEnrichedLog] = useState<AdminNotificationLog | null>(null);

  useEffect(() => {
    if (!log) return;
    let active = true;
    adminNotificationsApi.getLog(log.id).then((data) => {
      if (active) setEnrichedLog(data);
    }).catch(() => {});
    return () => { active = false; };
  }, [log]);

  useEffect(() => {
    if (!log) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [log, onClose]);

  if (!log) return null;

  const display = (enrichedLog && enrichedLog.id === log?.id) ? enrichedLog : log;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-[560px] bg-[var(--surface-card)] border-l border-[var(--line-soft)] z-50 flex flex-col animate-slide-in-right">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line-soft)] shrink-0">
          <h2 className="text-lg font-serif text-[var(--text-primary)]">Notification Log</h2>
          <button
            onClick={onClose}
            className="p-3 text-[var(--text-muted)] hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Status + Type + Channel badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge label={display.status_label} color={NOTIFICATION_STATUS_COLORS[display.status] || 'gray'} />
              <Badge label={display.type_label} color="blue" />
              <Badge label={display.channel_label || display.channel} color={channelColors[display.channel] || 'gray'} />
            </div>
            <p className="text-sm text-[var(--text-primary)] font-sans">{display.subject}</p>
            <p className="text-xs text-[var(--text-muted)] font-sans">{formatTimestamp(display.created_at)}</p>
          </div>

          {/* Details grid */}
          <div className="space-y-1">
            <h3 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
              Details
            </h3>
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4">
              <span className="text-xs text-[var(--text-muted)] font-sans">Recipient</span>
              <span className="text-xs text-[var(--text-primary)] font-sans">
                {display.recipient_email || '—'}
              </span>

              <span className="text-xs text-[var(--text-muted)] font-sans">User</span>
              <span className="text-xs text-[var(--text-primary)] font-sans">
                {display.user ? (
                  <>
                    {display.user.name}
                    <span className="text-[var(--text-muted)] ml-1">({display.user.email})</span>
                  </>
                ) : display.user_id ? (
                  <span className="font-mono">#{display.user_id}</span>
                ) : (
                  '—'
                )}
              </span>

              <span className="text-xs text-[var(--text-muted)] font-sans">Channel</span>
              <span className="text-xs text-[var(--text-primary)] font-sans">
                {display.channel_label || display.channel}
              </span>

              <span className="text-xs text-[var(--text-muted)] font-sans">Sent At</span>
              <span className="text-xs text-[var(--text-primary)] font-sans">
                {display.sent_at ? formatTimestamp(display.sent_at) : '—'}
              </span>

              <span className="text-xs text-[var(--text-muted)] font-sans">Created At</span>
              <span className="text-xs text-[var(--text-primary)] font-sans">
                {formatTimestamp(display.created_at)}
              </span>
            </div>
          </div>

          {/* Error message */}
          {display.error_message && (
            <div>
              <h3 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
                Error
              </h3>
              <div className="border-l-2 border-red-500/40 bg-red-500/5 px-4 py-3">
                <p className="text-xs text-red-400 font-mono whitespace-pre-wrap break-all">
                  {display.error_message}
                </p>
              </div>
            </div>
          )}

          {/* Metadata JSON */}
          {display.metadata && Object.keys(display.metadata).length > 0 && (
            <div>
              <h3 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
                Metadata
              </h3>
              <pre className="font-mono text-xs text-[var(--text-secondary)] bg-black/20 border border-[var(--line-soft)] p-4 overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(display.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
