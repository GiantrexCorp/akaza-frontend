'use client';

import { useState } from 'react';
import { Input, Select, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { routeFormSchema } from '@/lib/validation/schemas/admin';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import type { AdminTransferRoute, CreateRouteRequest, UpdateRouteRequest, TransferType } from '@/types/transfer';
import type { LocaleMap } from '@/types/admin-notification';

interface RouteFormProps {
  route?: AdminTransferRoute;
  onSaved: (route: AdminTransferRoute) => void;
}

const LOCALES = ['en', 'de', 'fr'];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const typeOptions = [
  { value: 'airport', label: 'Airport' },
  { value: 'city', label: 'City' },
  { value: 'chauffeur', label: 'Chauffeur' },
];

function initLocaleMap(source?: LocaleMap): LocaleMap {
  const map: LocaleMap = {};
  for (const locale of LOCALES) {
    map[locale] = source?.[locale] || '';
  }
  return map;
}

export default function RouteForm({ route, onSaved }: RouteFormProps) {
  const { toast } = useToast();
  const isEditing = !!route;
  const [activeLocale, setActiveLocale] = useState('en');
  const [pickupName, setPickupName] = useState<LocaleMap>(() => initLocaleMap(route?.pickup_name));
  const [dropoffName, setDropoffName] = useState<LocaleMap>(() => initLocaleMap(route?.dropoff_name));
  const [transferType, setTransferType] = useState<TransferType>(route?.transfer_type || 'airport');
  const [pickupCode, setPickupCode] = useState(route?.pickup_code || '');
  const [dropoffCode, setDropoffCode] = useState(route?.dropoff_code || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(route?.status || 'active');
  const [saving, setSaving] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const { errors: validationErrors, validate, clearError, clearErrors } = useFormValidation(routeFormSchema);

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
      pickup_name: { en: pickupName.en || '', de: pickupName.de || '', fr: pickupName.fr || '' },
      dropoff_name: { en: dropoffName.en || '', de: dropoffName.de || '', fr: dropoffName.fr || '' },
      transfer_type: transferType,
    })) {
      return;
    }

    setSaving(true);
    try {
      const base: CreateRouteRequest = {
        transfer_type: transferType,
        pickup_name: pickupName,
        dropoff_name: dropoffName,
        pickup_code: pickupCode || undefined,
        dropoff_code: dropoffCode || undefined,
      };

      let saved: AdminTransferRoute;
      if (isEditing) {
        saved = await adminTransfersApi.updateRoute(route.id, { ...base, status } as UpdateRouteRequest);
      } else {
        saved = await adminTransfersApi.createRoute(base);
      }
      toast('success', isEditing ? 'Route updated' : 'Route created');
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to save route');
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

      {/* Pickup + Dropoff name per locale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label={`Pickup Name (${activeLocale})`}
          size="sm"
          value={pickupName[activeLocale] || ''}
          onChange={(e) => { handleLocaleChange(setPickupName, activeLocale, e.target.value); clearError(`pickup_name.${activeLocale}`); }}
          error={fieldError(`pickup_name.${activeLocale}`)}
        />
        <Input
          label={`Dropoff Name (${activeLocale})`}
          size="sm"
          value={dropoffName[activeLocale] || ''}
          onChange={(e) => { handleLocaleChange(setDropoffName, activeLocale, e.target.value); clearError(`dropoff_name.${activeLocale}`); }}
          error={fieldError(`dropoff_name.${activeLocale}`)}
        />
      </div>

      {/* Type + Codes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Select
          label="Transfer Type"
          size="sm"
          options={typeOptions}
          value={transferType}
          onChange={(e) => setTransferType(e.target.value as TransferType)}
        />
        <Input
          label="Pickup Code"
          size="sm"
          value={pickupCode}
          onChange={(e) => setPickupCode(e.target.value)}
          placeholder="e.g. CAI"
        />
        <Input
          label="Dropoff Code"
          size="sm"
          value={dropoffCode}
          onChange={(e) => setDropoffCode(e.target.value)}
          placeholder="e.g. HRG"
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
          {isEditing ? 'Save Changes' : 'Create Route'}
        </Button>
      </div>
    </div>
  );
}
