'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import NotificationLogFilters from '@/components/admin/notifications/NotificationLogFilters';
import NotificationLogTable from '@/components/admin/notifications/NotificationLogTable';
import NotificationLogDetail from '@/components/admin/notifications/NotificationLogDetail';
import { Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminNotificationsApi } from '@/lib/api/admin-notifications';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminNotificationLog } from '@/types/admin-notification';

export default function AdminNotificationLogsPage() {
  useEffect(() => { document.title = 'Notification Logs | Akaza Admin'; }, []);
  const { toast } = useToast();
  const [logs, setLogs] = useState<AdminNotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedLog, setSelectedLog] = useState<AdminNotificationLog | null>(null);

  const fetchLogs = useCallback(async (filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('include', 'user');
      params.set('sort', '-created_at');
      if (filterParams.type) params.set('filter[type]', filterParams.type);
      if (filterParams.channel) params.set('filter[channel]', filterParams.channel);
      if (filterParams.status) params.set('filter[status]', filterParams.status);
      if (filterParams.user_id) params.set('filter[user_id]', filterParams.user_id);
      if (filterParams.date_from && filterParams.date_to) {
        params.set('filter[byDateRange]', `${filterParams.date_from},${filterParams.date_to}`);
      }
      const data = await adminNotificationsApi.listLogs(params.toString());
      setLogs(data);
    } catch (err) {
      setLogs([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load notification logs');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLogs(filters);
  }, [filters]);

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
              {logs.length} entr{logs.length !== 1 ? 'ies' : 'y'} total
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <NotificationLogFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Content */}
          {loading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              icon={<Bell size={48} strokeWidth={1} />}
              title="No Notification Logs Found"
              description="Try adjusting your filters or date range."
            />
          ) : (
            <NotificationLogTable logs={logs} onRowClick={setSelectedLog} />
          )}
        </div>

        <NotificationLogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
    </AdminProtectedRoute>
  );
}
