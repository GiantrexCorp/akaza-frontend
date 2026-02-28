'use client';

import { useState, useEffect, useMemo } from 'react';
import { Bell } from 'lucide-react';
import NotificationLogFilters from '@/components/admin/notifications/NotificationLogFilters';
import NotificationLogTable from '@/components/admin/notifications/NotificationLogTable';
import NotificationLogDetail from '@/components/admin/notifications/NotificationLogDetail';
import { Spinner, EmptyState } from '@/components/ui';
import { useNotificationLogs } from '@/hooks/admin/useAdminNotifications';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminNotificationLog } from '@/types/admin-notification';

export default function AdminNotificationLogsPage() {
  useEffect(() => { document.title = 'Notification Logs | Akaza Admin'; }, []);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedLog, setSelectedLog] = useState<AdminNotificationLog | null>(null);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('include', 'user');
    params.set('sort', '-created_at');
    if (filters.type) params.set('filter[type]', filters.type);
    if (filters.channel) params.set('filter[channel]', filters.channel);
    if (filters.status) params.set('filter[status]', filters.status);
    if (filters.user_id) params.set('filter[user_id]', filters.user_id);
    if (filters.date_from && filters.date_to) {
      params.set('filter[byDateRange]', `${filters.date_from},${filters.date_to}`);
    }
    return params.toString();
  }, [filters]);

  const { data: logs = [], isLoading, isError, error } = useNotificationLogs(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load notification logs');

  const logList = Array.isArray(logs) ? logs : [];

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <AdminProtectedRoute permission="view-notification-logs">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Notification Logs</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {logList.length} entr{logList.length !== 1 ? 'ies' : 'y'} total
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <NotificationLogFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : logList.length === 0 ? (
            <EmptyState
              icon={<Bell size={48} strokeWidth={1} />}
              title="No Notification Logs Found"
              description="Try adjusting your filters or date range."
            />
          ) : (
            <NotificationLogTable logs={logList} onRowClick={setSelectedLog} />
          )}
        </div>

        <NotificationLogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
    </AdminProtectedRoute>
  );
}
