'use client';

import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { RecentBookingItem, BookingServiceType } from '@/types/finance';

interface RecentBookingsTableProps {
  bookings: RecentBookingItem[];
}

const typeColors: Record<BookingServiceType, 'blue' | 'green' | 'purple'> = {
  hotel: 'blue',
  tour: 'green',
  transfer: 'purple',
};

const statusColors: Record<string, 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'orange'> = {
  confirmed: 'green',
  pending: 'yellow',
  cancelled: 'red',
  failed: 'red',
  completed: 'blue',
  no_show: 'orange',
  pending_reconciliation: 'yellow',
};

const columns: Column<RecentBookingItem>[] = [
  {
    key: 'reference',
    header: 'Reference',
    render: (booking) => (
      <span className="text-sm text-[var(--text-primary)] font-mono">{booking.booking_reference}</span>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    render: (booking) => (
      <Badge label={booking.type} color={typeColors[booking.type] || 'gray'} size="sm" />
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (booking) => (
      <Badge
        label={booking.status.replace(/_/g, ' ')}
        color={statusColors[booking.status] || 'gray'}
        size="sm"
      />
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (booking) => (
      <span className="text-sm font-serif text-[var(--text-primary)]">
        {booking.currency} {booking.total_price}
      </span>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    render: (booking) => (
      <span className="text-xs text-[var(--text-muted)] font-sans">{formatRelativeTime(booking.created_at)}</span>
    ),
  },
];

export default function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  return (
    <div>
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-4">Recent Bookings</h2>
      <DataTable
        columns={columns}
        data={bookings}
        keyExtractor={(booking) => booking.booking_reference}
      />
    </div>
  );
}
