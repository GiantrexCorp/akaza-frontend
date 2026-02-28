'use client';

import { useState, useEffect, use } from 'react';
import CustomerDetailHeader from '@/components/admin/customers/CustomerDetailHeader';
import CustomerInfoForm from '@/components/admin/customers/CustomerInfoForm';
import dynamic from 'next/dynamic';
const CustomerNotesTab = dynamic(() => import('@/components/admin/customers/CustomerNotesTab'), { ssr: false });
const CustomerBookingHistory = dynamic(() => import('@/components/admin/customers/CustomerBookingHistory'), { ssr: false });
import { Spinner, Breadcrumb, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useAdminCustomerDetail, useUpdateCustomer } from '@/hooks/admin/useAdminCustomers';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import { useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import type { Customer, CustomerStatus } from '@/types/customer';

type Tab = 'info' | 'notes' | 'bookings';

function CustomerDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const { data: customer, isLoading, isError, error, refetch } = useAdminCustomerDetail(id);
  useQueryErrorToast(isError, error, 'Failed to load customer');
  const updateMutation = useUpdateCustomer();
  const [activeTab, setActiveTab] = useState<Tab>('info');

  const canManageNotes = hasPermission(authUser, 'add-customer-notes');

  useEffect(() => {
    document.title = customer
      ? `${customer.full_name} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [customer]);

  const handleStatusChange = (status: CustomerStatus) => {
    if (!customer) return;
    updateMutation.mutate(
      { id: customer.id, data: { status } },
      {
        onSuccess: () => {
          refetch();
          toast('success', `Status changed to ${status}`);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast('error', err.errors[0] || 'Failed to update status');
          }
        },
      },
    );
  };

  const handleUpdated = (_updated: Customer) => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="py-16">
        <PageError
          status={(error as ApiError)?.status ?? 404}
          title={(error as ApiError)?.status === 404 ? 'Customer Not Found' : undefined}
          onRetry={() => refetch()}
          backHref="/admin/customers"
          backLabel="Back to Customers"
        />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; hidden?: boolean }[] = [
    { key: 'info', label: 'Information' },
    { key: 'notes', label: 'Notes', hidden: !canManageNotes },
    { key: 'bookings', label: 'Booking History' },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Customers', href: '/admin/customers' },
          { label: customer.full_name },
        ]}
      />

      <div className="mt-6 space-y-6">
        <CustomerDetailHeader
          customer={customer}
          onStatusChange={handleStatusChange}
          saving={updateMutation.isPending}
        />

        {/* Tab bar */}
        <div className="flex gap-6 border-b border-[var(--line-soft)]">
          {tabs
            .filter((t) => !t.hidden)
            .map((tab) => (
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
          <CustomerInfoForm customer={customer} onUpdated={handleUpdated} />
        )}
        {activeTab === 'notes' && canManageNotes && (
          <CustomerNotesTab customerId={customer.id} />
        )}
        {activeTab === 'bookings' && (
          <CustomerBookingHistory customerId={customer.id} />
        )}
      </div>
    </div>
  );
}

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminProtectedRoute permission="show-customer">
      <CustomerDetail id={Number(id)} />
    </AdminProtectedRoute>
  );
}
