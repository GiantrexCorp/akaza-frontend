'use client';

import AdminFeatureError from '@/components/admin/AdminFeatureError';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminFeatureError error={error} reset={reset} title="Admin Error" />;
}
