'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Select } from '@/components/ui';
import { ALL_ROLES } from '@/lib/permissions';

interface UserListFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'admin', label: 'Admin' },
  { value: 'customer', label: 'Customer' },
];

const roleOptions = [
  { value: '', label: 'All Roles' },
  ...ALL_ROLES.map((r) => ({ value: r.name, label: r.label })),
];

export default function UserListFilters({ onFiltersChange }: UserListFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [role, setRole] = useState('');

  const emitFilters = useCallback(
    (overrides?: Record<string, string>) => {
      const filters: Record<string, string> = { search, status, type, role, ...overrides };
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(filters)) {
        if (v) clean[k] = v;
      }
      onFiltersChange(clean);
    },
    [search, status, type, role, onFiltersChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => emitFilters(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSelectChange = (key: string, value: string) => {
    if (key === 'status') setStatus(value);
    if (key === 'type') setType(value);
    if (key === 'role') setRole(value);
    emitFilters({ [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      {/* Search */}
      <div className="flex-1 min-w-0 w-full sm:max-w-xs">
        <div className="relative">
          <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif text-lg py-2 pl-6 pr-0 outline-none transition-colors duration-300"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="w-36">
          <Select
            size="sm"
            options={statusOptions}
            value={status}
            onChange={(e) => handleSelectChange('status', e.target.value)}
          />
        </div>
        <div className="w-32">
          <Select
            size="sm"
            options={typeOptions}
            value={type}
            onChange={(e) => handleSelectChange('type', e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select
            size="sm"
            options={roleOptions}
            value={role}
            onChange={(e) => handleSelectChange('role', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
