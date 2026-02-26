'use client';

import { useState } from 'react';
import { Select } from '@/components/ui';
import type { NotificationType, NotificationChannel } from '@/types/admin-notification';

interface TemplateFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

const typeOptions: { value: string; label: string }[] = [
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

const channelOptions: { value: string; label: string }[] = [
  { value: '', label: 'All Channels' },
  { value: 'mail', label: 'Email' },
  { value: 'database', label: 'Database' },
];

const activeOptions: { value: string; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' },
];

export default function TemplateFilters({ onFiltersChange }: TemplateFiltersProps) {
  const [type, setType] = useState('');
  const [channel, setChannel] = useState('');
  const [active, setActive] = useState('');

  const emitFilters = (overrides?: Record<string, string>) => {
    const filters: Record<string, string> = { type, channel, is_active: active, ...overrides };
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v) clean[k] = v;
    }
    onFiltersChange(clean);
  };

  const handleChange = (key: string, value: string) => {
    if (key === 'type') setType(value);
    if (key === 'channel') setChannel(value);
    if (key === 'is_active') setActive(value);
    emitFilters({ [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
      <div className="w-56">
        <Select
          size="sm"
          options={typeOptions}
          value={type}
          onChange={(e) => handleChange('type', e.target.value)}
        />
      </div>
      <div className="w-40">
        <Select
          size="sm"
          options={channelOptions}
          value={channel}
          onChange={(e) => handleChange('channel', e.target.value)}
        />
      </div>
      <div className="w-36">
        <Select
          size="sm"
          options={activeOptions}
          value={active}
          onChange={(e) => handleChange('is_active', e.target.value)}
        />
      </div>
    </div>
  );
}
