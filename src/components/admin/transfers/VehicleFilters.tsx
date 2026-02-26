'use client';

import { useState } from 'react';
import { Select } from '@/components/ui';

interface VehicleFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'minibus', label: 'Minibus' },
  { value: 'limousine', label: 'Limousine' },
];

export default function VehicleFilters({ onFiltersChange }: VehicleFiltersProps) {
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const emitFilters = (overrides?: Record<string, string>) => {
    const filters: Record<string, string> = { status, type, ...overrides };
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
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            emitFilters({ type: e.target.value });
          }}
        />
      </div>
    </div>
  );
}
