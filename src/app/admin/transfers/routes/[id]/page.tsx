'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import RouteForm from '@/components/admin/transfers/RouteForm';
import dynamic from 'next/dynamic';
const RoutePriceManager = dynamic(() => import('@/components/admin/transfers/RoutePriceManager'), { ssr: false });
import { Spinner, Breadcrumb, Button, Badge, Modal, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useAdminRouteDetail, useDeleteRoute } from '@/hooks/admin/useAdminTransfers';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute, useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import type { AdminTransferRoute } from '@/types/transfer';

import { ACTIVE_STATUS_COLORS } from '@/lib/constants';

type Tab = 'info' | 'prices';
function RouteDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { data: route, isLoading, isError, error, refetch } = useAdminRouteDetail(id);
  useQueryErrorToast(isError, error, 'Failed to load route');
  const deleteMutation = useDeleteRoute();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canDelete = hasPermission(authUser, 'delete-transfer');

  useEffect(() => {
    document.title = route
      ? `${route.translated_pickup_name} → ${route.translated_dropoff_name} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [route]);

  const handleSaved = (_updated: AdminTransferRoute) => {
    refetch();
  };

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast('success', 'Route deleted');
        router.push('/admin/transfers');
      },
      onError: (err) => {
        if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to delete route');
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

  if (isError || !route) {
    return (
      <div className="py-16">
        <PageError
          status={(error as ApiError)?.status ?? 404}
          title={(error as ApiError)?.status === 404 ? 'Route Not Found' : undefined}
          onRetry={() => refetch()}
          backHref="/admin/transfers"
          backLabel="Back to Transfers"
        />
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
              <Badge label={route.status === 'active' ? 'Active' : 'Inactive'} color={ACTIVE_STATUS_COLORS[route.status] || 'gray'} />
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
            onPricesUpdated={() => refetch()}
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
            <Button size="sm" loading={deleteMutation.isPending} onClick={handleDelete}>
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
      <RouteDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
