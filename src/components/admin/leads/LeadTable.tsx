'use client';

import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { Lead, LeadSource } from '@/types/customer';

import { LEAD_STATUS_COLORS } from '@/lib/constants';

interface LeadTableProps {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
}
const sourceColors: Record<LeadSource, 'blue' | 'green' | 'purple' | 'orange' | 'gray'> = {
  hotel_booking: 'blue',
  tour_booking: 'green',
  transfer_booking: 'purple',
  website: 'orange',
  manual: 'gray',
};

export default function LeadTable({ leads, onRowClick }: LeadTableProps) {
  const columns: Column<Lead>[] = [
    {
      key: 'name',
      header: 'Name / Email',
      render: (lead) => (
        <>
          <p className="text-sm font-serif text-[var(--text-primary)]">{lead.name}</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{lead.email}</p>
        </>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (lead) => (
        <span className="text-xs text-[var(--text-secondary)] font-sans">
          {lead.phone || '—'}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      render: (lead) => (
        <Badge label={lead.source_label} color={sourceColors[lead.source] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => (
        <Badge label={lead.status_label} color={LEAD_STATUS_COLORS[lead.status] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'created',
      header: 'Created',
      render: (lead) => (
        <span className="text-xs text-[var(--text-muted)] font-sans">
          {formatRelativeTime(lead.created_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={leads}
      keyExtractor={(lead) => lead.id}
      onRowClick={onRowClick}
    />
  );
}
