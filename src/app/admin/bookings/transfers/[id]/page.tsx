'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Download, RefreshCw } from 'lucide-react';
import TransferBookingHeader from '@/components/admin/transfer-bookings/TransferBookingHeader';
import TransferBookingInfo from '@/components/admin/transfer-bookings/TransferBookingInfo';
import TransferBookingStatusLogs from '@/components/admin/transfer-bookings/TransferBookingStatusLogs';
import dynamic from 'next/dynamic';
const StatusChangeModal = dynamic(() => import('@/components/admin/transfer-bookings/StatusChangeModal'), { ssr: false });
import { Spinner, Button, Breadcrumb, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useAdminTransferBookingDetail, useUpdateTransferBookingStatus } from '@/hooks/admin/useAdminTransferBookings';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { TransferBookingStatus } from '@/types/transfer';

function TransferBookingDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const { data: booking, isLoading, isError, error, refetch } = useAdminTransferBookingDetail(id);
  useQueryErrorToast(isError, error, 'Failed to load booking');
  const statusMutation = useUpdateTransferBookingStatus();
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    document.title = booking
      ? `${booking.booking_reference} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [booking]);

  const handleStatusChange = (status: TransferBookingStatus, reason?: string) => {
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
      const blob = await adminTransfersApi.downloadVoucher(id);
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
          backHref="/admin/bookings/transfers"
          backLabel="Back to Transfer Bookings"
        />
      </div>
    );
  }

  const isTerminal = ['cancelled', 'completed', 'no_show'].includes(booking.status);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Transfer Bookings', href: '/admin/bookings/transfers' },
          { label: booking.booking_reference },
        ]}
      />

      <div className="mt-6 space-y-6">
        <TransferBookingHeader booking={booking} />

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

        <TransferBookingInfo booking={booking} />
        <TransferBookingStatusLogs logs={booking.status_logs ?? []} />
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

export default function AdminTransferBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="manage-transfer-bookings">
      <TransferBookingDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
