import { z } from 'zod';

export const hotelBookingSchema = z.object({
  holderName: z.string().min(1, 'First name is required'),
  holderSurname: z.string().min(1, 'Last name is required'),
  holderEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const tourBookingSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const transferBookingSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
  pickupDate: z.string().min(1, 'Pickup date is required'),
  pickupTime: z.string().min(1, 'Pickup time is required'),
});

export type HotelBookingInput = z.infer<typeof hotelBookingSchema>;
export type TourBookingInput = z.infer<typeof tourBookingSchema>;
export type TransferBookingInput = z.infer<typeof transferBookingSchema>;
