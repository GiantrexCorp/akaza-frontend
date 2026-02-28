import { useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';

export function useQueryErrorToast(isError: boolean, error: Error | null, fallback = 'Something went wrong') {
  const { toast } = useToast();

  useEffect(() => {
    if (!isError || !error) return;
    const message = error instanceof ApiError
      ? (error.errors as string[])?.[0] ?? fallback
      : fallback;
    toast('error', message);
  }, [isError, error, fallback, toast]);
}
