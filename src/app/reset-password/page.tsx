'use client';

import { useState, type FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { authApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { Input, Button, Spinner } from '@/components/ui';
import { useFormValidation } from '@/hooks/useFormValidation';
import { resetPasswordSchema } from '@/lib/validation/schemas';
import AkazaLogo from '@/components/AkazaLogo';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';
  const { toast } = useToast();

  const [form, setForm] = useState({
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { errors, validate, clearError } = useFormValidation(resetPasswordSchema);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    setLoading(true);
    try {
      await authApi.resetPassword({
        email: emailParam,
        token,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Reset failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-6">
          <CheckCircle size={48} strokeWidth={1} className="text-emerald-400" />
        </div>
        <h1 className="text-2xl font-serif text-[var(--text-primary)] mb-3">Password Reset</h1>
        <p className="text-sm text-[var(--text-muted)] font-sans leading-relaxed mb-2">
          Your password has been successfully reset.
        </p>
        <p className="text-xs text-[var(--text-muted)] font-sans">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[var(--text-primary)] mb-2">New Password</h1>
        <p className="text-sm text-[var(--text-muted)] font-sans">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="New Password"
          type="password"
          placeholder="Minimum 8 characters"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
          icon={<Lock size={18} />}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Repeat your password"
          value={form.password_confirmation}
          onChange={(e) => update('password_confirmation', e.target.value)}
          error={errors.password_confirmation}
          icon={<Lock size={18} />}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Reset Password
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--line-soft)] text-center">
        <Link
          href="/login"
          className="text-[var(--text-muted)] hover:text-primary text-xs uppercase tracking-widest font-medium font-sans transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-page)] px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent" />

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-12">
          <Link href="/">
            <AkazaLogo />
          </Link>
        </div>

        <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-8 md:p-10 shadow-2xl">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
