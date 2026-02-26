'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Download, RefreshCw } from 'lucide-react';
import TourBookingHeader from '@/components/admin/tour-bookings/TourBookingHeader';
import TourBookingInfo from '@/components/admin/tour-bookings/TourBookingInfo';
import TourBookingStatusLogs from '@/components/admin/tour-bookings/TourBookingStatusLogs';
import StatusChangeModal from '@/components/admin/tour-bookings/StatusChangeModal';
import { Spinner, Button, Breadcrumb, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminToursApi } from '@/lib/api/admin-tours';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminTourBooking, TourBookingStatus } from '@/types/tour';

function TourBookingDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const [booking, setBooking] = useState<AdminTourBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const data = await adminToursApi.getBooking(id);
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

  const handleStatusChange = async (status: TourBookingStatus, reason?: string) => {
    setStatusUpdating(true);
    try {
      const updated = await adminToursApi.updateBookingStatus(id, { status, reason });
      setBooking(updated);
      setStatusModalOpen(false);
      toast('success', `Status changed to ${status.replace(/_/g, ' ')}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to update status');
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDownloadVoucher = async () => {
    try {
      const blob = await adminToursApi.downloadVoucher(id);
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
          backHref="/admin/bookings/tours"
          backLabel="Back to Tour Bookings"
        />
      </div>
    );
  }

  const isTerminal = ['cancelled', 'completed', 'no_show'].includes(booking.status);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Tour Bookings', href: '/admin/bookings/tours' },
          { label: booking.booking_reference },
        ]}
      />

      <div className="mt-6 space-y-6">
        <TourBookingHeader booking={booking} />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {booking.voucher_path && (
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleDownloadVoucher}>
              Download Voucher
            </Button>
          )}
          {!isTerminal && (
            <Button variant="primary" size="sm" icon={<RefreshCw size={14} />} onClick={() => setStatusModalOpen(true)}>
              Change Status
            </Button>
          )}
        </div>

        <TourBookingInfo booking={booking} />
        <TourBookingStatusLogs logs={booking.status_logs ?? []} />
      </div>

      {!isTerminal && (
        <StatusChangeModal
          open={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          currentStatus={booking.status}
          onSubmit={handleStatusChange}
          loading={statusUpdating}
        />
      )}
    </div>
  );
}

export default function AdminTourBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="manage-tour-bookings">
      <TourBookingDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
