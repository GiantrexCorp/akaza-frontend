'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui';
import type { AdminTransferRoute, TransferType } from '@/types/transfer';

interface RouteTableProps {
  routes: AdminTransferRoute[];
}

const statusColors: Record<string, 'green' | 'gray'> = {
  active: 'green',
  inactive: 'gray',
};

const typeColors: Record<TransferType, 'blue' | 'yellow' | 'purple'> = {
  airport: 'blue',
  city: 'yellow',
  chauffeur: 'purple',
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

export default function RouteTable({ routes }: RouteTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Route</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Type</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Prices</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Status</th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Updated</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr
              key={route.id}
              onClick={() => router.push(`/admin/transfers/routes/${route.id}`)}
              className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">
                  {route.translated_pickup_name} &rarr; {route.translated_dropoff_name}
                </p>
              </td>
              <td className="px-4 py-4">
                <Badge label={route.transfer_type_label} color={typeColors[route.transfer_type] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4 text-sm text-[var(--text-secondary)] font-sans">
                {route.prices?.length || 0}
              </td>
              <td className="px-4 py-4">
                <Badge label={route.status === 'active' ? 'Active' : 'Inactive'} color={statusColors[route.status] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                {formatRelativeTime(route.updated_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
