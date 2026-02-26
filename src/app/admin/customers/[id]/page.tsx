'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import CustomerDetailHeader from '@/components/admin/customers/CustomerDetailHeader';
import CustomerInfoForm from '@/components/admin/customers/CustomerInfoForm';
import CustomerNotesTab from '@/components/admin/customers/CustomerNotesTab';
import CustomerBookingHistory from '@/components/admin/customers/CustomerBookingHistory';
import { Spinner, Breadcrumb, Button, PageError } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminCustomersApi } from '@/lib/api/admin-customers';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import { useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import type { Customer, CustomerStatus } from '@/types/customer';

type Tab = 'info' | 'notes' | 'bookings';

function CustomerDetail({ id }: { id: number }) {
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [statusSaving, setStatusSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('info');

  const canManageNotes = hasPermission(authUser, 'add-customer-notes');

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const data = await adminCustomersApi.get(id);
        if (!cancelled) setCustomer(data);
      } catch (err) {
        if (!cancelled && err instanceof ApiError) {
          setError(err);
          toast('error', err.errors[0] || 'Failed to load customer');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, retryCount]);

  useEffect(() => {
    document.title = customer
      ? `${customer.full_name} | Akaza Admin`
      : 'Loading... | Akaza Admin';
  }, [customer]);

  const handleStatusChange = async (status: CustomerStatus) => {
    if (!customer) return;
    setStatusSaving(true);
    try {
      const updated = await adminCustomersApi.update(customer.id, { status });
      setCustomer(updated);
      toast('success', `Status changed to ${status}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to update status');
      }
    } finally {
      setStatusSaving(false);
    }
  };

  const handleUpdated = (updated: Customer) => {
    setCustomer(updated);
  };

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="py-16">
        <PageError
          status={error?.status ?? 404}
          title={error?.status === 404 ? 'Customer Not Found' : undefined}
          onRetry={() => setRetryCount((c) => c + 1)}
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
          saving={statusSaving}
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
