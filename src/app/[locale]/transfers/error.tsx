'use client';

import PublicPageError from '@/components/PublicPageError';
import { useTranslations } from 'next-intl';

export default function TransfersError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('transfers');
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label={t('errorTitle')}
      message={t('errorDesc')}
    />
  );
}
