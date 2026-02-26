'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui';
import type { AdminTour, TourStatus } from '@/types/tour';

interface TourTableProps {
  tours: AdminTour[];
}

const statusColors: Record<TourStatus, 'yellow' | 'green' | 'gray'> = {
  draft: 'yellow',
  active: 'green',
  inactive: 'gray',
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

export default function TourTable({ tours }: TourTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Title
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Location
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Price
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Capacity
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Status
            </th>
            <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr
              key={tour.id}
              onClick={() => router.push(`/admin/tours/${tour.id}`)}
              className="border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{tour.translated_title}</p>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">{tour.slug}</p>
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-secondary)] font-sans">
                {tour.location}
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-serif text-[var(--text-primary)]">{tour.formatted_price}</p>
              </td>
              <td className="px-4 py-4 text-sm text-[var(--text-secondary)] font-sans">
                {tour.max_capacity}
              </td>
              <td className="px-4 py-4">
                <Badge label={tour.status_label} color={statusColors[tour.status] || 'gray'} size="sm" />
              </td>
              <td className="px-4 py-4 text-xs text-[var(--text-muted)] font-sans">
                {formatRelativeTime(tour.updated_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
