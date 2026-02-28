import { describe, it, expect } from 'vitest';
import { hotelBookingSchema, tourBookingSchema, transferBookingSchema } from './booking';

describe('hotelBookingSchema', () => {
  const validData = {
    holderName: 'John',
    holderSurname: 'Doe',
    holderEmail: 'john@example.com',
  };

  it('passes with valid data', () => {
    const result = hotelBookingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails with empty first name', () => {
    const result = hotelBookingSchema.safeParse({ ...validData, holderName: '' });
    expect(result.success).toBe(false);
  });

  it('fails with empty last name', () => {
    const result = hotelBookingSchema.safeParse({ ...validData, holderSurname: '' });
    expect(result.success).toBe(false);
  });

  it('fails with invalid email', () => {
    const result = hotelBookingSchema.safeParse({ ...validData, holderEmail: 'not-email' });
    expect(result.success).toBe(false);
  });
});

describe('tourBookingSchema', () => {
  it('passes with valid data', () => {
    const result = tourBookingSchema.safeParse({ contactName: 'Jane', contactEmail: 'jane@example.com' });
    expect(result.success).toBe(true);
  });

  it('fails with empty contact name', () => {
    const result = tourBookingSchema.safeParse({ contactName: '', contactEmail: 'jane@example.com' });
    expect(result.success).toBe(false);
  });

  it('fails with invalid email', () => {
    const result = tourBookingSchema.safeParse({ contactName: 'Jane', contactEmail: 'bad' });
    expect(result.success).toBe(false);
  });
});

describe('transferBookingSchema', () => {
  const validData = {
    contactName: 'Bob',
    contactEmail: 'bob@example.com',
    pickupDate: '2026-03-15',
    pickupTime: '14:00',
  };

  it('passes with valid data', () => {
    const result = transferBookingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails with missing pickup date', () => {
    const result = transferBookingSchema.safeParse({ ...validData, pickupDate: '' });
    expect(result.success).toBe(false);
  });

  it('fails with missing pickup time', () => {
    const result = transferBookingSchema.safeParse({ ...validData, pickupTime: '' });
    expect(result.success).toBe(false);
  });

  it('fails with all fields empty', () => {
    const result = transferBookingSchema.safeParse({ contactName: '', contactEmail: '', pickupDate: '', pickupTime: '' });
    expect(result.success).toBe(false);
  });
});
