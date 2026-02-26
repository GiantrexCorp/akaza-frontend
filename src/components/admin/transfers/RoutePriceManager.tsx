'use client';

import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { Input, Button, Spinner } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import type { AdminTransferVehicle, AdminRoutePrice } from '@/types/transfer';

interface RoutePriceManagerProps {
  routeId: number;
  prices: AdminRoutePrice[];
  onPricesUpdated: (prices: AdminRoutePrice[]) => void;
}

interface PriceRow {
  vehicle: AdminTransferVehicle;
  price: AdminRoutePrice | null;
}

export default function RoutePriceManager({ routeId, prices, onPricesUpdated }: RoutePriceManagerProps) {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<AdminTransferVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editCurrency, setEditCurrency] = useState('EUR');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await adminTransfersApi.listVehicles('filter[status]=active&sort=sort_order');
        setVehicles(data);
      } catch (err) {
        if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const rows: PriceRow[] = vehicles.map((vehicle) => ({
    vehicle,
    price: prices.find((p) => p.transfer_vehicle_id === vehicle.id) || null,
  }));

  const startEdit = (vehicleId: number, existingPrice: AdminRoutePrice | null) => {
    setEditingId(vehicleId);
    setEditPrice(existingPrice?.price || '');
    setEditCurrency(existingPrice?.currency || 'EUR');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const handleSave = async (vehicleId: number) => {
    if (!editPrice || Number(editPrice) <= 0) {
      toast('error', 'Please enter a valid price');
      return;
    }

    setSaving(true);
    try {
      const updated = await adminTransfersApi.setRoutePrice(routeId, {
        transfer_vehicle_id: vehicleId,
        price: Number(editPrice),
        currency: editCurrency,
      });
      onPricesUpdated(updated.prices);
      setEditingId(null);
      setEditPrice('');
      toast('success', 'Price saved');
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to save price');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-sm text-[var(--text-muted)] font-sans py-8 text-center">
        No active vehicles found. Create vehicles first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans">
        Prices by Vehicle ({prices.length} configured)
      </h3>

      <div className="border border-[var(--line-soft)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--line-soft)]">
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Vehicle</th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Type</th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Price</th>
              <th className="text-left px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Currency</th>
              <th className="text-right px-4 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ vehicle, price }) => (
              <tr key={vehicle.id} className="border-b border-[var(--line-soft)] last:border-b-0">
                <td className="px-4 py-3 text-sm font-serif text-[var(--text-primary)]">
                  {vehicle.translated_name}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--text-muted)] font-sans capitalize">
                  {vehicle.type}
                </td>
                <td className="px-4 py-3">
                  {editingId === vehicle.id ? (
                    <Input
                      size="sm"
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      icon={<DollarSign size={14} />}
                    />
                  ) : (
                    <p className="text-sm font-serif text-[var(--text-primary)]">
                      {price ? price.price : <span className="text-[var(--text-muted)] italic">Not set</span>}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--text-secondary)] font-sans">
                  {editingId === vehicle.id ? (
                    <select
                      value={editCurrency}
                      onChange={(e) => setEditCurrency(e.target.value)}
                      className="bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] font-serif text-sm py-1 outline-none"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                    </select>
                  ) : (
                    price?.currency || '—'
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === vehicle.id ? (
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                      <Button size="sm" loading={saving} onClick={() => handleSave(vehicle.id)}>Save</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => startEdit(vehicle.id, price)}>
                      {price ? 'Edit' : 'Set Price'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
