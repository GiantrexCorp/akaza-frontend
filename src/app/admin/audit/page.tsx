'use client';

import { useState, useEffect, useMemo } from 'react';
import { ScrollText } from 'lucide-react';
import AuditLogFilters from '@/components/admin/audit/AuditLogFilters';
import AuditLogTable from '@/components/admin/audit/AuditLogTable';
import AuditLogDetail from '@/components/admin/audit/AuditLogDetail';
import { Spinner, EmptyState, Pagination } from '@/components/ui';
import { useAdminAuditList } from '@/hooks/admin/useAdminAudit';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AuditLog } from '@/types/audit';

export default function AdminAuditPage() {
  useEffect(() => { document.title = 'Audit Log | Akaza Admin'; }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('per_page', '20');
    params.set('sort', '-created_at');
    if (filters.action) params.set('filter[action]', filters.action);
    if (filters.entity_type) params.set('filter[entity_type]', filters.entity_type);
    if (filters.entity_id) params.set('filter[entity_id]', filters.entity_id);
    if (filters.user_id) params.set('filter[user_id]', filters.user_id);
    if (filters.date_from && filters.date_to) {
      params.set('filter[byDateRange]', `${filters.date_from},${filters.date_to}`);
    }
    return params.toString();
  }, [currentPage, filters]);

  const { data: raw, isLoading, isError, error } = useAdminAuditList(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load audit logs');

  const logs: AuditLog[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const lastPage = Array.isArray(raw) ? 1 : (raw?.meta?.last_page ?? 1);
  const total = Array.isArray(raw) ? logs.length : (raw?.meta?.total ?? 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <AdminProtectedRoute permission="view-audit-logs">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Audit Log</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {total} entr{total !== 1 ? 'ies' : 'y'} total
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <AuditLogFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              icon={<ScrollText size={48} strokeWidth={1} />}
              title="No Audit Entries Found"
              description="Try adjusting your filters or date range."
            />
          ) : (
            <>
              <AuditLogTable logs={logs} onRowClick={setSelectedLog} />
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

        <AuditLogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
    </AdminProtectedRoute>
  );
}
