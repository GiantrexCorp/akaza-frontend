'use client';

import { useState, useId } from 'react';
import { Modal, Select, Button } from '@/components/ui';
import type { TourBookingStatus } from '@/types/tour';

interface StatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  currentStatus: TourBookingStatus;
  onSubmit: (status: TourBookingStatus, reason?: string) => void;
  loading: boolean;
}

const allowedTransitions: Record<TourBookingStatus, TourBookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['cancelled', 'completed', 'no_show'],
  cancelled: [],
  completed: [],
  no_show: [],
};

const statusLabels: Record<TourBookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
  no_show: 'No Show',
};

export default function StatusChangeModal({ open, onClose, currentStatus, onSubmit, loading }: StatusChangeModalProps) {
  const [newStatus, setNewStatus] = useState<TourBookingStatus | ''>('');
  const [reason, setReason] = useState('');
  const reasonId = useId();

  const allowed = allowedTransitions[currentStatus] || [];
  const statusOptions = [
    { value: '', label: 'Select Status' },
    ...allowed.map((s) => ({ value: s, label: statusLabels[s] })),
  ];

  const handleSubmit = () => {
    if (!newStatus) return;
    onSubmit(newStatus, reason || undefined);
  };

  const handleClose = () => {
    setNewStatus('');
    setReason('');
    onClose();
  };

  if (allowed.length === 0) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Change Booking Status">
      <div className="space-y-4">
        <Select
          label="New Status"
          size="sm"
          options={statusOptions}
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as TourBookingStatus)}
        />
        <div>
          <label htmlFor={reasonId} className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
            Reason (optional)
          </label>
          <textarea
            id={reasonId}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full bg-transparent border border-[var(--line-soft)] focus:border-primary text-[var(--field-text)] font-serif text-sm px-4 py-3 outline-none transition-colors duration-300 resize-y"
            placeholder="Optional reason for status change"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
          <Button size="sm" loading={loading} disabled={!newStatus} onClick={handleSubmit}>
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}
