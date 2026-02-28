'use client';

import { useRouter } from 'next/navigation';
import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { AdminTransferBooking, TransferBookingStatus } from '@/types/transfer';

interface TransferBookingTableProps {
  bookings: AdminTransferBooking[];
}

const statusColors: Record<TransferBookingStatus, 'yellow' | 'green' | 'gray' | 'blue' | 'red'> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'gray',
  completed: 'blue',
  no_show: 'red',
};

export default function TransferBookingTable({ bookings }: TransferBookingTableProps) {
  const router = useRouter();

  const columns: Column<AdminTransferBooking>[] = [
    {
      key: 'reference',
      header: 'Reference',
      render: (booking) => (
        <p className="text-xs text-[var(--text-primary)] font-mono">{booking.booking_reference}</p>
      ),
    },
    {
      key: 'route',
      header: 'Route',
      render: (booking) => (
        <p className="text-sm font-serif text-[var(--text-primary)]">
          {booking.pickup_location} &rarr; {booking.dropoff_location}
        </p>
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
      key: 'dateTime',
      header: 'Date / Time',
      render: (booking) => (
        <>
          <p className="text-xs text-[var(--text-secondary)] font-sans">{booking.pickup_date}</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{booking.pickup_time}</p>
        </>
      ),
    },
    {
      key: 'pax',
      header: 'Pax',
      render: (booking) => (
        <span className="text-sm text-[var(--text-secondary)] font-sans">{booking.passengers}</span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (booking) => (
        <p className="text-sm font-serif text-[var(--text-primary)]">{booking.formatted_price}</p>
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
      onRowClick={(booking) => router.push(`/admin/bookings/transfers/${booking.id}`)}
    />
  );
}
