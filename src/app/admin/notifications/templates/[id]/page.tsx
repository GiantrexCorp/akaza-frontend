'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import TemplateEditForm from '@/components/admin/notifications/TemplateEditForm';
import { Spinner, Breadcrumb, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminNotificationsApi } from '@/lib/api/admin-notifications';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { NotificationTemplate } from '@/types/admin-notification';

function TemplateDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const [template, setTemplate] = useState<NotificationTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await adminNotificationsApi.getTemplate(id);
        setTemplate(data);
      } catch (err) {
        if (err instanceof ApiError) {
          toast('error', err.errors[0] || 'Failed to load template');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

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

  if (!template) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-4">Template Not Found</h2>
        <Link href="/admin/notifications/templates">
          <Button variant="outline">Back to Templates</Button>
        </Link>
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
      <AdminLayout>
        <TemplateDetail id={Number(id)} />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
