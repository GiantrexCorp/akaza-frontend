'use client';

import { Badge } from '@/components/ui';
import type { Lead, LeadStatus, LeadSource } from '@/types/customer';

interface LeadTableProps {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
}

const statusColors: Record<LeadStatus, 'blue' | 'yellow' | 'orange' | 'green' | 'gray'> = {
  new: 'blue',
  contacted: 'yellow',
  qualified: 'orange',
  converted: 'green',
  lost: 'gray',
};

const sourceColors: Record<LeadSource, 'blue' | 'green' | 'purple' | 'orange' | 'gray'> = {
  hotel_booking: 'blue',
  tour_booking: 'green',
  transfer_booking: 'purple',
  website: 'orange',
  manual: 'gray',
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

export default function LeadTable({ leads, onRowClick }: LeadTableProps) {
  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Name / Email
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Phone
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Source
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Status
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => onRowClick(lead)}
              className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{lead.name}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{lead.email}</p>
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-secondary)] font-sans">
                {lead.phone || '—'}
              </td>
              <td className="px-4 py-4">
                <Badge label={lead.source_label} color={sourceColors[lead.source] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4">
                <Badge label={lead.status_label} color={statusColors[lead.status] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                {formatRelativeTime(lead.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
