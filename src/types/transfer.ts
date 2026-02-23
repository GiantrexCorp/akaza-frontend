import type { StatusLog } from './tour';

export type { StatusLog };

export interface TransferVehicle {
  id: string;
  name: string;
  description: string;
  type: VehicleType;
  type_label: string;
  max_passengers: number;
  max_luggage: number;
  status: 'active' | 'inactive';
  sort_order: number;
  image_url: string | null;
}

export type VehicleType = 'sedan' | 'suv' | 'van' | 'minibus' | 'limousine';

export interface TransferRoute {
  id: string;
  transfer_type: TransferType;
  transfer_type_label: string;
  pickup_name: string;
  dropoff_name: string;
  pickup_code: string | null;
  dropoff_code: string | null;
  status: 'active' | 'inactive';
  prices: TransferRoutePrice[];
}

export type TransferType = 'airport' | 'city' | 'chauffeur';

export interface TransferRoutePrice {
  id: string;
  transfer_route_id: string;
  transfer_vehicle_id: string;
  price: number;
  currency: string;
  vehicle?: TransferVehicle;
}

export interface TransferBooking {
  id: string;
  booking_reference: string;
  status: TransferBookingStatus;
  status_label: string;
  transfer_type: TransferType;
  route: TransferRoute;
  vehicle: TransferVehicle;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  pickup_time: string;
  passengers: number;
  luggage_count: number;
  price: number;
  formatted_price: string;
  currency: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  flight_number: string | null;
  special_requests: string | null;
  is_cancellable: boolean;
  confirmed_at: string | null;
  voucher_path: string | null;
  status_logs: StatusLog[];
}

export type TransferBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export interface CreateTransferBookingRequest {
  transfer_route_id: string;
  transfer_vehicle_id: string;
  pickup_date: string;
  pickup_time: string;
  passengers: number;
  luggage_count: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  flight_number?: string;
  special_requests?: string;
}
