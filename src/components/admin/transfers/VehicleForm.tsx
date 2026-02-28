'use client';

import { useState } from 'react';
import { Input, Select, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { vehicleFormSchema } from '@/lib/validation/schemas/admin';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import type { AdminTransferVehicle, CreateVehicleRequest, UpdateVehicleRequest, VehicleType } from '@/types/transfer';
import type { LocaleMap } from '@/types/admin-notification';

interface VehicleFormProps {
  vehicle?: AdminTransferVehicle;
  onSaved: (vehicle: AdminTransferVehicle) => void;
}

const LOCALES = ['en', 'de', 'fr'];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const typeOptions = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'minibus', label: 'Minibus' },
  { value: 'limousine', label: 'Limousine' },
];

function initLocaleMap(source?: LocaleMap): LocaleMap {
  const map: LocaleMap = {};
  for (const locale of LOCALES) {
    map[locale] = source?.[locale] || '';
  }
  return map;
}

export default function VehicleForm({ vehicle, onSaved }: VehicleFormProps) {
  const { toast } = useToast();
  const isEditing = !!vehicle;
  const [activeLocale, setActiveLocale] = useState('en');
  const [name, setName] = useState<LocaleMap>(() => initLocaleMap(vehicle?.name));
  const [description, setDescription] = useState<LocaleMap>(() => initLocaleMap(vehicle?.description));
  const [type, setType] = useState<VehicleType>(vehicle?.type || 'sedan');
  const [maxPassengers, setMaxPassengers] = useState(vehicle?.max_passengers ? String(vehicle.max_passengers) : '');
  const [maxLuggage, setMaxLuggage] = useState(vehicle?.max_luggage ? String(vehicle.max_luggage) : '');
  const [sortOrder, setSortOrder] = useState(vehicle?.sort_order ? String(vehicle.sort_order) : '0');
  const [status, setStatus] = useState<'active' | 'inactive'>(vehicle?.status || 'active');
  const [saving, setSaving] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const { errors: validationErrors, validate, clearError, clearErrors } = useFormValidation(vehicleFormSchema);

  const handleLocaleChange = (
    setter: React.Dispatch<React.SetStateAction<LocaleMap>>,
    locale: string,
    value: string,
  ) => {
    setter((prev) => ({ ...prev, [locale]: value }));
  };

  const fieldError = (field: string): string | undefined =>
    validationErrors[field] || apiErrors[field];

  const handleSubmit = async () => {
    setApiErrors({});

    if (!validate({
      name: { en: name.en || '', de: name.de || '', fr: name.fr || '' },
      type,
      max_passengers: maxPassengers,
    })) {
      return;
    }

    setSaving(true);
    try {
      const base: CreateVehicleRequest = {
        name,
        description: Object.values(description).some(Boolean) ? description : undefined,
        type,
        max_passengers: Number(maxPassengers),
        max_luggage: maxLuggage ? Number(maxLuggage) : undefined,
        sort_order: sortOrder ? Number(sortOrder) : undefined,
      };

      let saved: AdminTransferVehicle;
      if (isEditing) {
        saved = await adminTransfersApi.updateVehicle(vehicle.id, { ...base, status } as UpdateVehicleRequest);
      } else {
        saved = await adminTransfersApi.createVehicle(base);
      }
      toast('success', isEditing ? 'Vehicle updated' : 'Vehicle created');
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to save vehicle');
        if (err.fieldErrors) {
          const mapped: Record<string, string> = {};
          for (const [k, v] of Object.entries(err.fieldErrors)) {
            mapped[k] = v[0];
          }
          setApiErrors(mapped);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Locale tabs */}
      <div className="flex gap-6 border-b border-[var(--line-soft)]">
        {LOCALES.map((locale) => (
          <button
            key={locale}
            onClick={() => setActiveLocale(locale)}
            className={`pb-3 text-xs font-sans font-bold uppercase tracking-[0.2em] transition-colors border-b-2 ${
              activeLocale === locale
                ? 'text-primary border-primary'
                : 'text-[var(--text-muted)] border-transparent hover:text-primary'
            }`}
          >
            {locale}
          </button>
        ))}
      </div>

      {/* Name + Description per locale */}
      <div className="space-y-6">
        <Input
          label={`Name (${activeLocale})`}
          size="sm"
          value={name[activeLocale] || ''}
          onChange={(e) => { handleLocaleChange(setName, activeLocale, e.target.value); clearError(`name.${activeLocale}`); }}
          error={fieldError(`name.${activeLocale}`)}
        />
        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
            Description ({activeLocale})
          </label>
          <textarea
            value={description[activeLocale] || ''}
            onChange={(e) => handleLocaleChange(setDescription, activeLocale, e.target.value)}
            rows={4}
            className="w-full bg-transparent border border-[var(--line-soft)] focus:border-primary text-[var(--field-text)] font-serif text-sm px-4 py-3 outline-none transition-colors duration-300 resize-y"
          />
        </div>
      </div>

      {/* Type + Max Passengers + Max Luggage + Sort Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Select
          label="Type"
          size="sm"
          options={typeOptions}
          value={type}
          onChange={(e) => setType(e.target.value as VehicleType)}
        />
        <Input
          label="Max Passengers"
          size="sm"
          type="number"
          value={maxPassengers}
          onChange={(e) => { setMaxPassengers(e.target.value); clearError('max_passengers'); }}
          error={fieldError('max_passengers')}
        />
        <Input
          label="Max Luggage"
          size="sm"
          type="number"
          value={maxLuggage}
          onChange={(e) => setMaxLuggage(e.target.value)}
        />
        <Input
          label="Sort Order"
          size="sm"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </div>

      {/* Status (edit only) */}
      {isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Select
            label="Status"
            size="sm"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
          />
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end pt-4 border-t border-[var(--line-soft)]">
        <Button size="md" loading={saving} onClick={handleSubmit}>
          {isEditing ? 'Save Changes' : 'Create Vehicle'}
        </Button>
      </div>
    </div>
  );
}
