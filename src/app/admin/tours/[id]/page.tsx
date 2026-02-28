'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import TourForm from '@/components/admin/tours/TourForm';
import dynamic from 'next/dynamic';
const TourAvailabilityManager = dynamic(() => import('@/components/admin/tours/TourAvailabilityManager'), { ssr: false });
const TourImageManager = dynamic(() => import('@/components/admin/tours/TourImageManager'), { ssr: false });
import { Spinner, Breadcrumb, Button, Badge, Modal, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useAdminTourDetail, useDeleteTour } from '@/hooks/admin/useAdminTours';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import { useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import type { AdminTour, TourStatus } from '@/types/tour';

type Tab = 'info' | 'availabilities' | 'images';

const statusColors: Record<TourStatus, 'yellow' | 'green' | 'gray'> = {
  draft: 'yellow',
  active: 'green',
  inactive: 'gray',
};

function TourDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { data: tour, isLoading, isError, error, refetch } = useAdminTourDetail(id);
  useQueryErrorToast(isError, error, 'Failed to load tour');
  const deleteMutation = useDeleteTour();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canUpdate = hasPermission(authUser, 'update-tour');
  const canDelete = hasPermission(authUser, 'delete-tour');

  useEffect(() => {
    document.title = tour
      ? `${tour.translated_title} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [tour]);

  const handleSaved = (_updated: AdminTour) => {
    refetch();
  };

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast('success', 'Tour deleted');
        router.push('/admin/tours');
      },
      onError: (err) => {
        if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to delete tour');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !tour) {
    return (
      <div className="py-16">
        <PageError
          status={(error as ApiError)?.status ?? 404}
          title={(error as ApiError)?.status === 404 ? 'Tour Not Found' : undefined}
          onRetry={() => refetch()}
          backHref="/admin/tours"
          backLabel="Back to Tours"
        />
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Information' },
    { key: 'availabilities', label: 'Availabilities' },
    { key: 'images', label: 'Images' },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Tours', href: '/admin/tours' },
          { label: tour.translated_title },
        ]}
      />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">{tour.translated_title}</h1>
              <Badge label={tour.status_label} color={statusColors[tour.status] || 'gray'} />
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans mt-2">
              {tour.location} &middot; {tour.formatted_price}
            </p>
          </div>
          {canDelete && (
            <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-6 border-b border-[var(--line-soft)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-xs font-sans font-bold uppercase tracking-[0.2em] transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'text-primary border-primary'
                  : 'text-[var(--text-muted)] border-transparent hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'info' && (
          canUpdate ? (
            <TourForm tour={tour} onSaved={handleSaved} />
          ) : (
            <div className="text-sm text-[var(--text-muted)] font-sans">
              You do not have permission to edit tours.
            </div>
          )
        )}
        {activeTab === 'availabilities' && (
          <TourAvailabilityManager tourId={tour.id} />
        )}
        {activeTab === 'images' && (
          <TourImageManager
            tourId={tour.id}
            images={tour.images}
            onUpdated={() => refetch()}
          />
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Tour">
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)] font-sans">
            Are you sure you want to delete <strong>{tour.translated_title}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button size="sm" loading={deleteMutation.isPending} onClick={handleDelete}>
              Delete Tour
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function AdminTourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="create-tour">
      <TourDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
