'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText } from 'lucide-react';
import TemplateFilters from '@/components/admin/notifications/TemplateFilters';
import TemplateTable from '@/components/admin/notifications/TemplateTable';
import { Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminNotificationsApi } from '@/lib/api/admin-notifications';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { NotificationTemplate } from '@/types/admin-notification';

export default function AdminNotificationTemplatesPage() {
  useEffect(() => { document.title = 'Notification Templates | Akaza Admin'; }, []);
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchTemplates = useCallback(async (filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterParams.type) params.set('filter[type]', filterParams.type);
      if (filterParams.channel) params.set('filter[channel]', filterParams.channel);
      if (filterParams.is_active) params.set('filter[is_active]', filterParams.is_active);
      const data = await adminNotificationsApi.listTemplates(params.toString());
      setTemplates(data);
    } catch (err) {
      setTemplates([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load templates');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTemplates(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <AdminProtectedRoute permission="manage-notification-templates">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Notification Templates</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {templates.length} template{templates.length !== 1 ? 's' : ''} total
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <TemplateFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Content */}
          {loading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : templates.length === 0 ? (
            <EmptyState
              icon={<FileText size={48} strokeWidth={1} />}
              title="No Templates Found"
              description="Try adjusting your filters."
            />
          ) : (
            <TemplateTable templates={templates} />
          )}
        </div>
    </AdminProtectedRoute>
  );
}
