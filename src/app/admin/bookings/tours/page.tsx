'use client';

import { useState, useEffect, useCallback } from 'react';
import { Ship } from 'lucide-react';
import TourBookingFilters from '@/components/admin/tour-bookings/TourBookingFilters';
import TourBookingTable from '@/components/admin/tour-bookings/TourBookingTable';
import { Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminToursApi } from '@/lib/api/admin-tours';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminTourBooking } from '@/types/tour';

export default function AdminTourBookingsPage() {
  useEffect(() => { document.title = 'Tour Bookings | Akaza Admin'; }, []);
  const { toast } = useToast();
  const [bookings, setBookings] = useState<AdminTourBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchBookings = useCallback(async (filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('include', 'tour,guests,user');
      params.set('sort', '-created_at');
      if (filterParams.status) params.set('filter[status]', filterParams.status);
      if (filterParams.tour_id) params.set('filter[tour_id]', filterParams.tour_id);
      if (filterParams.user_id) params.set('filter[user_id]', filterParams.user_id);
      if (filterParams.date_from && filterParams.date_to) {
        params.set('filter[byDateRange]', `${filterParams.date_from},${filterParams.date_to}`);
      }
      const data = await adminToursApi.listBookings(params.toString());
      setBookings(data);
    } catch (err) {
      setBookings([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load tour bookings');
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
    <AdminProtectedRoute permission="manage-tour-bookings">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Tour Bookings</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="mb-6">
            <TourBookingFilters onFiltersChange={handleFiltersChange} />
          </div>

          {loading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={<Ship size={48} strokeWidth={1} />}
              title="No Tour Bookings Found"
              description="Try adjusting your filters or date range."
            />
          ) : (
            <TourBookingTable bookings={bookings} />
          )}
        </div>
    </AdminProtectedRoute>
  );
}
