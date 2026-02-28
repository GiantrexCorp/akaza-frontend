'use client';

import { useState, useEffect, useMemo } from 'react';
import { Users2 } from 'lucide-react';
import CustomerListFilters from '@/components/admin/customers/CustomerListFilters';
import CustomerTable from '@/components/admin/customers/CustomerTable';
import { Spinner, EmptyState, Pagination } from '@/components/ui';
import { useAdminCustomerList } from '@/hooks/admin/useAdminCustomers';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';
import type { Customer } from '@/types/customer';

export default function AdminCustomersPage() {
  useEffect(() => { document.title = 'Customers | Akaza Admin'; }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('per_page', '15');
    params.set('sort', '-created_at');
    if (filters.search) params.set('filter[email]', filters.search);
    if (filters.status) params.set('filter[status]', filters.status);
    if (filters.source) params.set('filter[source]', filters.source);
    return params.toString();
  }, [currentPage, filters]);

  const { data: raw, isLoading, isError, error } = useAdminCustomerList(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load customers');

  const customers: Customer[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const lastPage = Array.isArray(raw) ? 1 : (raw?.meta?.last_page ?? 1);
  const total = Array.isArray(raw) ? customers.length : (raw?.meta?.total ?? 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
          {isLoading ? (
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
