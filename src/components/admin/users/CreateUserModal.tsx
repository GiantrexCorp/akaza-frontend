'use client';

import { useState } from 'react';
import { Button, Input, Select, Modal, PhoneInput } from '@/components/ui';
import type { E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { adminUsersApi } from '@/lib/api/admin-users';
import { ApiError } from '@/lib/api/client';
import { ALL_ROLES } from '@/lib/permissions';
import { useToast } from '@/components/ui/Toast';
import type { CreateUserRequest } from '@/types/admin';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
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

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

export default function CreateUserModal({ open, onClose, onCreated }: CreateUserModalProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [phone, setPhone] = useState<E164Number | undefined>(undefined);
  const [type, setType] = useState<'customer' | 'admin'>('customer');
  const [status, setStatus] = useState<'active' | 'inactive' | 'suspended'>('active');
  const [locale, setLocale] = useState<'en' | 'ar' | 'de' | 'fr'>('en');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setPhone(undefined);
    setType('customer');
    setStatus('active');
    setLocale('en');
    setSelectedRoles([]);
    setFieldErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleRole = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setFieldErrors({ phone: [phoneErr] });
      return;
    }
    setSubmitting(true);
    setFieldErrors({});

    try {
      const data: CreateUserRequest = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        type,
        status,
        locale,
      };
      if (phone) data.phone = phone as string;
      if (selectedRoles.length > 0) data.roles = selectedRoles;

      await adminUsersApi.create(data);
      toast('success', 'User created successfully');
      resetForm();
      onCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
        toast('error', err.errors[0] || 'Failed to create user');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create User" maxWidth="2xl">
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
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password?.[0]}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            error={fieldErrors.password_confirmation?.[0]}
            required
          />
          <PhoneInput
            label="Phone"
            value={phone}
            onChange={setPhone}
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
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive' | 'suspended')}
            error={fieldErrors.status?.[0]}
          />
          <Select
            label="Locale"
            options={localeOptions}
            value={locale}
            onChange={(e) => setLocale(e.target.value as 'en' | 'ar' | 'de' | 'fr')}
            error={fieldErrors.locale?.[0]}
          />
        </div>

        {/* Role chips */}
        <div>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">
            Roles
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_ROLES.map((role) => {
              const isSelected = selectedRoles.includes(role.name);
              return (
                <button
                  key={role.name}
                  type="button"
                  onClick={() => toggleRole(role.name)}
                  className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary/15 border-primary text-primary'
                      : 'bg-transparent border-[var(--line-soft)] text-[var(--text-muted)] hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
          {fieldErrors.roles && (
            <p className="text-red-400 text-xs font-sans mt-2">{fieldErrors.roles[0]}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
}
