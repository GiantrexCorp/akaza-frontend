'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardLayout from '@/components/DashboardLayout';
import { Button, Spinner, Badge, Modal, PageError } from '@/components/ui';
import { toursApi } from '@/lib/api/tours';
import { useTourBookingDetail } from '@/hooks/useBookings';
import { useCancelTourBooking } from '@/hooks/useTours';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { ProtectedRoute } from '@/lib/auth';
import { CUSTOMER_BOOKING_STATUS_COLORS } from '@/lib/constants';

function TourBookingDetail({ id }: { id: string }) {
  const { toast } = useToast();
  const { data: booking, isLoading: loading, error: queryError, refetch } = useTourBookingDetail(id);
  useQueryErrorToast(!!queryError, queryError, 'Failed to load booking');
  const error = queryError instanceof ApiError ? queryError : null;
  const cancelMutation = useCancelTourBooking();
  const [cancelModal, setCancelModal] = useState(false);

  const handleCancel = () => {
    cancelMutation.mutate(id, {
      onSuccess: () => {
        setCancelModal(false);
        toast('success', 'Booking cancelled');
      },
      onError: (err) => {
        if (err instanceof ApiError) toast('error', err.errors[0] || 'Cancellation failed');
      },
    });
  };

  const handleDownloadVoucher = async () => {
    try {
      const blob = await toursApi.downloadVoucher(id);
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
          <h1 className="text-2xl font-serif text-[var(--text-primary)]">{booking.tour.translated_title}</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mt-1">Ref: {booking.booking_reference}</p>
        </div>
        <Badge label={booking.status_label} color={CUSTOMER_BOOKING_STATUS_COLORS[booking.status] || 'gray'} />
      </div>

      <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
        {/* Tour info */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.tour.location}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.tour_date}</p>
          </div>
          {(booking.tour.duration_days > 0 || booking.tour.duration_hours > 0) && (
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-primary" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">
                {booking.tour.duration_days > 0 ? `${booking.tour.duration_days}d ${booking.tour.duration_hours}h` : `${booking.tour.duration_hours}h`}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Users size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.number_of_guests} guest{booking.number_of_guests > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Guests */}
        {booking.guests.length > 0 && (
          <div className="p-6">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-3">Guests</p>
            <div className="space-y-1">
              {booking.guests.map((guest, i) => (
                <p key={`${guest.name}-${guest.surname}-${i}`} className="text-xs text-[var(--text-muted)] font-sans">
                  {guest.name} {guest.surname} ({guest.type === 'AD' ? 'Adult' : `Child, ${guest.age}y`})
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="p-6">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-3">Contact</p>
          <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.contact_name}</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-1">{booking.contact_email} {booking.contact_phone && `&middot; ${booking.contact_phone}`}</p>
        </div>

        {/* Special requests */}
        {booking.special_requests && (
          <div className="p-6">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-2">Special Requests</p>
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.special_requests}</p>
          </div>
        )}

        {/* Price */}
        <div className="p-6">
          <div className="flex justify-between mb-2">
            <p className="text-sm text-[var(--text-secondary)] font-sans">Price per person</p>
            <p className="text-sm font-serif text-[var(--text-primary)]">{formatPrice(booking.price_per_person, booking.currency)}</p>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Total</p>
            <p className="text-2xl font-serif text-[var(--text-primary)]">{formatPrice(booking.total_price, booking.currency)}</p>
          </div>
        </div>

        {/* Status history */}
        {booking.status_logs.length > 0 && (
          <div className="p-6">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-3">Status History</p>
            <div className="space-y-2">
              {booking.status_logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between">
                  <p className="text-xs text-[var(--text-secondary)] font-sans">
                    {log.from_status && <span className="text-[var(--text-muted)]">{log.from_status} &rarr; </span>}
                    {log.to_status}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] font-sans">{new Date(log.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        {booking.voucher_path && (
          <Button variant="outline" icon={<Download size={14} />} onClick={handleDownloadVoucher}>
            Download Voucher
          </Button>
        )}
        {booking.is_cancellable && (
          <Button variant="ghost" onClick={() => setCancelModal(true)} className="text-red-400 hover:text-red-300">
            Cancel Booking
          </Button>
        )}
      </div>

      <Modal open={cancelModal} onClose={() => setCancelModal(false)} title="Cancel Booking">
        <p className="text-sm text-[var(--text-secondary)] font-sans mb-6">
          Are you sure you want to cancel this tour booking?
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setCancelModal(false)}>Keep Booking</Button>
          <Button variant="primary" onClick={handleCancel} loading={cancelMutation.isPending} className="bg-red-500 hover:bg-red-600">
            Confirm Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function TourBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ProtectedRoute>
      <Navbar />
      <DashboardLayout>
        <TourBookingDetail id={id} />
      </DashboardLayout>
      <Footer />
    </ProtectedRoute>
  );
}
