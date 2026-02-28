'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { Input, Button, PhoneInput } from '@/components/ui';
import type { E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { useFormValidation } from '@/hooks/useFormValidation';
import { registerSchema } from '@/lib/validation/schemas';
import AkazaLogo from '@/components/AkazaLogo';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone: E164Number | undefined;
    password: string;
    password_confirmation: string;
  }>({
    name: '',
    email: '',
    phone: undefined,
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearError, setErrors } = useFormValidation(registerSchema);
  const [agreed, setAgreed] = useState(false);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(form.phone);
    const manualErrors: Record<string, string> = {};
    if (phoneErr) manualErrors.phone = phoneErr;
    if (!agreed) manualErrors.agreed = 'You must accept the terms';

    const isValid = validate({ name: form.name, email: form.email, password: form.password, password_confirmation: form.password_confirmation });
    if (Object.keys(manualErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...manualErrors }));
      if (!isValid) return;
      return;
    }
    if (!isValid) return;

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      toast('success', 'Account created successfully!');
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-page)] px-6 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Link href="/">
            <AkazaLogo />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-8 md:p-10 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-[var(--text-primary)] mb-2">Create Account</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans">Join Akaza Travel for premium experiences</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              error={errors.name}
              icon={<User size={18} />}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              error={errors.email}
              icon={<Mail size={18} />}
            />

            <PhoneInput
              label="Phone (optional)"
              value={form.phone}
              onChange={(value) => { setForm((prev) => ({ ...prev, phone: value })); setErrors((prev) => ({ ...prev, phone: '' })); }}
              error={errors.phone}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              error={errors.password}
              icon={<Lock size={18} />}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={form.password_confirmation}
              onChange={(e) => update('password_confirmation', e.target.value)}
              error={errors.password_confirmation}
              icon={<Lock size={18} />}
            />

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setErrors((prev) => ({ ...prev, agreed: '' })); }}
                className="accent-primary mt-0.5"
              />
              <span className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:text-primary-dark">Terms & Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreed && <p className="text-red-400 text-xs font-sans -mt-4">{errors.agreed}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--line-soft)] text-center">
            <p className="text-sm text-[var(--text-muted)] font-sans">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary-dark transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
