import { Spinner } from '@/components/ui';

export default function TourBookingsLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <Spinner size="lg" />
    </div>
  );
}
