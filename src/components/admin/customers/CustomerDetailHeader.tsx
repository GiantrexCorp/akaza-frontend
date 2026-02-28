'use client';

import { Badge, Select } from '@/components/ui';
import type { Customer, CustomerStatus, CustomerSource } from '@/types/customer';

import { CUSTOMER_STATUS_COLORS } from '@/lib/constants';

interface CustomerDetailHeaderProps {
  customer: Customer;
  onStatusChange: (status: CustomerStatus) => void;
  saving: boolean;
}
const sourceColors: Record<CustomerSource, 'blue' | 'gray' | 'purple'> = {
  booking: 'blue',
  manual: 'gray',
  lead: 'purple',
};

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'vip', label: 'VIP' },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function CustomerDetailHeader({ customer, onStatusChange, saving }: CustomerDetailHeaderProps) {
  return (
    <div className="pb-6 border-b border-[var(--line-soft)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">{customer.full_name}</h1>
            <Badge label={customer.source_label} color={sourceColors[customer.source] || 'gray'} size="sm" />
            <Badge label={customer.status_label} color={CUSTOMER_STATUS_COLORS[customer.status] || 'gray'} size="sm" />
          </div>
          <p className="text-sm text-[var(--text-muted)] font-sans">{customer.email}</p>
        </div>

        <div className="w-36">
          <Select
            size="sm"
            options={statusOptions}
            value={customer.status}
            onChange={(e) => onStatusChange(e.target.value as CustomerStatus)}
            disabled={saving}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-8 mt-6">
        <div>
          <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">
            Bookings
          </p>
          <p className="text-lg font-serif text-[var(--text-primary)]">{customer.total_bookings}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">
            Total Spent
          </p>
          <p className="text-lg font-serif text-[var(--text-primary)]">
            {customer.total_spent.toLocaleString()} {customer.currency}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">
            Last Booking
          </p>
          <p className="text-lg font-serif text-[var(--text-primary)]">{formatDate(customer.last_booking_at)}</p>
        </div>
      </div>
    </div>
  );
}
