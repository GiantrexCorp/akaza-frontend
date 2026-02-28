import { describe, it, expect } from 'vitest';
import { hotelBookingSchema, hotelBookingFullSchema, tourBookingSchema, transferBookingSchema, guestValidationSchema } from './booking';

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

  it('passes with optional passengers and luggage', () => {
    const result = transferBookingSchema.safeParse({
      contactName: 'Bob',
      contactEmail: 'bob@example.com',
      pickupDate: '2026-03-15',
      pickupTime: '14:00',
      passengers: 3,
      luggageCount: 2,
    });
    expect(result.success).toBe(true);
  });

  it('fails with zero passengers', () => {
    const result = transferBookingSchema.safeParse({
      contactName: 'Bob',
      contactEmail: 'bob@example.com',
      pickupDate: '2026-03-15',
      pickupTime: '14:00',
      passengers: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('guestValidationSchema', () => {
  it('passes with valid adult guest', () => {
    const result = guestValidationSchema.safeParse({ name: 'John', surname: 'Doe', type: 'AD', age: null });
    expect(result.success).toBe(true);
  });

  it('passes with valid child guest', () => {
    const result = guestValidationSchema.safeParse({ name: 'Jane', surname: 'Doe', type: 'CH', age: 10 });
    expect(result.success).toBe(true);
  });

  it('fails with empty name', () => {
    const result = guestValidationSchema.safeParse({ name: '', surname: 'Doe', type: 'AD', age: null });
    expect(result.success).toBe(false);
  });

  it('fails with empty surname', () => {
    const result = guestValidationSchema.safeParse({ name: 'John', surname: '', type: 'AD', age: null });
    expect(result.success).toBe(false);
  });

  it('fails with invalid type', () => {
    const result = guestValidationSchema.safeParse({ name: 'John', surname: 'Doe', type: 'INVALID', age: null });
    expect(result.success).toBe(false);
  });
});

describe('hotelBookingFullSchema', () => {
  const validFull = {
    holderName: 'John',
    holderSurname: 'Doe',
    holderEmail: 'john@example.com',
    rooms: [{ guests: [{ name: 'John', surname: 'Doe', type: 'AD', age: null }] }],
  };

  it('passes with valid full booking data', () => {
    const result = hotelBookingFullSchema.safeParse(validFull);
    expect(result.success).toBe(true);
  });

  it('fails with empty rooms array', () => {
    const result = hotelBookingFullSchema.safeParse({ ...validFull, rooms: [] });
    expect(result.success).toBe(false);
  });

  it('fails with room with no guests', () => {
    const result = hotelBookingFullSchema.safeParse({ ...validFull, rooms: [{ guests: [] }] });
    expect(result.success).toBe(false);
  });

  it('validates guest details within rooms', () => {
    const result = hotelBookingFullSchema.safeParse({
      ...validFull,
      rooms: [{ guests: [{ name: '', surname: 'Doe', type: 'AD', age: null }] }],
    });
    expect(result.success).toBe(false);
  });
});

describe('tourBookingSchema extended', () => {
  it('passes with optional guests count', () => {
    const result = tourBookingSchema.safeParse({ contactName: 'Jane', contactEmail: 'jane@example.com', guests: 3 });
    expect(result.success).toBe(true);
  });

  it('fails with zero guests', () => {
    const result = tourBookingSchema.safeParse({ contactName: 'Jane', contactEmail: 'jane@example.com', guests: 0 });
    expect(result.success).toBe(false);
  });
});
