'use client';

import { useEffect, useState } from 'react';
import { X, Edit3, UserCheck } from 'lucide-react';
import { Badge, Button, Input, Select } from '@/components/ui';
import { adminLeadsApi } from '@/lib/api/admin-leads';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { Lead, LeadStatus, LeadSource } from '@/types/customer';

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdated: () => void;
}

const statusColors: Record<LeadStatus, 'blue' | 'yellow' | 'orange' | 'green' | 'gray'> = {
  new: 'blue',
  contacted: 'yellow',
  qualified: 'orange',
  converted: 'green',
  lost: 'gray',
};

const sourceColors: Record<LeadSource, 'blue' | 'green' | 'purple' | 'orange' | 'gray'> = {
  hotel_booking: 'blue',
  tour_booking: 'green',
  transfer_booking: 'purple',
  website: 'orange',
  manual: 'gray',
};

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

const sourceOptions = [
  { value: 'hotel_booking', label: 'Hotel Booking' },
  { value: 'tour_booking', label: 'Tour Booking' },
  { value: 'transfer_booking', label: 'Transfer Booking' },
  { value: 'website', label: 'Website' },
  { value: 'manual', label: 'Manual' },
];

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function LeadDetailPanel({ lead, onClose, onUpdated }: LeadDetailPanelProps) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<LeadSource>('website');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setPhone(lead.phone || '');
      setSource(lead.source);
      setStatus(lead.status);
      setNotes(lead.notes || '');
      setEditing(false);
      setFieldErrors({});
    }
  }, [lead]);

  useEffect(() => {
    if (!lead) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lead, onClose]);

  if (!lead) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    try {
      await adminLeadsApi.update(lead.id, {
        name,
        email,
        phone: phone || null,
        source,
        status,
        notes: notes || null,
      });
      toast('success', 'Lead updated');
      setEditing(false);
      onUpdated();
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        toast('error', err.errors[0] || 'Failed to update lead');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConvert = async () => {
    if (!confirm('Convert this lead to a customer? This action cannot be undone.')) return;
    setConverting(true);
    try {
      await adminLeadsApi.convert(lead.id);
      toast('success', 'Lead converted to customer');
      onUpdated();
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to convert lead');
      }
    } finally {
      setConverting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-[560px] bg-[var(--surface-card)] border-l border-[var(--line-soft)] z-50 flex flex-col animate-slide-in-right">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line-soft)] shrink-0">
          <h2 className="text-lg font-serif text-[var(--text-primary)]">Lead Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-6">
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
                <Input
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={fieldErrors.phone?.[0]}
                />
                <Select
                  label="Source"
                  options={sourceOptions}
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                  error={fieldErrors.source?.[0]}
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  error={fieldErrors.status?.[0]}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-transparent border border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-sans text-sm p-3 outline-none transition-colors duration-300 resize-none"
                />
                {fieldErrors.notes && (
                  <p className="text-red-400 text-xs font-sans mt-1">{fieldErrors.notes[0]}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={saving} size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <>
              {/* Status + Source badges */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge label={lead.status_label} color={statusColors[lead.status] || 'gray'} />
                  <Badge label={lead.source_label} color={sourceColors[lead.source] || 'gray'} />
                </div>
              </div>

              {/* Metadata grid */}
              <div className="space-y-1">
                <h3 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
                  Details
                </h3>
                <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4">
                  <span className="text-xs text-[var(--text-muted)] font-sans">Name</span>
                  <span className="text-xs text-[var(--text-primary)] font-sans">{lead.name}</span>

                  <span className="text-xs text-[var(--text-muted)] font-sans">Email</span>
                  <span className="text-xs text-[var(--text-primary)] font-sans">{lead.email}</span>

                  <span className="text-xs text-[var(--text-muted)] font-sans">Phone</span>
                  <span className="text-xs text-[var(--text-primary)] font-sans">{lead.phone || '—'}</span>

                  <span className="text-xs text-[var(--text-muted)] font-sans">Source</span>
                  <span className="text-xs text-[var(--text-primary)] font-sans">{lead.source_label}</span>

                  <span className="text-xs text-[var(--text-muted)] font-sans">Status</span>
                  <span className="text-xs text-[var(--text-primary)] font-sans">{lead.status_label}</span>

                  <span className="text-xs text-[var(--text-muted)] font-sans">Assigned To</span>
                  <span className="text-xs text-[var(--text-primary)] font-mono">{lead.assigned_to ?? '—'}</span>

                  {lead.converted_at && (
                    <>
                      <span className="text-xs text-[var(--text-muted)] font-sans">Converted</span>
                      <span className="text-xs text-[var(--text-primary)] font-sans">{formatTimestamp(lead.converted_at)}</span>
                    </>
                  )}

                  <span className="text-xs text-[var(--text-muted)] font-sans">Created</span>
                  <span className="text-xs text-[var(--text-primary)] font-sans">{formatTimestamp(lead.created_at)}</span>

                  <span className="text-xs text-[var(--text-muted)] font-sans">Updated</span>
                  <span className="text-xs text-[var(--text-primary)] font-sans">{formatTimestamp(lead.updated_at)}</span>
                </div>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div>
                  <h3 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
                    Notes
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] font-sans whitespace-pre-wrap">{lead.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Edit3 size={14} />}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
                {lead.status !== 'converted' && (
                  <Button
                    size="sm"
                    icon={<UserCheck size={14} />}
                    onClick={handleConvert}
                    loading={converting}
                  >
                    Convert to Customer
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
