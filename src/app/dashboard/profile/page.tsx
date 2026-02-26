'use client';

import { useState, type FormEvent } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardLayout from '@/components/DashboardLayout';
import { Input, Button, Select, PhoneInput } from '@/components/ui';
import type { E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { profileApi } from '@/lib/api/profile';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { useAuth, ProtectedRoute } from '@/lib/auth';

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState<E164Number | undefined>((user?.phone as E164Number) || undefined);
  const [locale, setLocale] = useState<string>(user?.locale || 'en');
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      toast('error', phoneErr);
      return;
    }
    setSaving(true);
    try {
      await profileApi.update({ name, phone: phone || undefined, locale: locale as 'en' | 'ar' | 'de' | 'fr' });
      await refreshUser();
      toast('success', 'Profile updated');
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast('error', 'Passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await profileApi.changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast('success', 'Password changed');
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Password change failed');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <DashboardLayout>
        <div className="space-y-8">
          <h1 className="text-2xl font-serif text-[var(--text-primary)]">Profile Settings</h1>

          {/* Profile form */}
          <form onSubmit={handleUpdateProfile}>
            <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} icon={<User size={18} />} />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={18} />} disabled />
                <PhoneInput label="Phone" value={phone} onChange={setPhone} />
                <Select
                  label="Language"
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' },
                    { value: 'de', label: 'Deutsch' },
                    { value: 'fr', label: 'Fran\u00e7ais' },
                  ]}
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                />
              </div>
              <Button type="submit" variant="primary" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>

          {/* Password form */}
          <form onSubmit={handleChangePassword}>
            <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Change Password</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} icon={<Lock size={18} />} />
                <div />
                <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} icon={<Lock size={18} />} />
                <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={<Lock size={18} />} />
              </div>
              <Button type="submit" variant="primary" loading={changingPassword}>
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
      <Footer />
    </ProtectedRoute>
  );
}
