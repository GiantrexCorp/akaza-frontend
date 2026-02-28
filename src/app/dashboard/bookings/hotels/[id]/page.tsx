'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardLayout from '@/components/DashboardLayout';
import { Button, Spinner, Badge, Modal, PageError } from '@/components/ui';
import { hotelsApi } from '@/lib/api/hotels';
import { useHotelBookingDetail } from '@/hooks/useBookings';
import { useCancelHotelBooking } from '@/hooks/useHotels';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { ProtectedRoute } from '@/lib/auth';
import type { CancellationCost } from '@/types/hotel';

const statusColors: Record<string, 'yellow' | 'green' | 'red' | 'gray' | 'orange' | 'purple'> = {
  pending: 'yellow',
  confirmed: 'green',
  failed: 'red',
  cancelled: 'gray',
  pending_cancellation: 'orange',
  cancellation_failed: 'red',
  pending_reconciliation: 'purple',
};

function HotelBookingDetail({ id }: { id: string }) {
  const { toast } = useToast();
  const { data: booking, isLoading: loading, error: queryError, refetch } = useHotelBookingDetail(id);
  useQueryErrorToast(!!queryError, queryError, 'Failed to load booking');
  const error = queryError instanceof ApiError ? queryError : null;
  const cancelMutation = useCancelHotelBooking();
  const [cancelModal, setCancelModal] = useState(false);
  const [cancellationCost, setCancellationCost] = useState<CancellationCost | null>(null);
  const [fetchingCost, setFetchingCost] = useState(false);

  const openCancelModal = async () => {
    setFetchingCost(true);
    setCancelModal(true);
    try {
      const cost = await hotelsApi.getCancellationCost(id);
      setCancellationCost(cost);
    } catch {
      setCancellationCost(null);
    } finally {
      setFetchingCost(false);
    }
  };

  const handleCancel = () => {
    cancelMutation.mutate(id, {
      onSuccess: () => {
        setCancelModal(false);
        toast('success', 'Cancellation requested');
      },
      onError: (err) => {
        if (err instanceof ApiError) toast('error', err.errors[0] || 'Cancellation failed');
      },
    });
  };

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

  if (loading) return <div className="py-16"><Spinner size="lg" /></div>;

  if (error || !booking) {
    return (
      <div className="py-16">
        <PageError
          status={error?.status ?? 404}
          title={error?.status === 404 ? 'Booking Not Found' : undefined}
          onRetry={() => refetch()}
          backHref="/dashboard/bookings"
          backLabel="Back to Bookings"
        />
      </div>
    );
  }

  return (
    <div>
      <Link href="/dashboard/bookings" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary text-xs uppercase tracking-widest font-sans mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Bookings
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[var(--text-primary)]">{booking.hotel_name}</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mt-1">Ref: {booking.booking_reference}</p>
        </div>
        <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} />
      </div>

      <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
        {/* Dates & rooms */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">
              {booking.check_in} — {booking.check_out} &middot; {booking.nights_count} night{booking.nights_count > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Users size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.total_rooms} room{booking.total_rooms > 1 ? 's' : ''}</p>
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
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        {booking.voucher_path && (
          <Button variant="outline" icon={<Download size={14} />} onClick={handleDownloadVoucher}>
            Download Voucher
          </Button>
        )}
        {booking.is_cancellable && (
          <Button variant="ghost" onClick={openCancelModal} className="text-red-400 hover:text-red-300">
            Cancel Booking
          </Button>
        )}
      </div>

      {/* Cancel modal */}
      <Modal open={cancelModal} onClose={() => setCancelModal(false)} title="Cancel Booking">
        {fetchingCost ? (
          <div className="py-6"><Spinner size="md" /></div>
        ) : (
          <>
            <p className="text-sm text-[var(--text-secondary)] font-sans mb-4">
              Are you sure you want to cancel this booking?
            </p>
            {cancellationCost && cancellationCost.cancellation_cost > 0 && (
              <div className="border border-[var(--line-soft)] bg-[var(--surface-card)] p-4 mb-6">
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">Cancellation Fee</p>
                <p className="text-xl font-serif text-red-400">
                  {formatPrice(cancellationCost.cancellation_cost, cancellationCost.currency)}
                </p>
              </div>
            )}
            {cancellationCost && cancellationCost.cancellation_cost === 0 && (
              <p className="text-sm text-green-400 font-sans mb-6">
                Free cancellation — no fees apply.
              </p>
            )}
            {!cancellationCost && (
              <p className="text-sm text-[var(--text-muted)] font-sans mb-6">
                This action may be subject to cancellation fees.
              </p>
            )}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setCancelModal(false)}>Keep Booking</Button>
              <Button variant="primary" onClick={handleCancel} loading={cancelMutation.isPending} className="bg-red-500 hover:bg-red-600">
                Confirm Cancel
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default function HotelBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ProtectedRoute>
      <Navbar />
      <DashboardLayout>
        <HotelBookingDetail id={id} />
      </DashboardLayout>
      <Footer />
    </ProtectedRoute>
  );
}
