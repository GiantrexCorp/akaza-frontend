'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Select } from '@/components/ui';

interface TransferBookingFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
  { value: 'no_show', label: 'No Show' },
];

export default function TransferBookingFilters({ onFiltersChange }: TransferBookingFiltersProps) {
  const [status, setStatus] = useState('');
  const [routeId, setRouteId] = useState('');
  const [userId, setUserId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const emitFilters = useCallback(
    (overrides?: Record<string, string>) => {
      const filters: Record<string, string> = {
        status, route_id: routeId, user_id: userId,
        date_from: dateFrom, date_to: dateTo, ...overrides,
      };
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(filters)) {
        if (v) clean[k] = v;
      }
      onFiltersChange(clean);
    },
    [status, routeId, userId, dateFrom, dateTo, onFiltersChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => emitFilters(), 400);
    return () => clearTimeout(timer);
  }, [routeId, userId]);

  const handleSelectChange = (value: string) => {
    setStatus(value);
    emitFilters({ status: value });
  };

  const handleDateChange = (key: 'date_from' | 'date_to', value: string) => {
    if (key === 'date_from') setDateFrom(value);
    if (key === 'date_to') setDateTo(value);
    emitFilters({ [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
      <div className="w-44">
        <Select
          size="sm"
          options={statusOptions}
          value={status}
          onChange={(e) => handleSelectChange(e.target.value)}
        />
      </div>
      <div className="w-28">
        <div className="relative">
          <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            placeholder="Route ID"
            className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif text-sm py-1.5 pl-5 pr-0 outline-none transition-colors duration-300"
          />
        </div>
      </div>
      <div className="w-28">
        <div className="relative">
          <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif text-sm py-1.5 pl-5 pr-0 outline-none transition-colors duration-300"
          />
        </div>
      </div>
      <div className="w-40">
        <label className="block text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">From</label>
        <input type="date" value={dateFrom} onChange={(e) => handleDateChange('date_from', e.target.value)} className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] font-serif text-sm py-1.5 outline-none transition-colors duration-300" />
      </div>
      <div className="w-40">
        <label className="block text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">To</label>
        <input type="date" value={dateTo} onChange={(e) => handleDateChange('date_to', e.target.value)} className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] font-serif text-sm py-1.5 outline-none transition-colors duration-300" />
      </div>
    </div>
  );
}
