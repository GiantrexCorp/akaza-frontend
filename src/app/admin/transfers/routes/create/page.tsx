'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import RouteForm from '@/components/admin/transfers/RouteForm';
import { Breadcrumb } from '@/components/ui';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminTransferRoute } from '@/types/transfer';

export default function AdminCreateRoutePage() {
  const router = useRouter();

  const handleSaved = (route: AdminTransferRoute) => {
    router.push(`/admin/transfers/routes/${route.id}`);
  };

  return (
    <AdminProtectedRoute permission="create-transfer">
      <AdminLayout>
        <div>
          <Breadcrumb
            items={[
              { label: 'Transfers', href: '/admin/transfers' },
              { label: 'New Route' },
            ]}
          />
          <div className="mt-6">
            <RouteForm onSaved={handleSaved} />
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
