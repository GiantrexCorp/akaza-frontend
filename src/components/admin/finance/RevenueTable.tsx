'use client';

import { DataTable } from '@/components/ui';
import type { Column } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import type { MonthlyTrendItem } from '@/types/finance';

interface RevenueTableProps {
  periods: MonthlyTrendItem[];
}

function formatPeriodLabel(period: string): string {
  if (period.length === 4) return period;
  if (period.length === 10) {
    const date = new Date(period + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  const [year, month] = period.split('-');
  if (!month) return period;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const columns: Column<MonthlyTrendItem>[] = [
  {
    key: 'period',
    header: 'Period',
    render: (item) => (
      <span className="text-sm font-sans text-[var(--text-primary)]">{formatPeriodLabel(item.period)}</span>
    ),
  },
  {
    key: 'revenue',
    header: 'Revenue',
    render: (item) => (
      <span className="text-sm font-serif text-[var(--text-primary)]">{formatPrice(item.revenue, 'USD')}</span>
    ),
  },
  {
    key: 'bookings',
    header: 'Bookings',
    render: (item) => (
      <span className="text-sm font-sans text-[var(--text-secondary)]">{item.bookings}</span>
    ),
  },
];

export default function RevenueTable({ periods }: RevenueTableProps) {
  return (
    <div>
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-4">Revenue by Period</h2>
      <DataTable
        columns={columns}
        data={periods}
        keyExtractor={(item) => item.period}
      />
    </div>
  );
}
