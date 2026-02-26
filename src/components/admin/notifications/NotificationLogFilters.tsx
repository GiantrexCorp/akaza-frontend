'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Select } from '@/components/ui';

interface NotificationLogFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'hotel_booking_confirmed', label: 'Hotel Booking Confirmed' },
  { value: 'hotel_booking_cancelled', label: 'Hotel Booking Cancelled' },
  { value: 'tour_booking_confirmed', label: 'Tour Booking Confirmed' },
  { value: 'tour_booking_cancelled', label: 'Tour Booking Cancelled' },
  { value: 'transfer_booking_confirmed', label: 'Transfer Booking Confirmed' },
  { value: 'transfer_booking_cancelled', label: 'Transfer Booking Cancelled' },
  { value: 'voucher_delivery', label: 'Voucher Delivery' },
  { value: 'reconciliation_alert', label: 'Reconciliation Alert' },
];

const channelOptions = [
  { value: '', label: 'All Channels' },
  { value: 'mail', label: 'Email' },
  { value: 'database', label: 'Database' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'sent', label: 'Sent' },
  { value: 'failed', label: 'Failed' },
];

export default function NotificationLogFilters({ onFiltersChange }: NotificationLogFiltersProps) {
  const [type, setType] = useState('');
  const [channel, setChannel] = useState('');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const emitFilters = useCallback(
    (overrides?: Record<string, string>) => {
      const filters: Record<string, string> = {
        type, channel, status, user_id: userId, date_from: dateFrom, date_to: dateTo,
        ...overrides,
      };
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(filters)) {
        if (v) clean[k] = v;
      }
      onFiltersChange(clean);
    },
    [type, channel, status, userId, dateFrom, dateTo, onFiltersChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => emitFilters(), 400);
    return () => clearTimeout(timer);
  }, [userId]);

  const handleSelectChange = (key: string, value: string) => {
    if (key === 'type') setType(value);
    if (key === 'channel') setChannel(value);
    if (key === 'status') setStatus(value);
    emitFilters({ [key]: value });
  };

  const handleDateChange = (key: 'date_from' | 'date_to', value: string) => {
    if (key === 'date_from') setDateFrom(value);
    if (key === 'date_to') setDateTo(value);
    emitFilters({ [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
      {/* Type */}
      <div className="w-56">
        <Select
          size="sm"
          options={typeOptions}
          value={type}
          onChange={(e) => handleSelectChange('type', e.target.value)}
        />
      </div>

      {/* Channel */}
      <div className="w-40">
        <Select
          size="sm"
          options={channelOptions}
          value={channel}
          onChange={(e) => handleSelectChange('channel', e.target.value)}
        />
      </div>

      {/* Status */}
      <div className="w-36">
        <Select
          size="sm"
          options={statusOptions}
          value={status}
          onChange={(e) => handleSelectChange('status', e.target.value)}
        />
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
