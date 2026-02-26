'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScrollText } from 'lucide-react';
import AuditLogFilters from '@/components/admin/audit/AuditLogFilters';
import AuditLogTable from '@/components/admin/audit/AuditLogTable';
import AuditLogDetail from '@/components/admin/audit/AuditLogDetail';
import { Spinner, EmptyState, Pagination } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminAuditApi } from '@/lib/api/admin-audit';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AuditLog } from '@/types/audit';

export default function AdminAuditPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async (page: number, filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', '20');
      params.set('sort', '-created_at');
      if (filterParams.action) params.set('filter[action]', filterParams.action);
      if (filterParams.entity_type) params.set('filter[entity_type]', filterParams.entity_type);
      if (filterParams.entity_id) params.set('filter[entity_id]', filterParams.entity_id);
      if (filterParams.user_id) params.set('filter[user_id]', filterParams.user_id);
      if (filterParams.date_from && filterParams.date_to) {
        params.set('filter[byDateRange]', `${filterParams.date_from},${filterParams.date_to}`);
      }
      const raw = await adminAuditApi.list(params.toString());
      if (Array.isArray(raw)) {
        setLogs(raw);
        setCurrentPage(1);
        setLastPage(1);
        setTotal(raw.length);
      } else {
        setLogs(raw?.data ?? []);
        setCurrentPage(raw?.meta?.current_page ?? 1);
        setLastPage(raw?.meta?.last_page ?? 1);
        setTotal(raw?.meta?.total ?? 0);
      }
    } catch (err) {
      setLogs([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load audit logs');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLogs(1, filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    fetchLogs(page, filters);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
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
          {loading ? (
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
