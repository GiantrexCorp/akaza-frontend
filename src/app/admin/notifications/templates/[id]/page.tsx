'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const TemplateEditForm = dynamic(() => import('@/components/admin/notifications/TemplateEditForm'), { ssr: false });
import { Spinner, Breadcrumb, Button, PageError } from '@/components/ui';
import { useNotificationTemplateDetail } from '@/hooks/admin/useAdminNotifications';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { NotificationTemplate } from '@/types/admin-notification';

function TemplateDetail({ id }: { id: number }) {
  const { data: template, isLoading, isError, error, refetch } = useNotificationTemplateDetail(id);
  useQueryErrorToast(isError, error, 'Failed to load template');

  useEffect(() => {
    document.title = template
      ? `${template.type_label} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [template]);

  const handleSaved = (_updated: NotificationTemplate) => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="py-16">
        <PageError
          status={(error as ApiError)?.status ?? 404}
          title={(error as ApiError)?.status === 404 ? 'Template Not Found' : undefined}
          onRetry={() => refetch()}
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
