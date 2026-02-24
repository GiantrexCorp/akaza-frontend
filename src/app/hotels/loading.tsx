import Spinner from '@/components/ui/Spinner';

export default function HotelsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-page)]">
      <Spinner size="lg" />
    </div>
  );
}
