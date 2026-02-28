'use client';

import type { AdminHotelBooking } from '@/types/hotel';
import { formatPrice } from '@/lib/utils/format';

interface HotelBookingInfoProps {
  booking: AdminHotelBooking;
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans shrink-0">{label}</p>
      <p className="text-sm text-[var(--text-primary)] font-sans text-right">{value ?? '—'}</p>
    </div>
  );
}

export default function HotelBookingInfo({ booking }: HotelBookingInfoProps) {
  return (
    <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
      {/* Dates */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Dates</h3>
        <InfoRow label="Check-in" value={booking.check_in} />
        <InfoRow label="Check-out" value={booking.check_out} />
        <InfoRow label="Nights" value={booking.nights_count} />
      </div>

      {/* Hotel */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Hotel</h3>
        <InfoRow label="Name" value={booking.hotel_name} />
        <InfoRow label="Address" value={booking.hotel_address} />
        <InfoRow label="Phone" value={booking.hotel_phone} />
        <InfoRow label="Category" value={booking.hotel_category_name} />
        <InfoRow label="Destination" value={booking.destination_name} />
      </div>

      {/* Holder */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Holder</h3>
        <InfoRow label="Name" value={booking.holder_name} />
        <InfoRow label="Surname" value={booking.holder_surname} />
        <InfoRow label="Email" value={booking.holder_email} />
        <InfoRow label="Phone" value={booking.holder_phone} />
      </div>

      {/* Pricing */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Pricing</h3>
        <InfoRow label="Net Price" value={formatPrice(booking.net_price, booking.currency)} />
        <InfoRow label="Markup %" value={`${booking.markup_percentage}%`} />
        <InfoRow label="Markup Amount" value={formatPrice(booking.markup_amount, booking.currency)} />
        <div className="flex justify-between items-start gap-4 pt-2 border-t border-[var(--line-soft)]">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans shrink-0">Selling Price</p>
          <p className="text-lg font-serif text-[var(--text-primary)] text-right">
            {formatPrice(booking.selling_price, booking.currency)}
          </p>
        </div>
      </div>

      {/* Cancellation */}
      {(booking.cancellation_deadline || booking.cancelled_at || booking.refund_amount) && (
        <div className="p-6 space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Cancellation</h3>
          {booking.cancellation_deadline && (
            <InfoRow label="Deadline" value={booking.cancellation_deadline} />
          )}
          {booking.cancellation_policy && (
            <InfoRow label="Policy" value={booking.cancellation_policy} />
          )}
          {booking.cancelled_at && (
            <InfoRow label="Cancelled At" value={booking.cancelled_at} />
          )}
          {booking.cancellation_reason && (
            <InfoRow label="Reason" value={booking.cancellation_reason} />
          )}
          {booking.refund_amount != null && (
            <InfoRow label="Refund Amount" value={formatPrice(booking.refund_amount, booking.currency)} />
          )}
        </div>
      )}
    </div>
  );
}
