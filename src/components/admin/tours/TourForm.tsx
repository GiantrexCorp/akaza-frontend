'use client';

import { useState, useId } from 'react';
import { Input, Select, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { tourFormSchema } from '@/lib/validation/schemas/admin';
import { adminToursApi } from '@/lib/api/admin-tours';
import { ApiError } from '@/lib/api/client';
import type { AdminTour, CreateTourRequest, UpdateTourRequest, TourStatus } from '@/types/tour';
import type { LocaleMap } from '@/types/admin-notification';

interface TourFormProps {
  tour?: AdminTour;
  onSaved: (tour: AdminTour) => void;
}

const LOCALES = ['en', 'de', 'fr'];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const currencyOptions = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' },
];

function initLocaleMap(source?: LocaleMap): LocaleMap {
  const map: LocaleMap = {};
  for (const locale of LOCALES) {
    map[locale] = source?.[locale] || '';
  }
  return map;
}

export default function TourForm({ tour, onSaved }: TourFormProps) {
  const { toast } = useToast();
  const descriptionId = useId();
  const isEditing = !!tour;
  const [activeLocale, setActiveLocale] = useState('en');
  const [title, setTitle] = useState<LocaleMap>(() => initLocaleMap(tour?.title));
  const [description, setDescription] = useState<LocaleMap>(() => initLocaleMap(tour?.description));
  const [location, setLocation] = useState(tour?.location || '');
  const [latitude, setLatitude] = useState(tour?.latitude != null ? String(tour.latitude) : '');
  const [longitude, setLongitude] = useState(tour?.longitude != null ? String(tour.longitude) : '');
  const [durationHours, setDurationHours] = useState(tour?.duration_hours != null ? String(tour.duration_hours) : '');
  const [durationDays, setDurationDays] = useState(tour?.duration_days != null ? String(tour.duration_days) : '');
  const [pricePerPerson, setPricePerPerson] = useState(tour?.price_per_person || '');
  const [maxCapacity, setMaxCapacity] = useState(tour?.max_capacity ? String(tour.max_capacity) : '');
  const [currency, setCurrency] = useState(tour?.currency || 'EUR');
  const [status, setStatus] = useState<TourStatus>(tour?.status || 'draft');
  const [highlights, setHighlights] = useState(tour?.highlights?.join(', ') || '');
  const [includes, setIncludes] = useState(tour?.includes?.join(', ') || '');
  const [excludes, setExcludes] = useState(tour?.excludes?.join(', ') || '');
  const [saving, setSaving] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const { errors: validationErrors, validate, clearError, clearErrors } = useFormValidation(tourFormSchema);

  const handleLocaleChange = (
    setter: React.Dispatch<React.SetStateAction<LocaleMap>>,
    locale: string,
    value: string,
  ) => {
    setter((prev) => ({ ...prev, [locale]: value }));
  };

  const parseList = (str: string): string[] =>
    str.split(',').map((s) => s.trim()).filter(Boolean);

  const fieldError = (field: string): string | undefined =>
    validationErrors[field] || apiErrors[field];

  const handleSubmit = async () => {
    setApiErrors({});

    if (!validate({
      title: { en: title.en || '', de: title.de || '', fr: title.fr || '' },
      description: { en: description.en || '', de: description.de || '', fr: description.fr || '' },
      location,
      price_per_person: pricePerPerson,
      max_capacity: maxCapacity,
      currency,
    })) {
      return;
    }

    setSaving(true);
    try {
      const base: CreateTourRequest = {
        title,
        description,
        location,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        duration_hours: durationHours ? Number(durationHours) : null,
        duration_days: durationDays ? Number(durationDays) : null,
        price_per_person: Number(pricePerPerson),
        max_capacity: Number(maxCapacity),
        currency,
        highlights: parseList(highlights),
        includes: parseList(includes),
        excludes: parseList(excludes),
      };

      let saved: AdminTour;
      if (isEditing) {
        saved = await adminToursApi.update(tour.id, { ...base, status } as UpdateTourRequest);
      } else {
        saved = await adminToursApi.create(base);
      }
      toast('success', isEditing ? 'Tour updated' : 'Tour created');
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to save tour');
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

      {/* Title + Description per locale */}
      <div className="space-y-6">
        <Input
          label={`Title (${activeLocale})`}
          size="sm"
          value={title[activeLocale] || ''}
          onChange={(e) => { handleLocaleChange(setTitle, activeLocale, e.target.value); clearError(`title.${activeLocale}`); }}
          error={fieldError(`title.${activeLocale}`)}
        />
        <div>
          <label htmlFor={descriptionId} className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
            Description ({activeLocale})
          </label>
          <textarea
            id={descriptionId}
            value={description[activeLocale] || ''}
            onChange={(e) => { handleLocaleChange(setDescription, activeLocale, e.target.value); clearError(`description.${activeLocale}`); }}
            rows={6}
            className="w-full bg-transparent border border-[var(--line-soft)] focus:border-primary text-[var(--field-text)] font-serif text-sm px-4 py-3 outline-none transition-colors duration-300 resize-y"
          />
          {fieldError(`description.${activeLocale}`) && (
            <p className="text-red-400 text-xs font-sans mt-1">
              {fieldError(`description.${activeLocale}`)}
            </p>
          )}
        </div>
      </div>

      {/* Location + Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Input
          label="Location"
          size="sm"
          value={location}
          onChange={(e) => { setLocation(e.target.value); clearError('location'); }}
          error={fieldError('location')}
        />
        <Input
          label="Latitude"
          size="sm"
          type="number"
          step="0.0001"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <Input
          label="Longitude"
          size="sm"
          type="number"
          step="0.0001"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>

      {/* Duration + Price + Capacity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Input
          label="Duration (hours)"
          size="sm"
          type="number"
          value={durationHours}
          onChange={(e) => setDurationHours(e.target.value)}
        />
        <Input
          label="Duration (days)"
          size="sm"
          type="number"
          value={durationDays}
          onChange={(e) => setDurationDays(e.target.value)}
        />
        <Input
          label="Price per person"
          size="sm"
          type="number"
          step="0.01"
          value={pricePerPerson}
          onChange={(e) => { setPricePerPerson(e.target.value); clearError('price_per_person'); }}
          error={fieldError('price_per_person')}
        />
        <Input
          label="Max capacity"
          size="sm"
          type="number"
          value={maxCapacity}
          onChange={(e) => { setMaxCapacity(e.target.value); clearError('max_capacity'); }}
          error={fieldError('max_capacity')}
        />
      </div>

      {/* Currency + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Select
          label="Currency"
          size="sm"
          options={currencyOptions}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
        {isEditing && (
          <Select
            label="Status"
            size="sm"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as TourStatus)}
          />
        )}
      </div>

      {/* Lists: Highlights, Includes, Excludes */}
      <div className="space-y-6">
        <Input
          label="Highlights (comma-separated)"
          size="sm"
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="Visit the Great Pyramid, Sphinx photo stop"
        />
        <Input
          label="Includes (comma-separated)"
          size="sm"
          value={includes}
          onChange={(e) => setIncludes(e.target.value)}
          placeholder="Transport, Guide, Lunch"
        />
        <Input
          label="Excludes (comma-separated)"
          size="sm"
          value={excludes}
          onChange={(e) => setExcludes(e.target.value)}
          placeholder="Tips, Personal expenses"
        />
      </div>

      {/* Save */}
      <div className="flex justify-end pt-4 border-t border-[var(--line-soft)]">
        <Button size="md" loading={saving} onClick={handleSubmit}>
          {isEditing ? 'Save Changes' : 'Create Tour'}
        </Button>
      </div>
    </div>
  );
}
