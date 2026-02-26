'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import RouteForm from '@/components/admin/transfers/RouteForm';
import RoutePriceManager from '@/components/admin/transfers/RoutePriceManager';
import { Spinner, Breadcrumb, Button, Badge, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute, useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import type { AdminTransferRoute } from '@/types/transfer';

type Tab = 'info' | 'prices';

const statusColors: Record<string, 'green' | 'gray'> = {
  active: 'green',
  inactive: 'gray',
};

function RouteDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [route, setRoute] = useState<AdminTransferRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canDelete = hasPermission(authUser, 'delete-transfer');

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const data = await adminTransfersApi.getRoute(id);
        setRoute(data);
      } catch (err) {
        if (err instanceof ApiError) {
          toast('error', err.errors[0] || 'Failed to load route');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [id]);

  const handleSaved = (updated: AdminTransferRoute) => {
    setRoute(updated);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminTransfersApi.deleteRoute(id);
      toast('success', 'Route deleted');
      router.push('/admin/transfers');
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to delete route');
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

  if (!route) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-4">Route Not Found</h2>
        <Link href="/admin/transfers">
          <Button variant="outline">Back to Transfers</Button>
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Information' },
    { key: 'prices', label: 'Prices' },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Transfers', href: '/admin/transfers' },
          { label: `${route.translated_pickup_name} → ${route.translated_dropoff_name}` },
        ]}
      />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">
                {route.translated_pickup_name} &rarr; {route.translated_dropoff_name}
              </h1>
              <Badge label={route.status === 'active' ? 'Active' : 'Inactive'} color={statusColors[route.status] || 'gray'} />
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans mt-2">
              {route.transfer_type_label} &middot; {route.prices?.length || 0} price{(route.prices?.length || 0) !== 1 ? 's' : ''} configured
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
          <RouteForm route={route} onSaved={handleSaved} />
        )}
        {activeTab === 'prices' && (
          <RoutePriceManager
            routeId={route.id}
            prices={route.prices || []}
            onPricesUpdated={(prices) => setRoute({ ...route, prices })}
          />
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Route">
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)] font-sans">
            Are you sure you want to delete this route? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button size="sm" loading={deleting} onClick={handleDelete}>
              Delete Route
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function AdminRouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="create-transfer">
      <AdminLayout>
        <RouteDetail id={Number(id)} />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
