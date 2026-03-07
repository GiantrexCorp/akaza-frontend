'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { User, Mail, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardLayout from '@/components/DashboardLayout';
import { Input, Button, Select, PhoneInput } from '@/components/ui';
import type { E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { useUpdateProfile, useChangePassword } from '@/hooks/useProfile';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { useAuth, ProtectedRoute } from '@/lib/auth';

export default function ProfilePage() {
  const dt = useTranslations('dashboard');
  const at = useTranslations('auth');
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState<E164Number | undefined>((user?.phone as E164Number) || undefined);
  const [locale, setLocale] = useState<string>(user?.locale || 'en');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      toast('error', phoneErr);
      return;
    }
    updateProfileMutation.mutate(
      { name, phone: phone || undefined, locale: locale as 'en' | 'de' | 'fr' },
      {
        onSuccess: async () => {
          await refreshUser();
          toast('success', dt('profileUpdated'));
        },
        onError: (err) => {
          if (err instanceof ApiError) toast('error', err.errors[0] || dt('updateFailed'));
        },
      },
    );
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast('error', dt('passwordsNoMatch'));
      return;
    }
    changePasswordMutation.mutate(
      {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          toast('success', dt('passwordChanged'));
        },
        onError: (err) => {
          if (err instanceof ApiError) toast('error', err.errors[0] || dt('passwordChangeFailed'));
        },
      },
    );
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <DashboardLayout>
        <div className="space-y-8">
          <h1 className="text-2xl font-serif text-[var(--text-primary)]">{dt('profileSettings')}</h1>

          {/* Profile form */}
          <form onSubmit={handleUpdateProfile}>
            <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">{dt('personalInfo')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input label={at('name')} value={name} onChange={(e) => setName(e.target.value)} icon={<User size={18} />} />
                <Input label={at('email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={18} />} disabled />
                <PhoneInput label={at('phone')} value={phone} onChange={setPhone} />
                <Select
                  label={dt('language')}
                  options={[
                    { value: 'en', label: dt('english') },
                    { value: 'de', label: dt('deutsch') },
                    { value: 'fr', label: dt('francais') },
                  ]}
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                />
              </div>
              <Button type="submit" variant="primary" loading={updateProfileMutation.isPending}>
                {dt('saveChanges')}
              </Button>
            </div>
          </form>

          {/* Password form */}
          <form onSubmit={handleChangePassword}>
            <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">{dt('changePassword')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input label={dt('currentPassword')} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} icon={<Lock size={18} />} />
                <div />
                <Input label={dt('newPassword')} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} icon={<Lock size={18} />} />
                <Input label={dt('confirmNewPassword')} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={<Lock size={18} />} />
              </div>
              <Button type="submit" variant="primary" loading={changePasswordMutation.isPending}>
                {dt('changePassword')}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
      <Footer />
    </ProtectedRoute>
  );
}
