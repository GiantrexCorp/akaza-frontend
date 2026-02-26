'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users2 } from 'lucide-react';
import CustomerListFilters from '@/components/admin/customers/CustomerListFilters';
import CustomerTable from '@/components/admin/customers/CustomerTable';
import { Spinner, EmptyState, Pagination } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminCustomersApi } from '@/lib/api/admin-customers';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { Customer } from '@/types/customer';

export default function AdminCustomersPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchCustomers = useCallback(async (page: number, filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', '15');
      params.set('sort', '-created_at');
      if (filterParams.search) params.set('filter[email]', filterParams.search);
      if (filterParams.status) params.set('filter[status]', filterParams.status);
      if (filterParams.source) params.set('filter[source]', filterParams.source);
      const raw = await adminCustomersApi.list(params.toString());
      if (Array.isArray(raw)) {
        setCustomers(raw);
        setCurrentPage(1);
        setLastPage(1);
        setTotal(raw.length);
      } else {
        setCustomers(raw?.data ?? []);
        setCurrentPage(raw?.meta?.current_page ?? 1);
        setLastPage(raw?.meta?.last_page ?? 1);
        setTotal(raw?.meta?.total ?? 0);
      }
    } catch (err) {
      setCustomers([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load customers');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCustomers(1, filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    fetchCustomers(page, filters);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <AdminProtectedRoute permission="list-customers">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Customers</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {total} customer{total !== 1 ? 's' : ''} total
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <CustomerListFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Content */}
          {loading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : customers.length === 0 ? (
            <EmptyState
              icon={<Users2 size={48} strokeWidth={1} />}
              title="No Customers Found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <>
              <CustomerTable customers={customers} />
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
