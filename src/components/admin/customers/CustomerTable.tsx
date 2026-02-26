'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui';
import type { Customer, CustomerStatus, CustomerSource } from '@/types/customer';

interface CustomerTableProps {
  customers: Customer[];
}

const statusColors: Record<CustomerStatus, 'green' | 'gray' | 'yellow'> = {
  active: 'green',
  inactive: 'gray',
  vip: 'yellow',
};

const sourceColors: Record<CustomerSource, 'blue' | 'gray' | 'purple'> = {
  booking: 'blue',
  manual: 'gray',
  lead: 'purple',
};

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Name / Email
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Phone
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Source
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Status
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Bookings / Spent
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Last Booking
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              onClick={() => router.push(`/admin/customers/${customer.id}`)}
              className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{customer.full_name}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{customer.email}</p>
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-secondary)] font-sans">
                {customer.phone || '—'}
              </td>
              <td className="px-4 py-4">
                <Badge label={customer.source_label} color={sourceColors[customer.source] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4">
                <Badge label={customer.status_label} color={statusColors[customer.status] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{customer.total_bookings}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
                  {customer.total_spent.toLocaleString()} {customer.currency}
                </p>
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                {formatRelativeTime(customer.last_booking_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
