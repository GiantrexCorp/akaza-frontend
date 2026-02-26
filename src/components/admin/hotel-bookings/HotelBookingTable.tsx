'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui';
import type { AdminHotelBooking, HotelBookingStatus } from '@/types/hotel';

interface HotelBookingTableProps {
  bookings: AdminHotelBooking[];
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

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

export default function HotelBookingTable({ bookings }: HotelBookingTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Reference
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Hotel
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Holder
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Check-in / Out
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Rooms
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Total
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Status
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              onClick={() => router.push(`/admin/bookings/hotels/${booking.id}`)}
              className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="px-4 py-4">
                <p className="text-xs text-[var(--text-primary)] font-mono">{booking.booking_reference}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{booking.hotel_name}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{booking.holder_name}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{booking.holder_email}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-xs text-[var(--text-secondary)] font-sans">{booking.check_in}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{booking.check_out}</p>
              </td>
              <td className="px-4 py-4 text-sm text-[var(--text-secondary)] font-sans">
                {booking.total_rooms}
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">
                  {formatPrice(booking.selling_price, booking.currency)}
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
