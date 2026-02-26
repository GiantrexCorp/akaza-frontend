'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui';
import type { AdminTourBooking, TourBookingStatus } from '@/types/tour';

interface TourBookingTableProps {
  bookings: AdminTourBooking[];
}

const statusColors: Record<TourBookingStatus, 'yellow' | 'green' | 'gray' | 'blue' | 'red'> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'gray',
  completed: 'blue',
  no_show: 'red',
};

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

export default function TourBookingTable({ bookings }: TourBookingTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Reference</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Tour</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Contact</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Date</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Guests</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Total</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Status</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Created</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              onClick={() => router.push(`/admin/bookings/tours/${booking.id}`)}
              className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="px-4 py-4">
                <p className="text-xs text-[var(--text-primary)] font-mono">{booking.booking_reference}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{booking.tour?.translated_title || '—'}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{booking.contact_name}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{booking.contact_email}</p>
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-secondary)] font-sans">
                {booking.tour_date}
              </td>
              <td className="px-4 py-4 text-sm text-[var(--text-secondary)] font-sans">
                {booking.number_of_guests}
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">
                  {booking.formatted_total_price || `${booking.total_price} ${booking.currency}`}
                </p>
              </td>
              <td className="px-4 py-4">
                <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                {formatRelativeTime(booking.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
