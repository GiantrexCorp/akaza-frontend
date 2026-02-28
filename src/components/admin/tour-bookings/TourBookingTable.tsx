'use client';

import { useRouter } from 'next/navigation';
import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { AdminTourBooking, TourBookingStatus } from '@/types/tour';

interface TourBookingTableProps {
  bookings: AdminTourBooking[];
}

const statusColors: Record<TourBookingStatus, 'yellow' | 'green' | 'gray' | 'blue' | 'red'> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'gray',
  completed: 'blue',
  no_show: 'red',
};

export default function TourBookingTable({ bookings }: TourBookingTableProps) {
  const router = useRouter();

  const columns: Column<AdminTourBooking>[] = [
    {
      key: 'reference',
      header: 'Reference',
      render: (booking) => (
        <p className="text-xs text-[var(--text-primary)] font-mono">{booking.booking_reference}</p>
      ),
    },
    {
      key: 'tour',
      header: 'Tour',
      render: (booking) => (
        <p className="text-sm font-serif text-[var(--text-primary)]">{booking.tour?.translated_title || '—'}</p>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (booking) => (
        <>
          <p className="text-sm font-serif text-[var(--text-primary)]">{booking.contact_name}</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{booking.contact_email}</p>
        </>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (booking) => (
        <span className="text-xs text-[var(--text-secondary)] font-sans">{booking.tour_date}</span>
      ),
    },
    {
      key: 'guests',
      header: 'Guests',
      render: (booking) => (
        <span className="text-sm text-[var(--text-secondary)] font-sans">{booking.number_of_guests}</span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (booking) => (
        <p className="text-sm font-serif text-[var(--text-primary)]">
          {booking.formatted_total_price || `${booking.total_price} ${booking.currency}`}
        </p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (booking) => (
        <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'created',
      header: 'Created',
      render: (booking) => (
        <span className="text-xs text-[var(--text-muted)] font-sans">
          {formatRelativeTime(booking.created_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={bookings}
      keyExtractor={(booking) => booking.id}
      onRowClick={(booking) => router.push(`/admin/bookings/tours/${booking.id}`)}
    />
  );
}
