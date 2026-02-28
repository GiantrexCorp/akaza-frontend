'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { authApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { Input, Button } from '@/components/ui';
import { useFormValidation } from '@/hooks/useFormValidation';
import { forgotPasswordSchema } from '@/lib/validation/schemas';
import AkazaLogo from '@/components/AkazaLogo';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { errors, validate, clearError } = useFormValidation(forgotPasswordSchema);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate({ email })) return;

    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to send reset link');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-page)] px-6">
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
          {sent ? (
            <div className="text-center py-6">
              <div className="flex justify-center mb-6">
                <CheckCircle size={48} strokeWidth={1} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-serif text-[var(--text-primary)] mb-3">Check Your Email</h1>
              <p className="text-sm text-[var(--text-muted)] font-sans leading-relaxed mb-8">
                We&apos;ve sent a password reset link to <span className="text-primary">{email}</span>. Please check your inbox and follow the instructions.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark text-xs uppercase tracking-widest font-bold font-sans transition-colors"
              >
                <ArrowLeft size={14} />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-serif text-[var(--text-primary)] mb-2">Reset Password</h1>
                <p className="text-sm text-[var(--text-muted)] font-sans">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                  error={errors.email}
                  icon={<Mail size={18} />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Send Reset Link
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-[var(--line-soft)] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary text-xs uppercase tracking-widest font-medium font-sans transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
