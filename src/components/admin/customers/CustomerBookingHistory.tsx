'use client';

import { useState, useEffect, useCallback } from 'react';
import { Receipt } from 'lucide-react';
import { Badge, Spinner, EmptyState } from '@/components/ui';
import { adminCustomersApi } from '@/lib/api/admin-customers';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { BookingHistoryItem, BookingType } from '@/types/customer';

interface CustomerBookingHistoryProps {
  customerId: number;
}

const bookingTypeColors: Record<BookingType, 'blue' | 'green' | 'purple'> = {
  hotel: 'blue',
  tour: 'green',
  transfer: 'purple',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function CustomerBookingHistory({ customerId }: CustomerBookingHistoryProps) {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCustomersApi.bookingHistory(customerId);
      setBookings(data);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load booking history');
      }
    } finally {
      setLoading(false);
    }
  }, [customerId, toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={<Receipt size={48} strokeWidth={1} />}
        title="No Booking History"
        description="This customer has no bookings yet."
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-6">Booking History</h2>
      <div className="overflow-x-auto border border-[var(--line-soft)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--line-soft)]">
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                Reference
              </th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                Type
              </th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                Status
              </th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                Total
              </th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={`${booking.type}-${booking.id}`}
                className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-4">
                  <span className="text-xs font-mono text-[var(--text-primary)]">{booking.booking_reference}</span>
                </td>
                <td className="px-4 py-4">
                  <Badge label={booking.type} color={bookingTypeColors[booking.type] || 'gray'} size="sm" />
                </td>
                <td className="px-4 py-4">
                  <Badge label={booking.status} color="gray" size="sm" />
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-serif text-[var(--text-primary)]">
                    {booking.total_price.toLocaleString()} {booking.currency}
                  </span>
                </td>
                <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                  {formatDate(booking.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
