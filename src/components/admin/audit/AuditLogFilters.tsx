'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Select } from '@/components/ui';

interface AuditLogFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

const actionOptions = [
  { value: '', label: 'All Actions' },
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
  { value: 'deleted', label: 'Deleted' },
  { value: 'status_changed', label: 'Status Changed' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'reconciled', label: 'Reconciled' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'markup_changed', label: 'Markup Changed' },
  { value: 'settings_updated', label: 'Settings Updated' },
  { value: 'role_assigned', label: 'Role Assigned' },
  { value: 'exported', label: 'Exported' },
];

const entityTypeOptions = [
  { value: '', label: 'All Entity Types' },
  { value: 'user', label: 'User' },
  { value: 'hotel_booking', label: 'Hotel Booking' },
  { value: 'tour', label: 'Tour' },
  { value: 'tour_booking', label: 'Tour Booking' },
  { value: 'transfer_vehicle', label: 'Transfer Vehicle' },
  { value: 'transfer_route', label: 'Transfer Route' },
  { value: 'transfer_booking', label: 'Transfer Booking' },
  { value: 'customer', label: 'Customer' },
  { value: 'lead', label: 'Lead' },
  { value: 'setting', label: 'Setting' },
];

export default function AuditLogFilters({ onFiltersChange }: AuditLogFiltersProps) {
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');
  const [userId, setUserId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const emitFilters = useCallback(
    (overrides?: Record<string, string>) => {
      const filters: Record<string, string> = {
        action, entity_type: entityType, entity_id: entityId,
        user_id: userId, date_from: dateFrom, date_to: dateTo,
        ...overrides,
      };
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(filters)) {
        if (v) clean[k] = v;
      }
      onFiltersChange(clean);
    },
    [action, entityType, entityId, userId, dateFrom, dateTo, onFiltersChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => emitFilters(), 400);
    return () => clearTimeout(timer);
  }, [entityId, userId]);

  const handleSelectChange = (key: string, value: string) => {
    if (key === 'action') setAction(value);
    if (key === 'entity_type') setEntityType(value);
    emitFilters({ [key]: value });
  };

  const handleDateChange = (key: 'date_from' | 'date_to', value: string) => {
    if (key === 'date_from') setDateFrom(value);
    if (key === 'date_to') setDateTo(value);
    emitFilters({ [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
      {/* Action */}
      <div className="w-44">
        <Select
          size="sm"
          options={actionOptions}
          value={action}
          onChange={(e) => handleSelectChange('action', e.target.value)}
        />
      </div>

      {/* Entity Type */}
      <div className="w-48">
        <Select
          size="sm"
          options={entityTypeOptions}
          value={entityType}
          onChange={(e) => handleSelectChange('entity_type', e.target.value)}
        />
      </div>

      {/* Entity ID */}
      <div className="w-32">
        <div className="relative">
          <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="Entity ID"
            className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif text-sm py-1.5 pl-5 pr-0 outline-none transition-colors duration-300"
          />
        </div>
      </div>

      {/* User ID */}
      <div className="w-32">
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

      {/* Date From */}
      <div className="w-40">
        <label className="block text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">
          From
        </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => handleDateChange('date_from', e.target.value)}
          className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] font-serif text-sm py-1.5 outline-none transition-colors duration-300"
        />
      </div>

      {/* Date To */}
      <div className="w-40">
        <label className="block text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">
          To
        </label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => handleDateChange('date_to', e.target.value)}
          className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] font-serif text-sm py-1.5 outline-none transition-colors duration-300"
        />
      </div>
    </div>
  );
}
