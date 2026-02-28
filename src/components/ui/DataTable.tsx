'use client';

import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, keyExtractor, onRowClick, emptyMessage = 'No data found' }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border border-[var(--line-soft)]">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-[var(--line-soft)]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-[var(--text-muted)] font-sans">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(item); } } : undefined}
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                className={`border-b border-[var(--line-soft)] last:border-b-0 hover:bg-white/[0.02] transition-colors ${onRowClick ? 'cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-4 ${col.className || ''}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
