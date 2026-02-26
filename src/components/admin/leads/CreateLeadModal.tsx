'use client';

import { useState } from 'react';
import { Button, Input, Select, Modal, PhoneInput } from '@/components/ui';
import type { E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { adminLeadsApi } from '@/lib/api/admin-leads';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { LeadSource } from '@/types/customer';

interface CreateLeadModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'manual', label: 'Manual' },
  { value: 'hotel_booking', label: 'Hotel Booking' },
  { value: 'tour_booking', label: 'Tour Booking' },
  { value: 'transfer_booking', label: 'Transfer Booking' },
];

export default function CreateLeadModal({ open, onClose, onCreated }: CreateLeadModalProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<E164Number | undefined>(undefined);
  const [source, setSource] = useState<LeadSource>('website');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone(undefined);
    setSource('website');
    setNotes('');
    setFieldErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setFieldErrors({ phone: [phoneErr] });
      return;
    }
    setSubmitting(true);
    setFieldErrors({});

    try {
      await adminLeadsApi.create({
        name,
        email,
        phone: (phone as string) || undefined,
        source,
        notes: notes || undefined,
      });
      toast('success', 'Lead created successfully');
      resetForm();
      onCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        toast('error', err.errors[0] || 'Failed to create lead');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create Lead" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name?.[0]}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email?.[0]}
            required
          />
          <PhoneInput
            label="Phone"
            value={phone}
            onChange={setPhone}
            error={fieldErrors.phone?.[0]}
          />
          <Select
            label="Source"
            options={sourceOptions}
            value={source}
            onChange={(e) => setSource(e.target.value as LeadSource)}
            error={fieldErrors.source?.[0]}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-transparent border border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-sans text-sm p-3 outline-none transition-colors duration-300 resize-none"
          />
          {fieldErrors.notes && (
            <p className="text-red-400 text-xs font-sans mt-1">{fieldErrors.notes[0]}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Create Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
}
