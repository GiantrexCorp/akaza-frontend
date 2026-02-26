import { Spinner } from '@/components/ui';

export default function TransfersLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-page)]">
      <Spinner size="lg" />
    </div>
  );
}
