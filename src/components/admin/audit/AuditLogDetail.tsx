'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui';
import { adminAuditApi } from '@/lib/api/admin-audit';
import type { AuditLog, AuditAction } from '@/types/audit';

interface AuditLogDetailProps {
  log: AuditLog | null;
  onClose: () => void;
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

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function formatTimestamp(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function AuditLogDetail({ log, onClose }: AuditLogDetailProps) {
  const [fullLog, setFullLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    if (!log) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting on prop change
      setFullLog(null);
      return;
    }
     
    setFullLog(log);
    adminAuditApi.get(log.id).then(setFullLog).catch(() => {});
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

  const display = fullLog || log;
  const hasChanges = display.old_values || display.new_values;
  const changeKeys = hasChanges
    ? [...new Set([
        ...Object.keys(display.old_values || {}),
        ...Object.keys(display.new_values || {}),
      ])]
    : [];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-[560px] bg-[var(--surface-card)] border-l border-[var(--line-soft)] z-50 flex flex-col animate-slide-in-right">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line-soft)] shrink-0">
          <h2 className="text-lg font-serif text-[var(--text-primary)]">Audit Entry</h2>
          <button
            onClick={onClose}
            className="p-3 text-[var(--text-muted)] hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Action + Entity + Description */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge label={display.action_label} color={actionColors[display.action] || 'gray'} />
              <Badge label={display.entity_type_label} color="blue" />
            </div>
            <p className="text-sm text-[var(--text-primary)] font-sans">{display.description}</p>
            <p className="text-xs text-[var(--text-muted)] font-sans">{formatTimestamp(display.created_at)}</p>
          </div>

          {/* Metadata grid */}
          <div className="space-y-1">
            <h3 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
              Details
            </h3>
            <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4">
              <span className="text-xs text-[var(--text-muted)] font-sans">Actor</span>
              <span className="text-xs text-[var(--text-primary)] font-sans">
                {display.user_name}
                {display.user && (
                  <span className="text-[var(--text-muted)] ml-1">({display.user.email})</span>
                )}
              </span>

              <span className="text-xs text-[var(--text-muted)] font-sans">User ID</span>
              <span className="text-xs text-[var(--text-primary)] font-mono">{display.user_id ?? '—'}</span>

              <span className="text-xs text-[var(--text-muted)] font-sans">Entity</span>
              <span className="text-xs text-[var(--text-primary)] font-sans">
                {display.entity_type_label}
                {display.entity_id && <span className="font-mono ml-1">#{display.entity_id}</span>}
              </span>

              <span className="text-xs text-[var(--text-muted)] font-sans">IP Address</span>
              <span className="text-xs text-[var(--text-primary)] font-mono">{display.ip_address || '—'}</span>

              <span className="text-xs text-[var(--text-muted)] font-sans">User Agent</span>
              <span className="text-xs text-[var(--text-primary)] font-mono truncate" title={display.user_agent || undefined}>
                {display.user_agent || '—'}
              </span>
            </div>
          </div>

          {/* Changes diff */}
          {hasChanges && changeKeys.length > 0 && (
            <div>
              <h3 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
                Changes
              </h3>
              <div className="space-y-3">
                {changeKeys.map((key) => {
                  const oldVal = display.old_values?.[key];
                  const newVal = display.new_values?.[key];
                  return (
                    <div key={key} className="space-y-1">
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-sans">
                        {key}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Old value */}
                        <div className="border-l-2 border-red-500/40 bg-red-500/5 px-3 py-2">
                          <p className="text-[9px] text-red-400 font-sans font-bold uppercase tracking-wider mb-1">Old</p>
                          <pre className="font-mono text-xs text-[var(--text-secondary)] whitespace-pre-wrap break-all">
                            {formatValue(oldVal)}
                          </pre>
                        </div>
                        {/* New value */}
                        <div className="border-l-2 border-emerald-500/40 bg-emerald-500/5 px-3 py-2">
                          <p className="text-[9px] text-emerald-400 font-sans font-bold uppercase tracking-wider mb-1">New</p>
                          <pre className="font-mono text-xs text-[var(--text-secondary)] whitespace-pre-wrap break-all">
                            {formatValue(newVal)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Raw metadata */}
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
