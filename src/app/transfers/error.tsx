'use client';

import PublicPageError from '@/components/PublicPageError';

export default function TransfersError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label="Transfer Error"
      message="Something went wrong loading transfer information. Please try again."
    />
  );
}
