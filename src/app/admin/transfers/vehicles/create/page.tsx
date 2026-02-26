'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import VehicleForm from '@/components/admin/transfers/VehicleForm';
import { Breadcrumb } from '@/components/ui';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminTransferVehicle } from '@/types/transfer';

export default function AdminCreateVehiclePage() {
  const router = useRouter();

  const handleSaved = (vehicle: AdminTransferVehicle) => {
    router.push(`/admin/transfers/vehicles/${vehicle.id}`);
  };

  return (
    <AdminProtectedRoute permission="create-transfer">
      <AdminLayout>
        <div>
          <Breadcrumb
            items={[
              { label: 'Transfers', href: '/admin/transfers' },
              { label: 'New Vehicle' },
            ]}
          />
          <div className="mt-6">
            <VehicleForm onSaved={handleSaved} />
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
