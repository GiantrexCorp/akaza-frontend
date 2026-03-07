'use client';

import PublicPageError from '@/components/PublicPageError';

export default function LoginError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label="Authentication Error"
      message="Something went wrong with the login page. Please try again."
    />
  );
}
