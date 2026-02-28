'use client';

import { useRouter } from 'next/navigation';
import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime, formatPrice } from '@/lib/utils/format';
import type { AdminHotelBooking, HotelBookingStatus } from '@/types/hotel';

interface HotelBookingTableProps {
  bookings: AdminHotelBooking[];
}

const statusColors: Record<HotelBookingStatus, 'yellow' | 'green' | 'red' | 'gray' | 'orange' | 'purple'> = {
  pending: 'yellow',
  confirmed: 'green',
  failed: 'red',
  cancelled: 'gray',
  pending_cancellation: 'orange',
  cancellation_failed: 'red',
  pending_reconciliation: 'purple',
};

export default function HotelBookingTable({ bookings }: HotelBookingTableProps) {
  const router = useRouter();

  const columns: Column<AdminHotelBooking>[] = [
    {
      key: 'reference',
      header: 'Reference',
      render: (booking) => (
        <p className="text-xs text-[var(--text-primary)] font-mono">{booking.booking_reference}</p>
      ),
    },
    {
      key: 'hotel',
      header: 'Hotel',
      render: (booking) => (
        <p className="text-sm font-serif text-[var(--text-primary)]">{booking.hotel_name}</p>
      ),
    },
    {
      key: 'holder',
      header: 'Holder',
      render: (booking) => (
        <>
          <p className="text-sm font-serif text-[var(--text-primary)]">{booking.holder_name}</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{booking.holder_email}</p>
        </>
      ),
    },
    {
      key: 'dates',
      header: 'Check-in / Out',
      render: (booking) => (
        <>
          <p className="text-xs text-[var(--text-secondary)] font-sans">{booking.check_in}</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{booking.check_out}</p>
        </>
      ),
    },
    {
      key: 'rooms',
      header: 'Rooms',
      render: (booking) => (
        <span className="text-sm text-[var(--text-secondary)] font-sans">{booking.total_rooms}</span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (booking) => (
        <p className="text-sm font-serif text-[var(--text-primary)]">
          {formatPrice(booking.selling_price, booking.currency)}
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
      key: 'date',
      header: 'Date',
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
      onRowClick={(booking) => router.push(`/admin/bookings/hotels/${booking.id}`)}
    />
  );
}
