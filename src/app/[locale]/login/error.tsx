'use client';

import PublicPageError from '@/components/PublicPageError';
import { useTranslations } from 'next-intl';

export default function LoginError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('auth');
  return (
    <PublicPageError
      error={error}
      reset={reset}
      label={t('loginError')}
      message={t('loginErrorDesc')}
    />
  );
}
