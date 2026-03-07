'use client';

import PublicPageError from '@/components/PublicPageError';

export default function RegisterError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label="Registration Error"
      message="Something went wrong with the registration page. Please try again."
    />
  );
}
