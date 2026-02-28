import { describe, it, expect } from 'vitest';
import { createUserSchema, createLeadSchema, createRoleSchema, tourFormSchema, vehicleFormSchema, routeFormSchema } from './admin';

describe('createUserSchema', () => {
  const validData = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    password_confirmation: 'password123',
    type: 'admin' as const,
    status: 'active' as const,
    locale: 'en' as const,
  };

  it('passes with valid data', () => {
    expect(createUserSchema.safeParse(validData).success).toBe(true);
  });

  it('fails with empty name', () => {
    expect(createUserSchema.safeParse({ ...validData, name: '' }).success).toBe(false);
  });

  it('fails with invalid email', () => {
    expect(createUserSchema.safeParse({ ...validData, email: 'bad' }).success).toBe(false);
  });

  it('fails with short password', () => {
    expect(createUserSchema.safeParse({ ...validData, password: 'short', password_confirmation: 'short' }).success).toBe(false);
  });

  it('fails when passwords do not match', () => {
    const result = createUserSchema.safeParse({ ...validData, password_confirmation: 'different' });
    expect(result.success).toBe(false);
  });

  it('fails with invalid type', () => {
    expect(createUserSchema.safeParse({ ...validData, type: 'superadmin' }).success).toBe(false);
  });
});

describe('createLeadSchema', () => {
  it('passes with valid data', () => {
    expect(createLeadSchema.safeParse({ name: 'Lead', email: 'lead@test.com', source: 'website' }).success).toBe(true);
  });

  it('fails with empty name', () => {
    expect(createLeadSchema.safeParse({ name: '', email: 'lead@test.com', source: 'website' }).success).toBe(false);
  });

  it('fails with invalid source', () => {
    expect(createLeadSchema.safeParse({ name: 'Lead', email: 'lead@test.com', source: 'invalid' }).success).toBe(false);
  });
});

describe('createRoleSchema', () => {
  it('passes with valid name', () => {
    expect(createRoleSchema.safeParse({ name: 'Editor' }).success).toBe(true);
  });

  it('fails with empty name', () => {
    expect(createRoleSchema.safeParse({ name: '' }).success).toBe(false);
  });
});

describe('tourFormSchema', () => {
  const validTour = {
    title: { en: 'Pyramids Tour', de: '', fr: '' },
    description: { en: 'Great tour', de: '', fr: '' },
    location: 'Cairo',
    price_per_person: '50',
    max_capacity: '20',
    currency: 'EUR' as const,
  };

  it('passes with valid data', () => {
    expect(tourFormSchema.safeParse(validTour).success).toBe(true);
  });

  it('fails with empty English title', () => {
    expect(tourFormSchema.safeParse({ ...validTour, title: { en: '', de: '', fr: '' } }).success).toBe(false);
  });

  it('fails with empty location', () => {
    expect(tourFormSchema.safeParse({ ...validTour, location: '' }).success).toBe(false);
  });

  it('fails with invalid currency', () => {
    expect(tourFormSchema.safeParse({ ...validTour, currency: 'JPY' }).success).toBe(false);
  });
});

describe('vehicleFormSchema', () => {
  const validVehicle = {
    name: { en: 'Sedan', de: '', fr: '' },
    type: 'sedan' as const,
    max_passengers: '4',
  };

  it('passes with valid data', () => {
    expect(vehicleFormSchema.safeParse(validVehicle).success).toBe(true);
  });

  it('fails with invalid type', () => {
    expect(vehicleFormSchema.safeParse({ ...validVehicle, type: 'helicopter' }).success).toBe(false);
  });
});

describe('routeFormSchema', () => {
  const validRoute = {
    pickup_name: { en: 'Airport', de: '', fr: '' },
    dropoff_name: { en: 'Hotel', de: '', fr: '' },
    transfer_type: 'airport' as const,
  };

  it('passes with valid data', () => {
    expect(routeFormSchema.safeParse(validRoute).success).toBe(true);
  });

  it('fails with empty pickup name', () => {
    expect(routeFormSchema.safeParse({ ...validRoute, pickup_name: { en: '', de: '', fr: '' } }).success).toBe(false);
  });

  it('fails with invalid transfer type', () => {
    expect(routeFormSchema.safeParse({ ...validRoute, transfer_type: 'helicopter' }).success).toBe(false);
  });
});
