'use client';

import { useState, useEffect, useCallback } from 'react';
import { Hotel } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import HotelBookingFilters from '@/components/admin/hotel-bookings/HotelBookingFilters';
import HotelBookingTable from '@/components/admin/hotel-bookings/HotelBookingTable';
import { Spinner, EmptyState, Pagination } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminHotelBookingsApi } from '@/lib/api/admin-hotel-bookings';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminHotelBooking } from '@/types/hotel';

export default function AdminHotelBookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<AdminHotelBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchBookings = useCallback(async (page: number, filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', '20');
      params.set('sort', '-created_at');
      if (filterParams.status) params.set('filter[status]', filterParams.status);
      if (filterParams.reference) params.set('filter[booking_reference]', filterParams.reference);
      if (filterParams.hotel_name) params.set('filter[hotel_name]', filterParams.hotel_name);
      if (filterParams.holder_email) params.set('filter[holder_email]', filterParams.holder_email);
      if (filterParams.date_from) params.set('filter[date_from]', filterParams.date_from);
      if (filterParams.date_to) params.set('filter[date_to]', filterParams.date_to);
      const raw = await adminHotelBookingsApi.list(params.toString());
      setBookings(raw?.data ?? []);
      setCurrentPage(raw?.meta?.current_page ?? 1);
      setLastPage(raw?.meta?.last_page ?? 1);
      setTotal(raw?.meta?.total ?? 0);
    } catch (err) {
      setBookings([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load hotel bookings');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBookings(1, filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    fetchBookings(page, filters);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <AdminProtectedRoute permission="manage-hotel-bookings">
      <AdminLayout>
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

          {loading ? (
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
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
