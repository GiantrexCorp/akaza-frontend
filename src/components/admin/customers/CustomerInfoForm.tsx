'use client';

import { useState } from 'react';
import { Button, Input, Select, PhoneInput } from '@/components/ui';
import type { E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { useFormValidation } from '@/hooks/useFormValidation';
import { customerInfoSchema } from '@/lib/validation/schemas/admin';
import { adminCustomersApi } from '@/lib/api/admin-customers';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { Customer } from '@/types/customer';

interface CustomerInfoFormProps {
  customer: Customer;
  onUpdated: (customer: Customer) => void;
}

const languageOptions = [
  { value: '', label: 'Not Set' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
];

export default function CustomerInfoForm({ customer, onUpdated }: CustomerInfoFormProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [apiFieldErrors, setApiFieldErrors] = useState<Record<string, string[]>>({});
  const { errors: validationErrors, validate, clearError, clearErrors } = useFormValidation(customerInfoSchema);

  const [name, setName] = useState(customer.name);
  const [surname, setSurname] = useState(customer.surname);
  const [phone, setPhone] = useState<E164Number | undefined>((customer.phone as E164Number) || undefined);
  const [nationality, setNationality] = useState(customer.nationality || '');
  const [language, setLanguage] = useState(customer.language || '');

  const fieldError = (field: string): string | undefined =>
    validationErrors[field] || apiFieldErrors[field]?.[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiFieldErrors({});

    if (!validate({ name, surname })) {
      return;
    }

    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setApiFieldErrors({ phone: [phoneErr] });
      return;
    }

    setSaving(true);

    try {
      const updated = await adminCustomersApi.update(customer.id, {
        name,
        surname,
        phone: (phone as string) || null,
        nationality: nationality || null,
        language: language || null,
      });
      onUpdated(updated);
      toast('success', 'Customer info updated');
    } catch (err) {
      if (err instanceof ApiError) {
        setApiFieldErrors(err.fieldErrors);
        toast('error', err.errors[0] || 'Failed to update customer');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-6">Customer Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Name"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError('name'); }}
            error={fieldError('name')}
            required
          />
          <Input
            label="Surname"
            value={surname}
            onChange={(e) => { setSurname(e.target.value); clearError('surname'); }}
            error={fieldError('surname')}
            required
          />
          <PhoneInput
            label="Phone"
            value={phone}
            onChange={(val) => { setPhone(val); setApiFieldErrors((prev) => { const next = { ...prev }; delete next.phone; return next; }); }}
            error={fieldError('phone')}
          />
          <Input
            label="Nationality"
            value={nationality}
            onChange={(e) => { setNationality(e.target.value); setApiFieldErrors((prev) => { const next = { ...prev }; delete next.nationality; return next; }); }}
            error={fieldError('nationality')}
          />
          <Select
            label="Language"
            options={languageOptions}
            value={language}
            onChange={(e) => { setLanguage(e.target.value); setApiFieldErrors((prev) => { const next = { ...prev }; delete next.language; return next; }); }}
            error={fieldError('language')}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={saving} size="sm">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
