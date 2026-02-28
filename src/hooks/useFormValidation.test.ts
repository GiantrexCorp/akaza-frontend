import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { z } from 'zod';
import { useFormValidation } from './useFormValidation';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

describe('useFormValidation', () => {
  it('returns no errors initially', () => {
    const { result } = renderHook(() => useFormValidation(schema));
    expect(result.current.errors).toEqual({});
  });

  it('validates valid data and returns true', () => {
    const { result } = renderHook(() => useFormValidation(schema));
    let isValid = false;
    act(() => {
      isValid = result.current.validate({ name: 'John', email: 'john@example.com' });
    });
    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('validates invalid data and returns false with errors', () => {
    const { result } = renderHook(() => useFormValidation(schema));
    let isValid = true;
    act(() => {
      isValid = result.current.validate({ name: '', email: 'bad' });
    });
    expect(isValid).toBe(false);
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.errors.email).toBe('Invalid email');
  });

  it('clears a single error with clearError', () => {
    const { result } = renderHook(() => useFormValidation(schema));
    act(() => {
      result.current.validate({ name: '', email: 'bad' });
    });
    expect(result.current.errors.name).toBeDefined();
    act(() => {
      result.current.clearError('name');
    });
    expect(result.current.errors.name).toBeUndefined();
    expect(result.current.errors.email).toBe('Invalid email');
  });

  it('clears all errors with clearErrors', () => {
    const { result } = renderHook(() => useFormValidation(schema));
    act(() => {
      result.current.validate({ name: '', email: 'bad' });
    });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    act(() => {
      result.current.clearErrors();
    });
    expect(result.current.errors).toEqual({});
  });

  it('allows setting errors manually', () => {
    const { result } = renderHook(() => useFormValidation(schema));
    act(() => {
      result.current.setErrors({ name: 'Server error' });
    });
    expect(result.current.errors.name).toBe('Server error');
  });
});
