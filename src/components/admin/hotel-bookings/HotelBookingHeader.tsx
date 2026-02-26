'use client';

import { Badge } from '@/components/ui';
import type { AdminHotelBooking, HotelBookingStatus } from '@/types/hotel';

interface HotelBookingHeaderProps {
  booking: AdminHotelBooking;
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

export default function HotelBookingHeader({ booking }: HotelBookingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-serif text-[var(--text-primary)]">{booking.hotel_name}</h1>
          <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} />
        </div>
        <p className="text-xs text-[var(--text-muted)] font-mono mt-2">
          Ref: {booking.booking_reference}
        </p>
        {booking.bedbank_booking_id && (
          <p className="text-xs text-[var(--text-muted)] font-sans mt-1">
            {booking.bedbank_provider} &middot; {booking.bedbank_booking_id}
          </p>
        )}
        {booking.user && (
          <p className="text-xs text-[var(--text-secondary)] font-sans mt-1">
            Customer: {booking.user.name} ({booking.user.email})
          </p>
        )}
      </div>
    </div>
  );
}
