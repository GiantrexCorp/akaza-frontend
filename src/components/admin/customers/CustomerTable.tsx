'use client';

import { useRouter } from 'next/navigation';
import { Badge, DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/format';
import type { Customer, CustomerSource } from '@/types/customer';

import { CUSTOMER_STATUS_COLORS } from '@/lib/constants';

interface CustomerTableProps {
  customers: Customer[];
}
const sourceColors: Record<CustomerSource, 'blue' | 'gray' | 'purple'> = {
  booking: 'blue',
  manual: 'gray',
  lead: 'purple',
};

export default function CustomerTable({ customers }: CustomerTableProps) {
  const router = useRouter();

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Name / Email',
      render: (customer) => (
        <>
          <p className="text-sm font-serif text-[var(--text-primary)]">{customer.full_name}</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{customer.email}</p>
        </>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (customer) => (
        <span className="text-xs text-[var(--text-secondary)] font-sans">
          {customer.phone || '—'}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      render: (customer) => (
        <Badge label={customer.source_label} color={sourceColors[customer.source] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (customer) => (
        <Badge label={customer.status_label} color={CUSTOMER_STATUS_COLORS[customer.status] || 'gray'} size="sm" />
      ),
    },
    {
      key: 'bookings',
      header: 'Bookings / Spent',
      render: (customer) => (
        <>
          <p className="text-sm font-serif text-[var(--text-primary)]">{customer.total_bookings}</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
            {customer.total_spent.toLocaleString()} {customer.currency}
          </p>
        </>
      ),
    },
    {
      key: 'lastBooking',
      header: 'Last Booking',
      render: (customer) => (
        <span className="text-xs text-[var(--text-muted)] font-sans">
          {formatRelativeTime(customer.last_booking_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={customers}
      keyExtractor={(customer) => customer.id}
      onRowClick={(customer) => router.push(`/admin/customers/${customer.id}`)}
    />
  );
}
