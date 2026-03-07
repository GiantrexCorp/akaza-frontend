'use client';

import { useTranslations } from 'next-intl';
import PublicPageError from '@/components/PublicPageError';

export default function HotelsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('hotels');
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label={t('errorTitle')}
      message={t('errorDesc')}
    />
  );
}
