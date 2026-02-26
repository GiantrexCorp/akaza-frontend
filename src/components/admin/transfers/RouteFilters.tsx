'use client';

import { useState } from 'react';
import { Select } from '@/components/ui';

interface RouteFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'airport', label: 'Airport' },
  { value: 'city', label: 'City' },
  { value: 'chauffeur', label: 'Chauffeur' },
];

export default function RouteFilters({ onFiltersChange }: RouteFiltersProps) {
  const [status, setStatus] = useState('');
  const [transferType, setTransferType] = useState('');

  const emitFilters = (overrides?: Record<string, string>) => {
    const filters: Record<string, string> = { status, transfer_type: transferType, ...overrides };
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v) clean[k] = v;
    }
    onFiltersChange(clean);
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
      <div className="w-44">
        <Select
          size="sm"
          options={statusOptions}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            emitFilters({ status: e.target.value });
          }}
        />
      </div>
      <div className="w-44">
        <Select
          size="sm"
          options={typeOptions}
          value={transferType}
          onChange={(e) => {
            setTransferType(e.target.value);
            emitFilters({ transfer_type: e.target.value });
          }}
        />
      </div>
    </div>
  );
}
