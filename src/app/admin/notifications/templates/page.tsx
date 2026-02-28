'use client';

import { useState, useEffect, useMemo } from 'react';
import { FileText } from 'lucide-react';
import TemplateFilters from '@/components/admin/notifications/TemplateFilters';
import TemplateTable from '@/components/admin/notifications/TemplateTable';
import { Spinner, EmptyState } from '@/components/ui';
import { useNotificationTemplates } from '@/hooks/admin/useAdminNotifications';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';

export default function AdminNotificationTemplatesPage() {
  useEffect(() => { document.title = 'Notification Templates | Akaza Admin'; }, []);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.type) params.set('filter[type]', filters.type);
    if (filters.channel) params.set('filter[channel]', filters.channel);
    if (filters.is_active) params.set('filter[is_active]', filters.is_active);
    return params.toString();
  }, [filters]);

  const { data: templates = [], isLoading, isError, error } = useNotificationTemplates(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load templates');

  const templateList = Array.isArray(templates) ? templates : [];

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
              {templateList.length} template{templateList.length !== 1 ? 's' : ''} total
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <TemplateFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : templateList.length === 0 ? (
            <EmptyState
              icon={<FileText size={48} strokeWidth={1} />}
              title="No Templates Found"
              description="Try adjusting your filters."
            />
          ) : (
            <TemplateTable templates={templateList} />
          )}
        </div>
    </AdminProtectedRoute>
  );
}
