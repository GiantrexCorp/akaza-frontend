import { useState, useCallback } from 'react';
import type { ZodSchema, ZodError } from 'zod';

type FieldErrors = Record<string, string>;

export function useFormValidation<T>(schema: ZodSchema<T>) {
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = useCallback((data: unknown): data is T => {
    const result = schema.safeParse(data);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: FieldErrors = {};
    for (const issue of (result.error as ZodError).issues) {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    setErrors(fieldErrors);
    return false;
  }, [schema]);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, clearError, clearErrors, setErrors };
}
