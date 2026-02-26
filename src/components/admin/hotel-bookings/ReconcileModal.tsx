'use client';

import { useState } from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import type { ReconcileAction } from '@/types/hotel';

interface ReconcileModalProps {
  open: boolean;
  onClose: () => void;
  onReconcile: (action: ReconcileAction, reason?: string) => void;
  loading: boolean;
}

export default function ReconcileModal({ open, onClose, onReconcile, loading }: ReconcileModalProps) {
  const [selectedAction, setSelectedAction] = useState<ReconcileAction | null>(null);
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setSelectedAction(null);
    setReason('');
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedAction) return;
    onReconcile(selectedAction, selectedAction === 'refund' ? reason : undefined);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Reconcile Booking">
      <p className="text-sm text-[var(--text-secondary)] font-sans mb-6">
        This booking is pending reconciliation. Choose an action to resolve it.
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setSelectedAction('retry')}
          className={`flex-1 p-4 border text-left transition-colors ${
            selectedAction === 'retry'
              ? 'border-primary bg-primary/5'
              : 'border-[var(--line-soft)] hover:border-primary/50'
          }`}
        >
          <RotateCcw size={16} className="text-primary mb-2" />
          <p className="text-sm font-serif text-[var(--text-primary)]">Retry Booking</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-1">
            Attempt to confirm the booking again with the provider.
          </p>
        </button>
        <button
          onClick={() => setSelectedAction('refund')}
          className={`flex-1 p-4 border text-left transition-colors ${
            selectedAction === 'refund'
              ? 'border-primary bg-primary/5'
              : 'border-[var(--line-soft)] hover:border-primary/50'
          }`}
        >
          <Undo2 size={16} className="text-primary mb-2" />
          <p className="text-sm font-serif text-[var(--text-primary)]">Refund</p>
          <p className="text-xs text-[var(--text-muted)] font-sans mt-1">
            Cancel and refund the booking to the customer.
          </p>
        </button>
      </div>

      {selectedAction === 'refund' && (
        <div className="mb-6">
          <label className="block text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Provide a reason for the refund..."
            className="w-full bg-transparent border border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-sans text-sm p-3 outline-none transition-colors duration-300 resize-none"
          />
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={!selectedAction || (selectedAction === 'refund' && !reason.trim())}
        >
          {selectedAction === 'retry' ? 'Retry Booking' : selectedAction === 'refund' ? 'Confirm Refund' : 'Select Action'}
        </Button>
      </div>
    </Modal>
  );
}
