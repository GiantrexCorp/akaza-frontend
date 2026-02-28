export interface Tour {
  id: string;
  title: string;
  translated_title: string;
  description: string;
  slug: string;
  location: string;
  latitude: number;
  longitude: number;
  duration_hours: number;
  duration_days: number;
  price_per_person: number;
  formatted_price: string;
  max_capacity: number;
  status: 'draft' | 'active' | 'inactive';
  status_label: string;
  status_color: string;
  currency: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  images: TourImage[];
  availabilities: TourAvailability[];
  created_at: string;
}

export interface TourImage {
  id: string;
  url: string;
  name: string;
}

export interface TourAvailability {
  id: string;
  tour_id: string;
  date: string;
  start_time: string;
  total_spots: number;
  booked_spots: number;
  remaining_spots: number;
  price_override: number | null;
  effective_price: number;
  status: 'available' | 'sold_out';
  status_label: string;
  status_color: string;
}

export interface TourBooking {
  id: string;
  booking_reference: string;
  status: TourBookingStatus;
  status_label: string;
  tour: Tour;
  tour_date: string;
  number_of_guests: number;
  price_per_person: number;
  total_price: number;
  currency: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  special_requests: string | null;
  is_cancellable: boolean;
  confirmed_at: string | null;
  voucher_path: string | null;
  guests: TourBookingGuest[];
  status_logs: StatusLog[];
}

export type TourBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export interface TourBookingGuest {
  name: string;
  surname: string;
  type: 'AD' | 'CH';
  age: number | null;
}

export interface CreateTourBookingRequest {
  tour_id: string;
  availability_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  special_requests?: string;
  guests: TourBookingGuest[];
}

export interface StatusLog {
  id: string;
  from_status: string | null;
  to_status: string;
  notes: string | null;
  created_at: string;
}

export type TourStatus = 'draft' | 'active' | 'inactive';

import type { LocaleMap } from './admin-notification';

export interface AdminTour {
  id: number;
  title: LocaleMap;
  translated_title: string;
  description: LocaleMap;
  translated_description: string;
  slug: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  duration_hours: number | null;
  duration_days: number | null;
  price_per_person: string;
  formatted_price: string;
  max_capacity: number;
  status: TourStatus;
  status_label: string;
  status_color: string;
  currency: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  images: TourImage[];
  availabilities: TourAvailability[];
  created_at: string;
  updated_at: string;
}

export interface CreateTourRequest {
  title: LocaleMap;
  description: LocaleMap;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  duration_hours?: number | null;
  duration_days?: number | null;
  price_per_person: number;
  max_capacity: number;
  currency?: string;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
}

export interface UpdateTourRequest extends Partial<CreateTourRequest> {
  status?: TourStatus;
}

export interface CreateAvailabilityRequest {
  date: string;
  start_time?: string;
  total_spots: number;
  price_override?: number | null;
}

export interface UpdateAvailabilityRequest {
  date?: string;
  start_time?: string;
  total_spots?: number;
  price_override?: number | null;
}

export interface AdminTourBooking extends TourBooking {
  formatted_total_price: string;
  status_color: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  refund_amount: number | null;
  user?: { id: number; name: string; email: string };
  created_at: string;
  updated_at: string;
}

export interface UpdateBookingStatusRequest {
  status: TourBookingStatus;
  reason?: string;
}
