'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Ship, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import TourFilters from '@/components/admin/tours/TourFilters';
import TourTable from '@/components/admin/tours/TourTable';
import { Spinner, EmptyState, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminToursApi } from '@/lib/api/admin-tours';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminTour } from '@/types/tour';

export default function AdminToursPage() {
  const { toast } = useToast();
  const [tours, setTours] = useState<AdminTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchTours = useCallback(async (filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('sort', '-created_at');
      if (filterParams.status) params.set('filter[status]', filterParams.status);
      if (filterParams.location) params.set('filter[location]', filterParams.location);
      const data = await adminToursApi.list(params.toString());
      setTours(data);
    } catch (err) {
      setTours([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load tours');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTours(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <AdminProtectedRoute permission="create-tour">
      <AdminLayout>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">Tours</h1>
              <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
                {tours.length} tour{tours.length !== 1 ? 's' : ''} total
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

          {loading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : tours.length === 0 ? (
            <EmptyState
              icon={<Ship size={48} strokeWidth={1} />}
              title="No Tours Found"
              description="Try adjusting your filters or create a new tour."
            />
          ) : (
            <TourTable tours={tours} />
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
