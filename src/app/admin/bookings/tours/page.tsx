'use client';

import { useState, useEffect, useMemo } from 'react';
import { Ship } from 'lucide-react';
import TourBookingFilters from '@/components/admin/tour-bookings/TourBookingFilters';
import TourBookingTable from '@/components/admin/tour-bookings/TourBookingTable';
import { Spinner, EmptyState } from '@/components/ui';
import { useAdminTourBookingList } from '@/hooks/admin/useAdminTourBookings';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';

export default function AdminTourBookingsPage() {
  useEffect(() => { document.title = 'Tour Bookings | Akaza Admin'; }, []);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('include', 'tour,guests,user');
    params.set('sort', '-created_at');
    if (filters.status) params.set('filter[status]', filters.status);
    if (filters.tour_id) params.set('filter[tour_id]', filters.tour_id);
    if (filters.user_id) params.set('filter[user_id]', filters.user_id);
    if (filters.date_from && filters.date_to) {
      params.set('filter[byDateRange]', `${filters.date_from},${filters.date_to}`);
    }
    return params.toString();
  }, [filters]);

  const { data: bookings = [], isLoading, isError, error } = useAdminTourBookingList(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load tour bookings');

  const bookingList = Array.isArray(bookings) ? bookings : [];

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <AdminProtectedRoute permission="manage-tour-bookings">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Tour Bookings</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {bookingList.length} booking{bookingList.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="mb-6">
            <TourBookingFilters onFiltersChange={handleFiltersChange} />
          </div>

          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : bookingList.length === 0 ? (
            <EmptyState
              icon={<Ship size={48} strokeWidth={1} />}
              title="No Tour Bookings Found"
              description="Try adjusting your filters or date range."
            />
          ) : (
            <TourBookingTable bookings={bookingList} />
          )}
        </div>
    </AdminProtectedRoute>
  );
}
