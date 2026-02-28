'use client';

import { Badge } from '@/components/ui';
import type { AdminTourBooking } from '@/types/tour';

import { SERVICE_BOOKING_STATUS_COLORS } from '@/lib/constants';

interface TourBookingHeaderProps {
  booking: AdminTourBooking;
}
export default function TourBookingHeader({ booking }: TourBookingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-serif text-[var(--text-primary)]">
            {booking.tour?.translated_title || 'Tour Booking'}
          </h1>
          <Badge label={booking.status_label} color={SERVICE_BOOKING_STATUS_COLORS[booking.status] || 'gray'} />
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
