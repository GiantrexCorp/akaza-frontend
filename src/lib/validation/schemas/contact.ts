import { z } from 'zod/v4';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  destination: z.string().min(1, 'Destination is required'),
  vision: z.string().min(10, 'Please describe your travel vision (at least 10 characters)'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
