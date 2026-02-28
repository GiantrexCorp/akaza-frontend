import { z } from 'zod';

const guestSchema = z.object({
  name: z.string().min(1, 'Guest first name is required'),
  surname: z.string().min(1, 'Guest last name is required'),
  type: z.enum(['AD', 'CH']),
  age: z.number().min(0).max(17).nullable(),
});

export const hotelBookingSchema = z.object({
  holderName: z.string().min(1, 'First name is required'),
  holderSurname: z.string().min(1, 'Last name is required'),
  holderEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const hotelBookingFullSchema = hotelBookingSchema.extend({
  rooms: z.array(
    z.object({
      guests: z.array(guestSchema).min(1, 'At least one guest is required'),
    }),
  ).min(1, 'At least one room is required'),
});

export const tourBookingSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
  guests: z.number().min(1, 'At least 1 guest required').optional(),
});

export const transferBookingSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
  pickupDate: z.string().min(1, 'Pickup date is required'),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  passengers: z.number().min(1, 'At least 1 passenger required').optional(),
  luggageCount: z.number().min(0).optional(),
});

export const guestValidationSchema = guestSchema;

export type HotelBookingInput = z.infer<typeof hotelBookingSchema>;
export type HotelBookingFullInput = z.infer<typeof hotelBookingFullSchema>;
export type TourBookingInput = z.infer<typeof tourBookingSchema>;
export type TransferBookingInput = z.infer<typeof transferBookingSchema>;
export type GuestInput = z.infer<typeof guestSchema>;
