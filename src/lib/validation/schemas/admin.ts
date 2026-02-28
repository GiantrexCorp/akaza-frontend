import { z } from 'zod';

const localeMap = z.object({
  en: z.string().min(1, 'English is required'),
  de: z.string().optional().default(''),
  fr: z.string().optional().default(''),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string().min(1, 'Please confirm password'),
  type: z.enum(['customer', 'admin']),
  status: z.enum(['active', 'inactive', 'suspended']),
  locale: z.enum(['en', 'de', 'fr']),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  source: z.enum(['website', 'manual', 'hotel_booking', 'tour_booking', 'transfer_booking']),
  notes: z.string().optional().default(''),
});

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
});

export const tourFormSchema = z.object({
  title: localeMap,
  description: localeMap,
  location: z.string().min(1, 'Location is required'),
  price_per_person: z.string().min(1, 'Price is required'),
  max_capacity: z.string().min(1, 'Capacity is required'),
  currency: z.enum(['EUR', 'USD', 'GBP']),
});

export const vehicleFormSchema = z.object({
  name: localeMap,
  type: z.enum(['sedan', 'suv', 'van', 'minibus', 'limousine']),
  max_passengers: z.string().min(1, 'Max passengers is required'),
});

export const routeFormSchema = z.object({
  pickup_name: localeMap,
  dropoff_name: localeMap,
  transfer_type: z.enum(['airport', 'city', 'chauffeur']),
});

export const customerInfoSchema = z.object({
  name: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Last name is required'),
});

export const customerNoteSchema = z.object({
  type: z.enum(['note', 'follow_up', 'complaint']),
  content: z.string().min(1, 'Content is required'),
  follow_up_date: z.string().optional().default(''),
  pinned: z.boolean().optional().default(false),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type TourFormInput = z.infer<typeof tourFormSchema>;
export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;
export type RouteFormInput = z.infer<typeof routeFormSchema>;
export type CustomerInfoInput = z.infer<typeof customerInfoSchema>;
export type CustomerNoteInput = z.infer<typeof customerNoteSchema>;
