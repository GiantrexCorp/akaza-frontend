'use client';

import { use } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Spinner, Badge, PageError } from '@/components/ui';
import { hotelsApi } from '@/lib/api/hotels';
import { useHotelBookingDetail } from '@/hooks/useBookings';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { ProtectedRoute } from '@/lib/auth';
import { HOTEL_BOOKING_STATUS_COLORS } from '@/lib/constants';

function ConfirmationContent({ id }: { id: string }) {
  const { toast } = useToast();
  const { data: booking, isLoading: loading, error: queryError, refetch } = useHotelBookingDetail(id);
  useQueryErrorToast(!!queryError, queryError, 'Failed to load booking');
  const error = queryError instanceof ApiError ? queryError : null;

  const handleDownloadVoucher = async () => {
    try {
      const blob = await hotelsApi.downloadVoucher(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voucher-${booking?.booking_reference || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast('error', 'Failed to download voucher');
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  if (loading) {
    return (
      <div className="pt-36 pb-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="pt-36 pb-32 max-w-7xl mx-auto px-6">
        <PageError
          status={error?.status ?? 404}
          title={error?.status === 404 ? 'Booking Not Found' : undefined}
          onRetry={() => refetch()}
          backHref="/dashboard/bookings"
          backLabel="My Bookings"
        />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        {/* Success header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle size={56} strokeWidth={1} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--text-primary)] mb-3">Booking Submitted</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans">Your booking reference is</p>
          <p className="text-2xl font-serif text-primary mt-2">{booking.booking_reference}</p>
        </div>

        {/* Booking details card */}
        <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
          {/* Status */}
          <div className="p-6 flex items-center justify-between">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Status</p>
            <Badge label={booking.status_label} color={HOTEL_BOOKING_STATUS_COLORS[booking.status] || 'gray'} />
          </div>

          {/* Hotel info */}
          <div className="p-6 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-lg font-serif text-[var(--text-primary)]">{booking.hotel_name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">
                {booking.check_in} to {booking.check_out} &middot; {booking.nights_count} night{booking.nights_count > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Users size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">
                {booking.total_rooms} room{booking.total_rooms > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Rooms */}
          {booking.rooms.map((room) => (
            <div key={room.id} className="p-6">
              <p className="text-sm font-serif text-[var(--text-primary)] mb-1">{room.room_name}</p>
              <p className="text-xs text-[var(--text-muted)] font-sans">{room.board_name} &middot; {formatPrice(room.selling_price, booking.currency)}</p>
              {room.guests.length > 0 && (
                <div className="mt-2 space-y-1">
                  {room.guests.map((guest, i) => (
                    <p key={`${guest.name}-${guest.surname}-${i}`} className="text-xs text-[var(--text-muted)] font-sans">
                      {guest.name} {guest.surname} ({guest.type === 'AD' ? 'Adult' : `Child, ${guest.age}y`})
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Price */}
          <div className="p-6 flex items-end justify-between">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Total Paid</p>
            <p className="text-2xl font-serif text-[var(--text-primary)]">{booking.formatted_selling_price}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {booking.voucher_path && (
            <Button variant="outline" icon={<Download size={14} />} onClick={handleDownloadVoucher} className="flex-1">
              Download Voucher
            </Button>
          )}
          <Link href="/dashboard/bookings" className="flex-1">
            <Button variant="ghost" icon={<ArrowRight size={14} />} className="w-full">
              My Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HotelBookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <Navbar />
      <ConfirmationContent id={id} />
      <Footer />
    </ProtectedRoute>
  );
}
