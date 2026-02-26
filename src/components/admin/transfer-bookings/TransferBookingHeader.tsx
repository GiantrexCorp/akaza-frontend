'use client';

import { Badge } from '@/components/ui';
import type { AdminTransferBooking, TransferBookingStatus } from '@/types/transfer';

interface TransferBookingHeaderProps {
  booking: AdminTransferBooking;
}

const statusColors: Record<TransferBookingStatus, 'yellow' | 'green' | 'gray' | 'blue' | 'red'> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'gray',
  completed: 'blue',
  no_show: 'red',
};

export default function TransferBookingHeader({ booking }: TransferBookingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-serif text-[var(--text-primary)]">
            {booking.pickup_location} &rarr; {booking.dropoff_location}
          </h1>
          <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} />
        </div>
        <p className="text-xs text-[var(--text-muted)] font-mono mt-2">
          Ref: {booking.booking_reference}
        </p>
        {booking.user && (
          <p className="text-xs text-[var(--text-secondary)] font-sans mt-1">
            Customer: {booking.user.name} ({booking.user.email})
          </p>
        )}
      </div>
    </div>
  );
}
