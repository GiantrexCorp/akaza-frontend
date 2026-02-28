'use client';

import { use } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, Calendar, Clock, MapPin, Car, Users, Briefcase, Plane, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Spinner, Badge, PageError } from '@/components/ui';
import { transfersApi } from '@/lib/api/transfers';
import { useTransferBookingDetail } from '@/hooks/useBookings';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { ProtectedRoute } from '@/lib/auth';

const statusColors: Record<string, 'yellow' | 'green' | 'red' | 'gray' | 'purple'> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'gray',
  completed: 'purple',
  no_show: 'red',
};

function ConfirmationContent({ id }: { id: string }) {
  const { toast } = useToast();
  const { data: booking, isLoading: loading, error: queryError, refetch } = useTransferBookingDetail(id);
  useQueryErrorToast(!!queryError, queryError, 'Failed to load booking');
  const error = queryError instanceof ApiError ? queryError : null;

  const handleDownloadVoucher = async () => {
    try {
      const blob = await transfersApi.downloadVoucher(id);
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
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--text-primary)] mb-3">Transfer Booked</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans">Your booking reference is</p>
          <p className="text-2xl font-serif text-primary mt-2">{booking.booking_reference}</p>
        </div>

        {/* Booking details card */}
        <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
          {/* Status */}
          <div className="p-6 flex items-center justify-between">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Status</p>
            <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} />
          </div>

          {/* Route info */}
          <div className="p-6 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-lg font-serif text-[var(--text-primary)]">{booking.pickup_location}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">to {booking.dropoff_location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.pickup_date}</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.pickup_time}</p>
            </div>
          </div>

          {/* Vehicle & passengers */}
          <div className="p-6 space-y-3">
            <div className="flex items-start gap-3">
              <Car size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.vehicle.name} ({booking.vehicle.type_label})</p>
            </div>
            <div className="flex items-start gap-3">
              <Users size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.luggage_count} bag{booking.luggage_count !== 1 ? 's' : ''}</p>
            </div>
            {booking.flight_number && (
              <div className="flex items-start gap-3">
                <Plane size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--text-secondary)] font-sans">Flight {booking.flight_number}</p>
              </div>
            )}
          </div>

          {/* Special requests */}
          {booking.special_requests && (
            <div className="p-6">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-2">Special Requests</p>
              <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.special_requests}</p>
            </div>
          )}

          {/* Price */}
          <div className="p-6 flex items-end justify-between">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Total</p>
            <p className="text-2xl font-serif text-[var(--text-primary)]">{booking.formatted_price}</p>
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

export default function TransferBookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <Navbar />
      <ConfirmationContent id={id} />
      <Footer />
    </ProtectedRoute>
  );
}
