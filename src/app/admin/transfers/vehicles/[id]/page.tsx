'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import VehicleForm from '@/components/admin/transfers/VehicleForm';
import VehicleImageManager from '@/components/admin/transfers/VehicleImageManager';
import { Spinner, Breadcrumb, Button, Badge, Modal, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute, useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import type { AdminTransferVehicle } from '@/types/transfer';

type Tab = 'info' | 'image';

const statusColors: Record<string, 'green' | 'gray'> = {
  active: 'green',
  inactive: 'gray',
};

function VehicleDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [vehicle, setVehicle] = useState<AdminTransferVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canDelete = hasPermission(authUser, 'delete-transfer');

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const data = await adminTransfersApi.getVehicle(id);
        if (!cancelled) setVehicle(data);
      } catch (err) {
        if (!cancelled && err instanceof ApiError) {
          setError(err);
          toast('error', err.errors[0] || 'Failed to load vehicle');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, retryCount]);

  useEffect(() => {
    document.title = vehicle
      ? `${vehicle.translated_name} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [vehicle]);

  const handleSaved = (updated: AdminTransferVehicle) => {
    setVehicle(updated);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminTransfersApi.deleteVehicle(id);
      toast('success', 'Vehicle deleted');
      router.push('/admin/transfers');
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to delete vehicle');
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

  if (error || !vehicle) {
    return (
      <div className="py-16">
        <PageError
          status={error?.status ?? 404}
          title={error?.status === 404 ? 'Vehicle Not Found' : undefined}
          onRetry={() => setRetryCount((c) => c + 1)}
          backHref="/admin/transfers"
          backLabel="Back to Transfers"
        />
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Information' },
    { key: 'image', label: 'Image' },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Transfers', href: '/admin/transfers' },
          { label: vehicle.translated_name },
        ]}
      />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">{vehicle.translated_name}</h1>
              <Badge label={vehicle.status === 'active' ? 'Active' : 'Inactive'} color={statusColors[vehicle.status] || 'gray'} />
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans mt-2">
              {vehicle.type_label} &middot; {vehicle.max_passengers} passengers
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
          <VehicleForm vehicle={vehicle} onSaved={handleSaved} />
        )}
        {activeTab === 'image' && (
          <VehicleImageManager vehicle={vehicle} onUpdated={setVehicle} />
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Vehicle">
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)] font-sans">
            Are you sure you want to delete <strong>{vehicle.translated_name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button size="sm" loading={deleting} onClick={handleDelete}>
              Delete Vehicle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function AdminVehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="create-transfer">
      <VehicleDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
