'use client';

import { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [name, setName] = useState(customer.name);
  const [surname, setSurname] = useState(customer.surname);
  const [phone, setPhone] = useState(customer.phone || '');
  const [nationality, setNationality] = useState(customer.nationality || '');
  const [language, setLanguage] = useState(customer.language || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});

    try {
      const updated = await adminCustomersApi.update(customer.id, {
        name,
        surname,
        phone: phone || null,
        nationality: nationality || null,
        language: language || null,
      });
      onUpdated(updated);
      toast('success', 'Customer info updated');
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
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
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name?.[0]}
            required
          />
          <Input
            label="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            error={fieldErrors.surname?.[0]}
            required
          />
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={fieldErrors.phone?.[0]}
          />
          <Input
            label="Nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            error={fieldErrors.nationality?.[0]}
          />
          <Select
            label="Language"
            options={languageOptions}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            error={fieldErrors.language?.[0]}
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
