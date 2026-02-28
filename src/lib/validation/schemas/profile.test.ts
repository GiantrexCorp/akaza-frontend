import { describe, it, expect } from 'vitest';
import { updateProfileSchema, changePasswordSchema } from './profile';

describe('updateProfileSchema', () => {
  it('passes with valid data', () => {
    expect(updateProfileSchema.safeParse({ name: 'John', locale: 'en' }).success).toBe(true);
  });

  it('passes with all locales', () => {
    expect(updateProfileSchema.safeParse({ name: 'Hans', locale: 'de' }).success).toBe(true);
    expect(updateProfileSchema.safeParse({ name: 'Jean', locale: 'fr' }).success).toBe(true);
  });

  it('fails with empty name', () => {
    expect(updateProfileSchema.safeParse({ name: '', locale: 'en' }).success).toBe(false);
  });

  it('fails with invalid locale', () => {
    expect(updateProfileSchema.safeParse({ name: 'John', locale: 'ja' }).success).toBe(false);
  });
});

describe('changePasswordSchema', () => {
  const validData = {
    current_password: 'oldpass123',
    password: 'newpass123',
    password_confirmation: 'newpass123',
  };

  it('passes with valid data', () => {
    expect(changePasswordSchema.safeParse(validData).success).toBe(true);
  });

  it('fails with empty current password', () => {
    expect(changePasswordSchema.safeParse({ ...validData, current_password: '' }).success).toBe(false);
  });

  it('fails with short new password', () => {
    expect(changePasswordSchema.safeParse({ ...validData, password: 'short', password_confirmation: 'short' }).success).toBe(false);
  });

  it('fails when passwords do not match', () => {
    const result = changePasswordSchema.safeParse({ ...validData, password_confirmation: 'different' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('password_confirmation');
    }
  });

  it('fails with empty confirmation', () => {
    expect(changePasswordSchema.safeParse({ ...validData, password_confirmation: '' }).success).toBe(false);
  });
});
