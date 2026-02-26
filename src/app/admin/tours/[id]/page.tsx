'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import TourForm from '@/components/admin/tours/TourForm';
import TourAvailabilityManager from '@/components/admin/tours/TourAvailabilityManager';
import TourImageManager from '@/components/admin/tours/TourImageManager';
import { Spinner, Breadcrumb, Button, Badge, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminToursApi } from '@/lib/api/admin-tours';
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
  const [tour, setTour] = useState<AdminTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canUpdate = hasPermission(authUser, 'update-tour');
  const canDelete = hasPermission(authUser, 'delete-tour');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await adminToursApi.get(id);
        setTour(data);
      } catch (err) {
        if (err instanceof ApiError) {
          toast('error', err.errors[0] || 'Failed to load tour');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleSaved = (updated: AdminTour) => {
    setTour(updated);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminToursApi.delete(id);
      toast('success', 'Tour deleted');
      router.push('/admin/tours');
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to delete tour');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-4">Tour Not Found</h2>
        <Link href="/admin/tours">
          <Button variant="outline">Back to Tours</Button>
        </Link>
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
            onUpdated={(images) => setTour({ ...tour, images })}
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
            <Button size="sm" loading={deleting} onClick={handleDelete}>
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
