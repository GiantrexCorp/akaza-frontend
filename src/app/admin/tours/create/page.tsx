'use client';

import { useRouter } from 'next/navigation';
import TourForm from '@/components/admin/tours/TourForm';
import { Breadcrumb } from '@/components/ui';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminTour } from '@/types/tour';

export default function AdminCreateTourPage() {
  const router = useRouter();

  const handleSaved = (tour: AdminTour) => {
    router.push(`/admin/tours/${tour.id}`);
  };

  return (
    <AdminProtectedRoute permission="create-tour">
      <div>
        <Breadcrumb
          items={[
            { label: 'Tours', href: '/admin/tours' },
            { label: 'New Tour' },
          ]}
        />
        <div className="mt-6">
          <TourForm onSaved={handleSaved} />
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
