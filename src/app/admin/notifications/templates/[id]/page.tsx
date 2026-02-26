'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import TemplateEditForm from '@/components/admin/notifications/TemplateEditForm';
import { Spinner, Breadcrumb, Button, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminNotificationsApi } from '@/lib/api/admin-notifications';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { NotificationTemplate } from '@/types/admin-notification';

function TemplateDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const [template, setTemplate] = useState<NotificationTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const data = await adminNotificationsApi.getTemplate(id);
        if (!cancelled) setTemplate(data);
      } catch (err) {
        if (!cancelled && err instanceof ApiError) {
          setError(err);
          toast('error', err.errors[0] || 'Failed to load template');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, retryCount]);

  useEffect(() => {
    document.title = template
      ? `${template.type_label} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [template]);

  const handleSaved = (updated: NotificationTemplate) => {
    setTemplate(updated);
  };

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="py-16">
        <PageError
          status={error?.status ?? 404}
          title={error?.status === 404 ? 'Template Not Found' : undefined}
          onRetry={() => setRetryCount((c) => c + 1)}
          backHref="/admin/notifications/templates"
          backLabel="Back to Templates"
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Templates', href: '/admin/notifications/templates' },
          { label: template.type_label },
        ]}
      />

      <div className="mt-6">
        <TemplateEditForm template={template} onSaved={handleSaved} />
      </div>
    </div>
  );
}

export default function AdminTemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="manage-notification-templates">
      <TemplateDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
