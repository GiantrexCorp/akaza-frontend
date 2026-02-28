'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, Car, Users, Briefcase, Plane, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardLayout from '@/components/DashboardLayout';
import { Button, Spinner, Badge, Modal, PageError } from '@/components/ui';
import { transfersApi } from '@/lib/api/transfers';
import { useTransferBookingDetail } from '@/hooks/useBookings';
import { useCancelTransferBooking } from '@/hooks/useTransfers';
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

function TransferBookingDetail({ id }: { id: string }) {
  const { toast } = useToast();
  const { data: booking, isLoading: loading, error: queryError, refetch } = useTransferBookingDetail(id);
  useQueryErrorToast(!!queryError, queryError, 'Failed to load booking');
  const error = queryError instanceof ApiError ? queryError : null;
  const cancelMutation = useCancelTransferBooking();
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancel = () => {
    cancelMutation.mutate(
      { id, data: cancelReason ? { reason: cancelReason } : undefined },
      {
        onSuccess: () => {
          setCancelModal(false);
          setCancelReason('');
          toast('success', 'Transfer cancelled');
        },
        onError: (err) => {
          if (err instanceof ApiError) toast('error', err.errors[0] || 'Cancellation failed');
        },
      },
    );
  };

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
          <h1 className="text-2xl font-serif text-[var(--text-primary)]">{booking.pickup_location} &rarr; {booking.dropoff_location}</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mt-1">Ref: {booking.booking_reference}</p>
        </div>
        <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} />
      </div>

      <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
        {/* Route */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-primary" />
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.pickup_location}</p>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">to {booking.dropoff_location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.pickup_date}</p>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.pickup_time}</p>
          </div>
        </div>

        {/* Vehicle & pax */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Car size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.vehicle.name} ({booking.vehicle.type_label})</p>
          </div>
          <div className="flex items-center gap-3">
            <Users size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase size={16} className="text-primary" />
            <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.luggage_count} bag{booking.luggage_count !== 1 ? 's' : ''}</p>
          </div>
          {booking.flight_number && (
            <div className="flex items-center gap-3">
              <Plane size={16} className="text-primary" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">Flight {booking.flight_number}</p>
            </div>
          )}
        </div>

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
        <div className="p-6 flex items-end justify-between">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Total</p>
          <p className="text-2xl font-serif text-[var(--text-primary)]">{booking.formatted_price}</p>
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

      <Modal open={cancelModal} onClose={() => setCancelModal(false)} title="Cancel Transfer">
        <p className="text-sm text-[var(--text-secondary)] font-sans mb-4">
          Are you sure you want to cancel this transfer?
        </p>
        <div className="mb-6">
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
            Reason (optional)
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
            className="w-full bg-transparent border border-[var(--line-soft)] focus:border-primary text-[var(--field-text)] font-serif text-sm px-4 py-3 outline-none transition-colors duration-300 resize-y"
            placeholder="Reason for cancellation"
          />
        </div>
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

export default function TransferBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ProtectedRoute>
      <Navbar />
      <DashboardLayout>
        <TransferBookingDetail id={id} />
      </DashboardLayout>
      <Footer />
    </ProtectedRoute>
  );
}
