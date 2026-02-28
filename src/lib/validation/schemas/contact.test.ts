import { describe, it, expect } from 'vitest';
import { contactSchema } from './contact';

describe('contactSchema', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    destination: 'Cairo & Giza',
    vision: 'A luxurious getaway exploring ancient Egyptian history with private tours.',
  };

  it('accepts valid contact data', () => {
    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = contactSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects empty email', () => {
    const result = contactSchema.safeParse({ ...validData, email: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty destination', () => {
    const result = contactSchema.safeParse({ ...validData, destination: '' });
    expect(result.success).toBe(false);
  });

  it('rejects vision shorter than 10 characters', () => {
    const result = contactSchema.safeParse({ ...validData, vision: 'Short' });
    expect(result.success).toBe(false);
  });

  it('accepts vision with exactly 10 characters', () => {
    const result = contactSchema.safeParse({ ...validData, vision: '0123456789' });
    expect(result.success).toBe(true);
  });

  it('rejects missing fields', () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
