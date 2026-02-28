'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Ship, Plus } from 'lucide-react';
import TourFilters from '@/components/admin/tours/TourFilters';
import TourTable from '@/components/admin/tours/TourTable';
import { Spinner, EmptyState, Button } from '@/components/ui';
import { useAdminTourList } from '@/hooks/admin/useAdminTours';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';

export default function AdminToursPage() {
  useEffect(() => { document.title = 'Tours | Akaza Admin'; }, []);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('sort', '-created_at');
    if (filters.status) params.set('filter[status]', filters.status);
    if (filters.location) params.set('filter[location]', filters.location);
    return params.toString();
  }, [filters]);

  const { data: tours = [], isLoading, isError, error } = useAdminTourList(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load tours');

  const tourList = Array.isArray(tours) ? tours : [];

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <AdminProtectedRoute permission="create-tour">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">Tours</h1>
              <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
                {tourList.length} tour{tourList.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <Link href="/admin/tours/create">
              <Button size="sm" icon={<Plus size={14} />}>
                New Tour
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <TourFilters onFiltersChange={handleFiltersChange} />
          </div>

          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : tourList.length === 0 ? (
            <EmptyState
              icon={<Ship size={48} strokeWidth={1} />}
              title="No Tours Found"
              description="Try adjusting your filters or create a new tour."
            />
          ) : (
            <TourTable tours={tourList} />
          )}
        </div>
    </AdminProtectedRoute>
  );
}
