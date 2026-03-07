'use client';

import { useTranslations } from 'next-intl';
import PublicPageError from '@/components/PublicPageError';

export default function ToursError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('tours');
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label={t('errorTitle')}
      message={t('errorDesc')}
    />
  );
}
