'use client';

import type { AdminTransferBooking } from '@/types/transfer';

interface TransferBookingInfoProps {
  booking: AdminTransferBooking;
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans shrink-0">{label}</p>
      <p className="text-sm text-[var(--text-primary)] font-sans text-right">{value ?? '—'}</p>
    </div>
  );
}

export default function TransferBookingInfo({ booking }: TransferBookingInfoProps) {
  return (
    <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
      {/* Route */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Route</h3>
        <InfoRow label="Pickup" value={booking.pickup_location} />
        <InfoRow label="Dropoff" value={booking.dropoff_location} />
        <InfoRow label="Route" value={booking.route ? `${booking.route.pickup_name} → ${booking.route.dropoff_name}` : undefined} />
        <InfoRow label="Transfer Type" value={booking.transfer_type} />
      </div>

      {/* Vehicle */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Vehicle</h3>
        <InfoRow label="Vehicle" value={booking.vehicle?.name} />
        <InfoRow label="Type" value={booking.vehicle?.type_label} />
      </div>

      {/* Trip */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Trip Details</h3>
        <InfoRow label="Pickup Date" value={booking.pickup_date} />
        <InfoRow label="Pickup Time" value={booking.pickup_time} />
        <InfoRow label="Passengers" value={booking.passengers} />
        <InfoRow label="Luggage" value={booking.luggage_count} />
        {booking.flight_number && <InfoRow label="Flight" value={booking.flight_number} />}
        {booking.special_requests && <InfoRow label="Special Requests" value={booking.special_requests} />}
      </div>

      {/* Contact */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Contact</h3>
        <InfoRow label="Name" value={booking.contact_name} />
        <InfoRow label="Email" value={booking.contact_email} />
        <InfoRow label="Phone" value={booking.contact_phone} />
      </div>

      {/* Pricing */}
      <div className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans mb-4">Pricing</h3>
        <div className="flex justify-between items-start gap-4 pt-2 border-t border-[var(--line-soft)]">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans shrink-0">Total</p>
          <p className="text-lg font-serif text-[var(--text-primary)] text-right">
            {booking.formatted_price || `${booking.price} ${booking.currency}`}
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
