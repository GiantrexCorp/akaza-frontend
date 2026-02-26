'use client';

import type { MonthlyTrendItem } from '@/types/finance';

interface MonthlyTrendTableProps {
  trends: MonthlyTrendItem[];
}

function formatPeriodLabel(period: string): string {
  const [year, month] = period.split('-');
  if (!month) return period;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function MonthlyTrendTable({ trends }: MonthlyTrendTableProps) {
  return (
    <div>
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-4">Monthly Trend</h2>
      <div className="overflow-x-auto border border-[var(--line-soft)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--line-soft)]">
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                Period
              </th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                Revenue
              </th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                Bookings
              </th>
            </tr>
          </thead>
          <tbody>
            {trends.map((item) => (
              <tr
                key={item.period}
                className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-4 text-sm font-sans text-[var(--text-primary)]">
                  {formatPeriodLabel(item.period)}
                </td>
                <td className="px-4 py-4 text-sm font-serif text-[var(--text-primary)]">
                  {formatCurrency(item.revenue)}
                </td>
                <td className="px-4 py-4 text-sm font-sans text-[var(--text-secondary)]">
                  {item.bookings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
