import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from './auth';

describe('loginSchema', () => {
  it('passes with valid data', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
    expect(result.success).toBe(true);
  });

  it('fails with empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'password123' });
    expect(result.success).toBe(false);
  });

  it('fails with empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' });
    expect(result.success).toBe(false);
  });

  it('fails with missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    password_confirmation: 'password123',
  };

  it('passes with valid data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails with invalid email', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('fails with short password', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'short', password_confirmation: 'short' });
    expect(result.success).toBe(false);
  });

  it('fails when passwords do not match', () => {
    const result = registerSchema.safeParse({ ...validData, password_confirmation: 'different' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('password_confirmation');
    }
  });

  it('fails with empty name', () => {
    const result = registerSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('passes with valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(true);
  });

  it('fails with invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'bad' });
    expect(result.success).toBe(false);
  });

  it('fails with empty email', () => {
    const result = forgotPasswordSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('passes with matching passwords', () => {
    const result = resetPasswordSchema.safeParse({ password: 'newpassword1', password_confirmation: 'newpassword1' });
    expect(result.success).toBe(true);
  });

  it('fails when passwords do not match', () => {
    const result = resetPasswordSchema.safeParse({ password: 'newpassword1', password_confirmation: 'different' });
    expect(result.success).toBe(false);
  });

  it('fails with short password', () => {
    const result = resetPasswordSchema.safeParse({ password: 'short', password_confirmation: 'short' });
    expect(result.success).toBe(false);
  });
});
