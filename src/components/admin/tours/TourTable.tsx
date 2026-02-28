'use client';

import { useRouter } from 'next/navigation';
import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { AdminTour } from '@/types/tour';

import { TOUR_STATUS_COLORS } from '@/lib/constants';

interface TourTableProps {
  tours: AdminTour[];
}
export default function TourTable({ tours }: TourTableProps) {
  const router = useRouter();

  const columns: Column<AdminTour>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (tour) => (
        <>
          <p className="text-sm font-serif text-[var(--text-primary)]">{tour.translated_title}</p>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">{tour.slug}</p>
        </>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (tour) => (
        <span className="text-xs text-[var(--text-secondary)] font-sans">{tour.location}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (tour) => (
        <p className="text-sm font-serif text-[var(--text-primary)]">{tour.formatted_price}</p>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (tour) => (
        <span className="text-sm text-[var(--text-secondary)] font-sans">{tour.max_capacity}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tour) => (
        <Badge label={tour.status_label} color={TOUR_STATUS_COLORS[tour.status] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'updated',
      header: 'Updated',
      render: (tour) => (
        <span className="text-xs text-[var(--text-muted)] font-sans">
          {formatRelativeTime(tour.updated_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tours}
      keyExtractor={(tour) => tour.id}
      onRowClick={(tour) => router.push(`/admin/tours/${tour.id}`)}
    />
  );
}
