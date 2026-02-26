'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Download, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import TransferBookingHeader from '@/components/admin/transfer-bookings/TransferBookingHeader';
import TransferBookingInfo from '@/components/admin/transfer-bookings/TransferBookingInfo';
import TransferBookingStatusLogs from '@/components/admin/transfer-bookings/TransferBookingStatusLogs';
import StatusChangeModal from '@/components/admin/transfer-bookings/StatusChangeModal';
import { Spinner, Button, Breadcrumb } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminTransferBooking, TransferBookingStatus } from '@/types/transfer';

function TransferBookingDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const [booking, setBooking] = useState<AdminTransferBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await adminTransfersApi.getBooking(id);
        setBooking(data);
      } catch (err) {
        if (err instanceof ApiError) {
          toast('error', err.errors[0] || 'Failed to load booking');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleStatusChange = async (status: TransferBookingStatus, reason?: string) => {
    setStatusUpdating(true);
    try {
      const updated = await adminTransfersApi.updateBookingStatus(id, { status, reason });
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
      const blob = await adminTransfersApi.downloadVoucher(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voucher-${booking?.booking_reference || id}.pdf`;
      a.click();
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

  if (!booking) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-4">Booking Not Found</h2>
        <Link href="/admin/bookings/transfers">
          <Button variant="outline">Back to Transfer Bookings</Button>
        </Link>
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
          loading={statusUpdating}
        />
      )}
    </div>
  );
}

export default function AdminTransferBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="manage-transfer-bookings">
      <AdminLayout>
        <TransferBookingDetail id={Number(id)} />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
