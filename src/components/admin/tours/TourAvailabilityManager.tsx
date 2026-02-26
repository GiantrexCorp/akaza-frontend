'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, X, Check } from 'lucide-react';
import { Button, Badge, Input, Spinner } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminToursApi } from '@/lib/api/admin-tours';
import { ApiError } from '@/lib/api/client';
import type { TourAvailability } from '@/types/tour';

interface TourAvailabilityManagerProps {
  tourId: number;
}

export default function TourAvailabilityManager({ tourId }: TourAvailabilityManagerProps) {
  const { toast } = useToast();
  const [availabilities, setAvailabilities] = useState<TourAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newSpots, setNewSpots] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editSpots, setEditSpots] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAvailabilities = async () => {
    setLoading(true);
    try {
      const data = await adminToursApi.listAvailabilities(tourId);
      setAvailabilities(data);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load availabilities');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, [tourId]);

  const handleAdd = async () => {
    if (!newDate || !newSpots) { toast('error', 'Date and spots are required'); return; }
    setSaving(true);
    try {
      await adminToursApi.createAvailability(tourId, {
        date: newDate,
        start_time: newTime || undefined,
        total_spots: Number(newSpots),
        price_override: newPrice ? Number(newPrice) : null,
      });
      toast('success', 'Availability added');
      setShowAdd(false);
      setNewDate(''); setNewTime(''); setNewSpots(''); setNewPrice('');
      fetchAvailabilities();
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (avail: TourAvailability) => {
    setEditingId(avail.id);
    setEditDate(avail.date);
    setEditTime(avail.start_time || '');
    setEditSpots(String(avail.total_spots));
    setEditPrice(avail.price_override != null ? String(avail.price_override) : '');
  };

  const handleUpdate = async (availId: number) => {
    setSaving(true);
    try {
      await adminToursApi.updateAvailability(tourId, availId, {
        date: editDate,
        start_time: editTime || undefined,
        total_spots: Number(editSpots),
        price_override: editPrice ? Number(editPrice) : null,
      });
      toast('success', 'Availability updated');
      setEditingId(null);
      fetchAvailabilities();
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (availId: number) => {
    try {
      await adminToursApi.deleteAvailability(tourId, availId);
      toast('success', 'Availability deleted');
      fetchAvailabilities();
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to delete');
    }
  };

  const statusColors: Record<string, 'green' | 'red' | 'gray'> = {
    available: 'green',
    sold_out: 'red',
  };

  if (loading) return <div className="py-8"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans">
          Availabilities ({availabilities.length})
        </h3>
        <Button size="sm" variant="outline" icon={<Plus size={14} />} onClick={() => setShowAdd(!showAdd)}>
          Add Slot
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="border border-[var(--line-soft)] p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="Date" size="sm" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            <Input label="Start time" size="sm" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            <Input label="Total spots" size="sm" type="number" value={newSpots} onChange={(e) => setNewSpots(e.target.value)} />
            <Input label="Price override" size="sm" type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="Optional" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button size="sm" loading={saving} onClick={handleAdd}>Add</Button>
          </div>
        </div>
      )}

      {/* Table */}
      {availabilities.length > 0 && (
        <div className="overflow-x-auto border border-[var(--line-soft)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--line-soft)]">
                <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Date</th>
                <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Time</th>
                <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Spots</th>
                <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Price</th>
                <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Status</th>
                <th className="text-right px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availabilities.map((avail) => (
                <tr key={avail.id} className="border-b border-[var(--line-soft)] last:border-b-0">
                  {editingId === avail.id ? (
                    <>
                      <td className="px-4 py-3"><input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="bg-transparent border-b border-[var(--line-strong)] text-[var(--field-text)] font-serif text-sm py-1 outline-none w-32" /></td>
                      <td className="px-4 py-3"><input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="bg-transparent border-b border-[var(--line-strong)] text-[var(--field-text)] font-serif text-sm py-1 outline-none w-20" /></td>
                      <td className="px-4 py-3"><input type="number" value={editSpots} onChange={(e) => setEditSpots(e.target.value)} className="bg-transparent border-b border-[var(--line-strong)] text-[var(--field-text)] font-serif text-sm py-1 outline-none w-16" /></td>
                      <td className="px-4 py-3"><input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="—" className="bg-transparent border-b border-[var(--line-strong)] text-[var(--field-text)] font-serif text-sm py-1 outline-none w-20 placeholder-[var(--field-placeholder)]" /></td>
                      <td className="px-4 py-3"><Badge label={avail.status_label} color={statusColors[avail.status] || 'gray'} size="sm" /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-[var(--text-muted)] hover:text-red-400 transition-colors"><X size={14} /></button>
                          <button onClick={() => handleUpdate(Number(avail.id))} className="p-1.5 text-[var(--text-muted)] hover:text-primary transition-colors"><Check size={14} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-4 text-sm font-serif text-[var(--text-primary)]">{avail.date}</td>
                      <td className="px-4 py-4 text-xs text-[var(--text-secondary)] font-sans">{avail.start_time || '—'}</td>
                      <td className="px-4 py-4 text-xs text-[var(--text-secondary)] font-sans">{avail.booked_spots}/{avail.total_spots}</td>
                      <td className="px-4 py-4 text-sm font-serif text-[var(--text-primary)]">{avail.price_override != null ? avail.price_override : avail.effective_price}</td>
                      <td className="px-4 py-4"><Badge label={avail.status_label} color={statusColors[avail.status] || 'gray'} size="sm" /></td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => startEdit(avail)} className="p-1.5 text-[var(--text-muted)] hover:text-primary transition-colors"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(Number(avail.id))} className="p-1.5 text-[var(--text-muted)] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
