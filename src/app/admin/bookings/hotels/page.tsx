'use client';

import { useState, useEffect, useMemo } from 'react';
import { Hotel } from 'lucide-react';
import HotelBookingFilters from '@/components/admin/hotel-bookings/HotelBookingFilters';
import HotelBookingTable from '@/components/admin/hotel-bookings/HotelBookingTable';
import { Spinner, EmptyState, Pagination } from '@/components/ui';
import { useAdminHotelBookingList } from '@/hooks/admin/useAdminHotelBookings';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';

export default function AdminHotelBookingsPage() {
  useEffect(() => { document.title = 'Hotel Bookings | Akaza Admin'; }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('per_page', '20');
    params.set('sort', '-created_at');
    if (filters.status) params.set('filter[status]', filters.status);
    if (filters.reference) params.set('filter[booking_reference]', filters.reference);
    if (filters.hotel_name) params.set('filter[hotel_name]', filters.hotel_name);
    if (filters.holder_email) params.set('filter[holder_email]', filters.holder_email);
    if (filters.date_from) params.set('filter[date_from]', filters.date_from);
    if (filters.date_to) params.set('filter[date_to]', filters.date_to);
    return params.toString();
  }, [currentPage, filters]);

  const { data: raw, isLoading, isError, error } = useAdminHotelBookingList(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load hotel bookings');

  const bookings = raw?.data ?? [];
  const lastPage = raw?.meta?.last_page ?? 1;
  const total = raw?.meta?.total ?? 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <AdminProtectedRoute permission="manage-hotel-bookings">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Hotel Bookings</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {total} booking{total !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="mb-6">
            <HotelBookingFilters onFiltersChange={handleFiltersChange} />
          </div>

          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={<Hotel size={48} strokeWidth={1} />}
              title="No Hotel Bookings Found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <>
              <HotelBookingTable bookings={bookings} />
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
    </AdminProtectedRoute>
  );
}
