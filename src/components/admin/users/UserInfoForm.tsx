'use client';

import { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { adminUsersApi } from '@/lib/api/admin-users';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { AdminUser } from '@/types/admin';

interface UserInfoFormProps {
  user: AdminUser;
  onUpdated: (user: AdminUser) => void;
}

const localeOptions = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
];

const typeOptions = [
  { value: 'customer', label: 'Customer' },
  { value: 'admin', label: 'Admin' },
];

export default function UserInfoForm({ user, onUpdated }: UserInfoFormProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [type, setType] = useState(user.type);
  const [locale, setLocale] = useState(user.locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});

    try {
      const updated = await adminUsersApi.update(user.id, {
        name,
        email,
        phone: phone || null,
        type,
        locale,
      });
      onUpdated(updated);
      toast('success', 'User info updated');
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        toast('error', err.errors[0] || 'Failed to update user');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
      <h2 className="text-lg font-serif text-[var(--text-primary)] mb-6">User Information</h2>
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
            label="Type"
            options={typeOptions}
            value={type}
            onChange={(e) => setType(e.target.value as 'customer' | 'admin')}
            error={fieldErrors.type?.[0]}
          />
          <Select
            label="Locale"
            options={localeOptions}
            value={locale}
            onChange={(e) => setLocale(e.target.value as 'en' | 'ar' | 'de' | 'fr')}
            error={fieldErrors.locale?.[0]}
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
