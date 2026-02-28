'use client';

import PublicPageError from '@/components/PublicPageError';

export default function HotelsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label="Hotel Error"
      message="Something went wrong loading hotel information. Please try again."
    />
  );
}
