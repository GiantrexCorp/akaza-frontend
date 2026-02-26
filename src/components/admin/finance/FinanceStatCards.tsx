'use client';

import { DollarSign, Hotel, Ship, Car } from 'lucide-react';
import type { FinanceDashboard } from '@/types/finance';

interface FinanceStatCardsProps {
  dashboard: FinanceDashboard;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

const cards = [
  { key: 'total', label: 'Total Revenue', icon: DollarSign, getValue: (d: FinanceDashboard) => d.total_revenue },
  { key: 'hotel', label: 'Hotel Revenue', icon: Hotel, getValue: (d: FinanceDashboard) => d.breakdown.hotel },
  { key: 'tour', label: 'Tour Revenue', icon: Ship, getValue: (d: FinanceDashboard) => d.breakdown.tour },
  { key: 'transfer', label: 'Transfer Revenue', icon: Car, getValue: (d: FinanceDashboard) => d.breakdown.transfer },
] as const;

export default function FinanceStatCards({ dashboard }: FinanceStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="border border-[var(--line-soft)] bg-[var(--surface-card)] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 border border-[var(--line-soft)]">
                <Icon size={18} className="text-primary" />
              </div>
              <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                {card.label}
              </p>
            </div>
            <p className="text-2xl font-serif text-[var(--text-primary)]">
              {formatCurrency(card.getValue(dashboard))}
            </p>
          </div>
        );
      })}
    </div>
  );
}
