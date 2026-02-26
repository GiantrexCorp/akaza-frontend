'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Select } from '@/components/ui';

interface TourFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function TourFilters({ onFiltersChange }: TourFiltersProps) {
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');

  const emitFilters = useCallback(
    (overrides?: Record<string, string>) => {
      const filters: Record<string, string> = { status, location, ...overrides };
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(filters)) {
        if (v) clean[k] = v;
      }
      onFiltersChange(clean);
    },
    [status, location, onFiltersChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => emitFilters(), 400);
    return () => clearTimeout(timer);
  }, [location]);

  const handleSelectChange = (value: string) => {
    setStatus(value);
    emitFilters({ status: value });
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
      <div className="w-52">
        <div className="relative">
          <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif text-sm py-1.5 pl-5 pr-0 outline-none transition-colors duration-300"
          />
        </div>
      </div>
    </div>
  );
}
