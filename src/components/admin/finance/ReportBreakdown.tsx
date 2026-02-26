'use client';

import { Hotel, Ship, Car } from 'lucide-react';
import type { RevenueBreakdown } from '@/types/finance';

interface ReportBreakdownProps {
  breakdown: RevenueBreakdown;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

const items = [
  { key: 'hotel' as const, label: 'Hotel Revenue', icon: Hotel },
  { key: 'tour' as const, label: 'Tour Revenue', icon: Ship },
  { key: 'transfer' as const, label: 'Transfer Revenue', icon: Car },
];

export default function ReportBreakdown({ breakdown }: ReportBreakdownProps) {
  return (
    <div>
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-4">Revenue Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="border border-[var(--line-soft)] bg-[var(--surface-card)] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon size={18} className="text-primary" />
                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                  {item.label}
                </p>
              </div>
              <p className="text-2xl font-serif text-[var(--text-primary)]">
                {formatCurrency(breakdown[item.key])}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
