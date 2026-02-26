'use client';

import { Hotel, Ship, Car } from 'lucide-react';
import type { BookingStatusSummary, BookingStatusCounts } from '@/types/finance';

interface ReportStatusSummaryProps {
  summary: BookingStatusSummary;
}

const serviceConfig = [
  { key: 'hotel' as const, label: 'Hotels', icon: Hotel },
  { key: 'tour' as const, label: 'Tours', icon: Ship },
  { key: 'transfer' as const, label: 'Transfers', icon: Car },
];

function StatusCard({ label, icon: Icon, counts }: { label: string; icon: typeof Hotel; counts: BookingStatusCounts }) {
  const entries = Object.entries(counts).filter(([, v]) => v > 0);

  return (
    <div className="border border-[var(--line-soft)] bg-[var(--surface-card)] p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon size={18} className="text-primary" />
        <h3 className="text-sm font-serif text-[var(--text-primary)]">{label}</h3>
      </div>
      {entries.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] font-sans">No bookings</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([status, count]) => (
            <div key={status} className="flex justify-between items-center">
              <span className="text-xs text-[var(--text-secondary)] font-sans capitalize">
                {status.replace(/_/g, ' ')}
              </span>
              <span className="text-sm font-serif text-[var(--text-primary)]">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportStatusSummary({ summary }: ReportStatusSummaryProps) {
  return (
    <div>
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-4">Booking Status Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceConfig.map((svc) => (
          <StatusCard
            key={svc.key}
            label={svc.label}
            icon={svc.icon}
            counts={summary[svc.key]}
          />
        ))}
      </div>
    </div>
  );
}
