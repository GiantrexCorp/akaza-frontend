'use client';

import PublicPageError from '@/components/PublicPageError';

export default function ToursError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label="Tour Error"
      message="Something went wrong loading tour information. Please try again."
    />
  );
}
