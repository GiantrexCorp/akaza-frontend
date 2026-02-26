'use client';

import { Badge } from '@/components/ui';
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

function formatRelativeTime(dateStr: string): string {
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

export default function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  return (
    <div>
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-4">Recent Bookings</h2>
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
                Amount
              </th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.booking_reference}
                className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-4 text-sm text-[var(--text-primary)] font-mono">
                  {booking.booking_reference}
                </td>
                <td className="px-4 py-4">
                  <Badge label={booking.type} color={typeColors[booking.type] || 'gray'} size="sm" />
                </td>
                <td className="px-4 py-4">
                  <Badge
                    label={booking.status.replace(/_/g, ' ')}
                    color={statusColors[booking.status] || 'gray'}
                    size="sm"
                  />
                </td>
                <td className="px-4 py-4 text-sm font-serif text-[var(--text-primary)]">
                  {booking.currency} {booking.total_price}
                </td>
                <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                  {formatRelativeTime(booking.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
