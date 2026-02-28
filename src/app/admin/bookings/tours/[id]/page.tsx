'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Download, RefreshCw } from 'lucide-react';
import TourBookingHeader from '@/components/admin/tour-bookings/TourBookingHeader';
import TourBookingInfo from '@/components/admin/tour-bookings/TourBookingInfo';
import TourBookingStatusLogs from '@/components/admin/tour-bookings/TourBookingStatusLogs';
import dynamic from 'next/dynamic';
const StatusChangeModal = dynamic(() => import('@/components/admin/tour-bookings/StatusChangeModal'), { ssr: false });
import { Spinner, Button, Breadcrumb, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useAdminTourBookingDetail, useUpdateTourBookingStatus } from '@/hooks/admin/useAdminTourBookings';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { adminToursApi } from '@/lib/api/admin-tours';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { TourBookingStatus } from '@/types/tour';

function TourBookingDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const { data: booking, isLoading, isError, error, refetch } = useAdminTourBookingDetail(id);
  useQueryErrorToast(isError, error, 'Failed to load booking');
  const statusMutation = useUpdateTourBookingStatus();
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    document.title = booking
      ? `${booking.booking_reference} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [booking]);

  const handleStatusChange = (status: TourBookingStatus, reason?: string) => {
    statusMutation.mutate(
      { id, data: { status, reason } },
      {
        onSuccess: () => {
          refetch();
          setStatusModalOpen(false);
          toast('success', `Status changed to ${status.replace(/_/g, ' ')}`);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast('error', err.errors[0] || 'Failed to update status');
          }
        },
      },
    );
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
          loading={statusMutation.isPending}
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
