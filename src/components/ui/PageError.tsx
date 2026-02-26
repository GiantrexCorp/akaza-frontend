import Link from 'next/link';
import { Search, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface PageErrorProps {
  status: number;
  title?: string;
  description?: string;
  onRetry?: () => void;
  backHref: string;
  backLabel: string;
}

function getDefaults(status: number) {
  if (status === 404) {
    return {
      icon: <Search size={48} strokeWidth={1} />,
      title: 'Not Found',
      description: 'The resource you are looking for does not exist or has been removed.',
      showRetry: false,
    };
  }

  if (status === 0) {
    return {
      icon: <WifiOff size={48} strokeWidth={1} />,
      title: 'Connection Timed Out',
      description: 'The server took too long to respond. Check your connection and try again.',
      showRetry: true,
    };
  }

  return {
    icon: <AlertTriangle size={48} strokeWidth={1} />,
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again.',
    showRetry: true,
  };
}

export default function PageError({ status, title, description, onRetry, backHref, backLabel }: PageErrorProps) {
  const defaults = getDefaults(status);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-[var(--text-muted)] mb-6">
        {defaults.icon}
      </div>
      <h3 className="text-xl font-serif text-[var(--text-primary)] mb-2">
        {title ?? defaults.title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] font-sans max-w-md">
        {description ?? defaults.description}
      </p>
      <div className="mt-6 flex items-center gap-3">
        {defaults.showRetry && onRetry && (
          <Button variant="primary" size="sm" icon={<RefreshCw size={14} />} onClick={onRetry}>
            Try Again
          </Button>
        )}
        <Link href={backHref}>
          <Button variant="outline" size="sm">{backLabel}</Button>
        </Link>
      </div>
    </div>
  );
}
