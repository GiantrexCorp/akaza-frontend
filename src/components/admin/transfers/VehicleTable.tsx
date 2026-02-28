'use client';

import { useRouter } from 'next/navigation';
import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { AdminTransferVehicle, VehicleType } from '@/types/transfer';

import { ACTIVE_STATUS_COLORS } from '@/lib/constants';

interface VehicleTableProps {
  vehicles: AdminTransferVehicle[];
}
const typeColors: Record<VehicleType, 'yellow' | 'blue' | 'green' | 'purple' | 'red'> = {
  sedan: 'yellow',
  suv: 'blue',
  van: 'green',
  minibus: 'purple',
  limousine: 'red',
};

export default function VehicleTable({ vehicles }: VehicleTableProps) {
  const router = useRouter();

  const columns: Column<AdminTransferVehicle>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (vehicle) => (
        <p className="text-sm font-serif text-[var(--text-primary)]">{vehicle.translated_name}</p>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (vehicle) => (
        <Badge label={vehicle.type_label} color={typeColors[vehicle.type] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'maxPax',
      header: 'Max Pax',
      render: (vehicle) => (
        <span className="text-sm text-[var(--text-secondary)] font-sans">{vehicle.max_passengers}</span>
      ),
    },
    {
      key: 'maxLuggage',
      header: 'Max Luggage',
      render: (vehicle) => (
        <span className="text-sm text-[var(--text-secondary)] font-sans">{vehicle.max_luggage}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (vehicle) => (
        <Badge label={vehicle.status === 'active' ? 'Active' : 'Inactive'} color={ACTIVE_STATUS_COLORS[vehicle.status] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'updated',
      header: 'Updated',
      render: (vehicle) => (
        <span className="text-xs text-[var(--text-muted)] font-sans">
          {formatRelativeTime(vehicle.updated_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={vehicles}
      keyExtractor={(vehicle) => vehicle.id}
      onRowClick={(vehicle) => router.push(`/admin/transfers/vehicles/${vehicle.id}`)}
    />
  );
}
