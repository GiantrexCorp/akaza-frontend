'use client';

import { useState, useEffect, useMemo } from 'react';
import { Car } from 'lucide-react';
import TransferBookingFilters from '@/components/admin/transfer-bookings/TransferBookingFilters';
import TransferBookingTable from '@/components/admin/transfer-bookings/TransferBookingTable';
import { Spinner, EmptyState } from '@/components/ui';
import { useAdminTransferBookingList } from '@/hooks/admin/useAdminTransferBookings';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';

export default function AdminTransferBookingsPage() {
  useEffect(() => { document.title = 'Transfer Bookings | Akaza Admin'; }, []);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('include', 'route,vehicle,user');
    params.set('sort', '-created_at');
    if (filters.status) params.set('filter[status]', filters.status);
    if (filters.route_id) params.set('filter[route_id]', filters.route_id);
    if (filters.user_id) params.set('filter[user_id]', filters.user_id);
    if (filters.date_from && filters.date_to) {
      params.set('filter[byDateRange]', `${filters.date_from},${filters.date_to}`);
    }
    return params.toString();
  }, [filters]);

  const { data: bookings = [], isLoading, isError, error } = useAdminTransferBookingList(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load transfer bookings');

  const bookingList = Array.isArray(bookings) ? bookings : [];

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <AdminProtectedRoute permission="manage-transfer-bookings">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Transfer Bookings</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {bookingList.length} booking{bookingList.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="mb-6">
            <TransferBookingFilters onFiltersChange={handleFiltersChange} />
          </div>

          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : bookingList.length === 0 ? (
            <EmptyState
              icon={<Car size={48} strokeWidth={1} />}
              title="No Transfer Bookings Found"
              description="Try adjusting your filters or date range."
            />
          ) : (
            <TransferBookingTable bookings={bookingList} />
          )}
        </div>
    </AdminProtectedRoute>
  );
}
