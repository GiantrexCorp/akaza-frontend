import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQueryErrorToast } from './useQueryErrorToast';
import { ApiError } from '@/lib/api/client';

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useQueryErrorToast', () => {
  it('does not throw when there is no error', () => {
    expect(() => {
      renderHook(() => useQueryErrorToast(false, null));
    }).not.toThrow();
  });

  it('does not throw when isError is false even with error object', () => {
    expect(() => {
      renderHook(() => useQueryErrorToast(false, new Error('test')));
    }).not.toThrow();
  });

  it('does not throw when handling ApiError', () => {
    const error = new ApiError(400, ['Bad request']);
    expect(() => {
      renderHook(() => useQueryErrorToast(true, error));
    }).not.toThrow();
  });
});
