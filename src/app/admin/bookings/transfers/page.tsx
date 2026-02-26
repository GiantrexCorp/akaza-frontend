'use client';

import { useState, useEffect, useCallback } from 'react';
import { Car } from 'lucide-react';
import TransferBookingFilters from '@/components/admin/transfer-bookings/TransferBookingFilters';
import TransferBookingTable from '@/components/admin/transfer-bookings/TransferBookingTable';
import { Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminTransferBooking } from '@/types/transfer';

export default function AdminTransferBookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<AdminTransferBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchBookings = useCallback(async (filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('include', 'route,vehicle,user');
      params.set('sort', '-created_at');
      if (filterParams.status) params.set('filter[status]', filterParams.status);
      if (filterParams.route_id) params.set('filter[route_id]', filterParams.route_id);
      if (filterParams.user_id) params.set('filter[user_id]', filterParams.user_id);
      if (filterParams.date_from && filterParams.date_to) {
        params.set('filter[byDateRange]', `${filterParams.date_from},${filterParams.date_to}`);
      }
      const data = await adminTransfersApi.listBookings(params.toString());
      setBookings(data);
    } catch (err) {
      setBookings([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load transfer bookings');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBookings(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <AdminProtectedRoute permission="manage-transfer-bookings">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Transfer Bookings</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="mb-6">
            <TransferBookingFilters onFiltersChange={handleFiltersChange} />
          </div>

          {loading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={<Car size={48} strokeWidth={1} />}
              title="No Transfer Bookings Found"
              description="Try adjusting your filters or date range."
            />
          ) : (
            <TransferBookingTable bookings={bookings} />
          )}
        </div>
    </AdminProtectedRoute>
  );
}
