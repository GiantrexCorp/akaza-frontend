'use client';

import { useState, type FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { Input, Button, Spinner } from '@/components/ui';
import AkazaLogo from '@/components/AkazaLogo';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      toast('success', 'Welcome back!');
      router.push(redirect);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[var(--text-primary)] mb-2">Welcome Back</h1>
        <p className="text-sm text-[var(--text-secondary)] font-sans">Sign in to manage your bookings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail size={18} />}
          className="h-[52px] border border-[var(--line-soft)] bg-[var(--surface-page)]/72 px-4 pl-10 text-base font-sans focus:border-primary"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<Lock size={18} />}
          className="h-[52px] border border-[var(--line-soft)] bg-[var(--surface-page)]/72 px-4 pl-10 pr-12 text-base font-sans focus:border-primary"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-primary h-4 w-4 rounded border-[var(--line-strong)] bg-transparent" />
            <span className="text-xs text-[var(--text-secondary)] font-sans">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-dark transition-colors font-sans">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--line-soft)] text-center">
        <p className="text-sm text-[var(--text-muted)] font-sans">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary-dark transition-colors font-medium">
            Create one
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-page)] px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(185,117,50,0.12),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(52,109,128,0.2),transparent_36%)]" />

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-12">
          <Link href="/">
            <AkazaLogo />
          </Link>
        </div>

        <div className="bg-[var(--surface-card)]/92 border border-[var(--line-soft)] p-8 md:p-10 shadow-[0_34px_58px_-36px_rgba(0,0,0,0.86)] backdrop-blur-sm">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
