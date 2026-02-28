'use client';

import { useRouter } from 'next/navigation';
import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { AdminTransferRoute, TransferType } from '@/types/transfer';

import { ACTIVE_STATUS_COLORS } from '@/lib/constants';

interface RouteTableProps {
  routes: AdminTransferRoute[];
}
const typeColors: Record<TransferType, 'blue' | 'yellow' | 'purple'> = {
  airport: 'blue',
  city: 'yellow',
  chauffeur: 'purple',
};

const columns: Column<AdminTransferRoute>[] = [
  {
    key: 'route',
    header: 'Route',
    render: (route) => (
      <p className="text-sm font-serif text-[var(--text-primary)]">
        {route.translated_pickup_name} &rarr; {route.translated_dropoff_name}
      </p>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    render: (route) => (
      <Badge label={route.transfer_type_label} color={typeColors[route.transfer_type] || 'gray'} size="sm" />
    ),
  },
  {
    key: 'prices',
    header: 'Prices',
    render: (route) => (
      <span className="text-sm text-[var(--text-secondary)] font-sans">{route.prices?.length || 0}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (route) => (
      <Badge label={route.status === 'active' ? 'Active' : 'Inactive'} color={ACTIVE_STATUS_COLORS[route.status] || 'gray'} size="sm" />
    ),
  },
  {
    key: 'updated',
    header: 'Updated',
    render: (route) => (
      <span className="text-xs text-[var(--text-muted)] font-sans">{formatRelativeTime(route.updated_at)}</span>
    ),
  },
];

export default function RouteTable({ routes }: RouteTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={routes}
      keyExtractor={(route) => route.id}
      onRowClick={(route) => router.push(`/admin/transfers/routes/${route.id}`)}
    />
  );
}
