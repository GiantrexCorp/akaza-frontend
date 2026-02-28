'use client';

import AdminFeatureError from '@/components/admin/AdminFeatureError';

export default function TransferBookingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AdminFeatureError error={error} reset={reset} title="Transfer Bookings Error" />;
}
