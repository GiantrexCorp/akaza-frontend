'use client';

import { useTranslations } from 'next-intl';
import AdminFeatureError from '@/components/admin/AdminFeatureError';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('dashboard');
  return <AdminFeatureError error={error} reset={reset} title={t('errorTitle')} />;
}
