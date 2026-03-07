'use client';

import { useTranslations } from 'next-intl';
import PublicPageError from '@/components/PublicPageError';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('errors');
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label={t('genericTitle')}
      message={t('genericDesc')}
    />
  );
}
