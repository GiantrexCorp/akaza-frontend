'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pin, Edit3, Trash2, StickyNote } from 'lucide-react';
import { Button, Badge, Modal, Input, Select, Spinner, EmptyState } from '@/components/ui';
import { useFormValidation } from '@/hooks/useFormValidation';
import { customerNoteSchema } from '@/lib/validation/schemas/admin';
import { adminCustomersApi } from '@/lib/api/admin-customers';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { CustomerNote, NoteType } from '@/types/customer';

interface CustomerNotesTabProps {
  customerId: number;
}

const noteTypeColors: Record<NoteType, 'gray' | 'yellow' | 'red'> = {
  note: 'gray',
  follow_up: 'yellow',
  complaint: 'red',
};

const noteTypeOptions = [
  { value: 'note', label: 'Note' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'complaint', label: 'Complaint' },
];

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CustomerNotesTab({ customerId }: CustomerNotesTabProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editNote, setEditNote] = useState<CustomerNote | null>(null);
  const [deleteNote, setDeleteNote] = useState<CustomerNote | null>(null);

  const [formType, setFormType] = useState<NoteType>('note');
  const [formContent, setFormContent] = useState('');
  const [formPinned, setFormPinned] = useState(false);
  const [formFollowUpDate, setFormFollowUpDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiFieldErrors, setApiFieldErrors] = useState<Record<string, string[]>>({});
  const { errors: validationErrors, validate, clearError, clearErrors } = useFormValidation(customerNoteSchema);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCustomersApi.listNotes(customerId);
      const sorted = [...data].sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setNotes(sorted);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load notes');
      }
    } finally {
      setLoading(false);
    }
  }, [customerId, toast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const resetForm = () => {
    setFormType('note');
    setFormContent('');
    setFormPinned(false);
    setFormFollowUpDate('');
    setApiFieldErrors({});
    clearErrors();
  };

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (note: CustomerNote) => {
    setFormType(note.type);
    setFormContent(note.content);
    setFormPinned(note.is_pinned);
    setFormFollowUpDate(note.follow_up_date || '');
    setApiFieldErrors({});
    clearErrors();
    setEditNote(note);
  };

  const fieldError = (field: string): string | undefined =>
    validationErrors[field] || apiFieldErrors[field]?.[0];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiFieldErrors({});

    if (!validate({
      type: formType,
      content: formContent,
      follow_up_date: formFollowUpDate,
      pinned: formPinned,
    })) {
      return;
    }

    setSubmitting(true);
    try {
      await adminCustomersApi.createNote(customerId, {
        type: formType,
        content: formContent,
        is_pinned: formPinned,
        follow_up_date: formFollowUpDate || undefined,
      });
      toast('success', 'Note created');
      setCreateOpen(false);
      resetForm();
      fetchNotes();
    } catch (err) {
      if (err instanceof ApiError) {
        setApiFieldErrors(err.fieldErrors);
        toast('error', err.errors[0] || 'Failed to create note');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNote) return;
    setSubmitting(true);
    setApiFieldErrors({});
    try {
      await adminCustomersApi.updateNote(customerId, editNote.id, {
        type: formType,
        content: formContent,
        is_pinned: formPinned,
        follow_up_date: formFollowUpDate || null,
      });
      toast('success', 'Note updated');
      setEditNote(null);
      resetForm();
      fetchNotes();
    } catch (err) {
      if (err instanceof ApiError) {
        setApiFieldErrors(err.fieldErrors);
        toast('error', err.errors[0] || 'Failed to update note');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteNote) return;
    setSubmitting(true);
    try {
      await adminCustomersApi.deleteNote(customerId, deleteNote.id);
      toast('success', 'Note deleted');
      setDeleteNote(null);
      fetchNotes();
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to delete note');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const noteForm = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Select
          label="Type"
          options={noteTypeOptions}
          value={formType}
          onChange={(e) => { setFormType(e.target.value as NoteType); clearError('type'); }}
          error={fieldError('type')}
        />
        <Input
          label="Follow-up Date"
          type="date"
          value={formFollowUpDate}
          onChange={(e) => { setFormFollowUpDate(e.target.value); clearError('follow_up_date'); }}
          error={fieldError('follow_up_date')}
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
          Content
        </label>
        <textarea
          value={formContent}
          onChange={(e) => { setFormContent(e.target.value); clearError('content'); }}
          rows={4}
          required
          className="w-full bg-transparent border border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-sans text-sm p-3 outline-none transition-colors duration-300 resize-none"
        />
        {fieldError('content') && (
          <p className="text-red-400 text-xs font-sans mt-1">{fieldError('content')}</p>
        )}
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formPinned}
          onChange={(e) => setFormPinned(e.target.checked)}
          className="accent-primary"
        />
        <span className="text-xs font-sans text-[var(--text-secondary)]">Pin this note</span>
      </label>
    </div>
  );

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif text-[var(--text-primary)]">Notes</h2>
        <Button size="sm" icon={<Plus size={14} />} onClick={openCreate}>
          Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon={<StickyNote size={48} strokeWidth={1} />}
          title="No Notes"
          description="Add a note to keep track of customer interactions."
        />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge label={note.type_label} color={noteTypeColors[note.type] || 'gray'} size="sm" />
                  {note.is_pinned && (
                    <Pin size={12} className="text-primary" />
                  )}
                  {note.follow_up_date && (
                    <span className="text-[10px] text-[var(--text-muted)] font-sans">
                      Follow-up: {note.follow_up_date}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(note)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-primary transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteNote(note)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] font-sans whitespace-pre-wrap">{note.content}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-sans mt-3">{formatTimestamp(note.created_at)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create Note Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Note" maxWidth="lg">
        <form onSubmit={handleCreateSubmit} className="space-y-6">
          {noteForm}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Create Note
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Note Modal */}
      <Modal open={!!editNote} onClose={() => setEditNote(null)} title="Edit Note" maxWidth="lg">
        <form onSubmit={handleEditSubmit} className="space-y-6">
          {noteForm}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setEditNote(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteNote} onClose={() => setDeleteNote(null)} title="Delete Note" maxWidth="sm">
        <p className="text-sm text-[var(--text-secondary)] font-sans mb-6">
          Are you sure you want to delete this note? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => setDeleteNote(null)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} loading={submitting} className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
