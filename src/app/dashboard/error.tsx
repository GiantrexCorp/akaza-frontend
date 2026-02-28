'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle size={48} className="text-primary" />
        </div>
        <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-3">
          Dashboard Error
        </p>
        <h2 className="text-3xl font-serif text-[var(--text-primary)] mb-4">
          Something went wrong
        </h2>
        <p className="text-[var(--text-secondary)] text-sm font-sans mb-8">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-8 py-3 text-xs font-bold font-sans uppercase tracking-widest transition-all duration-300"
          >
            Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-xs font-bold font-sans uppercase tracking-widest transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
