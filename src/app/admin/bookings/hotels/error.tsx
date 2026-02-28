'use client';

import AdminFeatureError from '@/components/admin/AdminFeatureError';

export default function HotelBookingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AdminFeatureError error={error} reset={reset} title="Hotel Bookings Error" />;
}
