'use client';

import AdminFeatureError from '@/components/admin/AdminFeatureError';

export default function FinanceError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AdminFeatureError error={error} reset={reset} title="Finance Error" />;
}
