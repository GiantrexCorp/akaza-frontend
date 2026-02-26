'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Download, ShieldAlert } from 'lucide-react';
import HotelBookingHeader from '@/components/admin/hotel-bookings/HotelBookingHeader';
import HotelBookingInfo from '@/components/admin/hotel-bookings/HotelBookingInfo';
import HotelBookingRooms from '@/components/admin/hotel-bookings/HotelBookingRooms';
import HotelBookingStatusLogs from '@/components/admin/hotel-bookings/HotelBookingStatusLogs';
import ReconcileModal from '@/components/admin/hotel-bookings/ReconcileModal';
import { Spinner, Button, Breadcrumb, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminHotelBookingsApi } from '@/lib/api/admin-hotel-bookings';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminHotelBooking, ReconcileAction } from '@/types/hotel';

function HotelBookingDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const [booking, setBooking] = useState<AdminHotelBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [reconcileOpen, setReconcileOpen] = useState(false);
  const [reconciling, setReconciling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const data = await adminHotelBookingsApi.get(id);
        if (!cancelled) setBooking(data);
      } catch (err) {
        if (!cancelled && err instanceof ApiError) {
          setError(err);
          toast('error', err.errors[0] || 'Failed to load booking');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, retryCount]);

  useEffect(() => {
    document.title = booking
      ? `${booking.booking_reference} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [booking]);

  const handleReconcile = async (action: ReconcileAction, reason?: string) => {
    setReconciling(true);
    try {
      const updated = await adminHotelBookingsApi.reconcile(id, { action, reason });
      setBooking(updated);
      setReconcileOpen(false);
      toast('success', action === 'retry' ? 'Booking retry initiated' : 'Refund initiated');
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Reconciliation failed');
      }
    } finally {
      setReconciling(false);
    }
  };

  const handleDownloadVoucher = async () => {
    try {
      const blob = await adminHotelBookingsApi.downloadVoucher(id);
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
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="py-16">
        <PageError
          status={error?.status ?? 404}
          title={error?.status === 404 ? 'Booking Not Found' : undefined}
          onRetry={() => setRetryCount((c) => c + 1)}
          backHref="/admin/bookings/hotels"
          backLabel="Back to Hotel Bookings"
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Hotel Bookings', href: '/admin/bookings/hotels' },
          { label: booking.booking_reference },
        ]}
      />

      <div className="mt-6 space-y-6">
        <HotelBookingHeader booking={booking} />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {booking.voucher_path && (
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleDownloadVoucher}>
              Download Voucher
            </Button>
          )}
          {booking.status === 'pending_reconciliation' && (
            <Button variant="primary" size="sm" icon={<ShieldAlert size={14} />} onClick={() => setReconcileOpen(true)}>
              Reconcile
            </Button>
          )}
        </div>

        <HotelBookingInfo booking={booking} />
        <HotelBookingRooms rooms={booking.rooms} currency={booking.currency} />
        <HotelBookingStatusLogs logs={booking.status_logs ?? []} />
      </div>

      <ReconcileModal
        open={reconcileOpen}
        onClose={() => setReconcileOpen(false)}
        onReconcile={handleReconcile}
        loading={reconciling}
      />
    </div>
  );
}

export default function AdminHotelBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="manage-hotel-bookings">
      <HotelBookingDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
