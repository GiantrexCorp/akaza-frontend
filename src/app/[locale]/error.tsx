'use client';

import PublicPageError from '@/components/PublicPageError';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label="Something Went Wrong"
      message="An unexpected error occurred. Please try again."
    />
  );
}
