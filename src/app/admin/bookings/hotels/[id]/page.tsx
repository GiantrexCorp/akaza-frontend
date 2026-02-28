'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Download, ShieldAlert } from 'lucide-react';
import HotelBookingHeader from '@/components/admin/hotel-bookings/HotelBookingHeader';
import HotelBookingInfo from '@/components/admin/hotel-bookings/HotelBookingInfo';
import HotelBookingRooms from '@/components/admin/hotel-bookings/HotelBookingRooms';
import HotelBookingStatusLogs from '@/components/admin/hotel-bookings/HotelBookingStatusLogs';
import dynamic from 'next/dynamic';
const ReconcileModal = dynamic(() => import('@/components/admin/hotel-bookings/ReconcileModal'), { ssr: false });
import { Spinner, Button, Breadcrumb, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useAdminHotelBookingDetail, useReconcileHotelBooking } from '@/hooks/admin/useAdminHotelBookings';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { adminHotelBookingsApi } from '@/lib/api/admin-hotel-bookings';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { ReconcileAction } from '@/types/hotel';

function HotelBookingDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const { data: booking, isLoading, isError, error, refetch } = useAdminHotelBookingDetail(id);
  useQueryErrorToast(isError, error, 'Failed to load booking');
  const reconcileMutation = useReconcileHotelBooking();
  const [reconcileOpen, setReconcileOpen] = useState(false);

  useEffect(() => {
    document.title = booking
      ? `${booking.booking_reference} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [booking]);

  const handleReconcile = (action: ReconcileAction, reason?: string) => {
    reconcileMutation.mutate(
      { id, data: { action, reason } },
      {
        onSuccess: () => {
          refetch();
          setReconcileOpen(false);
          toast('success', action === 'retry' ? 'Booking retry initiated' : 'Refund initiated');
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast('error', err.errors[0] || 'Reconciliation failed');
          }
        },
      },
    );
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

  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="py-16">
        <PageError
          status={(error as ApiError)?.status ?? 404}
          title={(error as ApiError)?.status === 404 ? 'Booking Not Found' : undefined}
          onRetry={() => refetch()}
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
        loading={reconcileMutation.isPending}
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
