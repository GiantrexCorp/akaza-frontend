'use client';

import type { AdminTourBooking } from '@/types/tour';

interface TourBookingInfoProps {
  booking: AdminTourBooking;
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans shrink-0">{label}</p>
      <p className="text-sm text-[var(--text-primary)] font-sans text-right">{value ?? '—'}</p>
    </div>
  );
}

export default function TourBookingInfo({ booking }: TourBookingInfoProps) {
  return (
    <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
      {/* Tour */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Tour</h3>
        <InfoRow label="Tour" value={booking.tour?.translated_title} />
        <InfoRow label="Tour Date" value={booking.tour_date} />
        <InfoRow label="Guests" value={booking.number_of_guests} />
      </div>

      {/* Contact */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Contact</h3>
        <InfoRow label="Name" value={booking.contact_name} />
        <InfoRow label="Email" value={booking.contact_email} />
        <InfoRow label="Phone" value={booking.contact_phone} />
        {booking.special_requests && (
          <InfoRow label="Special Requests" value={booking.special_requests} />
        )}
      </div>

      {/* Guests */}
      {booking.guests && booking.guests.length > 0 && (
        <div className="p-6 space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Guests ({booking.guests.length})</h3>
          {booking.guests.map((guest, i) => (
            <div key={i} className="flex justify-between items-center gap-4">
              <p className="text-sm text-[var(--text-primary)] font-sans">
                {guest.name} {guest.surname}
              </p>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                {guest.type === 'AD' ? 'Adult' : 'Child'}{guest.age != null ? ` (${guest.age})` : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pricing */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Pricing</h3>
        <InfoRow label="Price / Person" value={`${booking.price_per_person} ${booking.currency}`} />
        <div className="flex justify-between items-start gap-4 pt-2 border-t border-[var(--line-soft)]">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans shrink-0">Total</p>
          <p className="text-lg font-serif text-[var(--text-primary)] text-right">
            {booking.formatted_total_price || `${booking.total_price} ${booking.currency}`}
          </p>
        </div>
      </div>

      {/* Cancellation */}
      {(booking.cancelled_at || booking.refund_amount) && (
        <div className="p-6 space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Cancellation</h3>
          {booking.cancelled_at && <InfoRow label="Cancelled At" value={booking.cancelled_at} />}
          {booking.cancellation_reason && <InfoRow label="Reason" value={booking.cancellation_reason} />}
          {booking.refund_amount && <InfoRow label="Refund" value={`${booking.refund_amount} ${booking.currency}`} />}
        </div>
      )}
    </div>
  );
}
