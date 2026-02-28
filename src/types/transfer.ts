import type { StatusLog } from './tour';
import type { LocaleMap } from './admin-notification';

export type { StatusLog, LocaleMap };

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
  transfer_type: TransferType;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  pickup_time: string;
  passengers: number;
  luggage_count: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  flight_number?: string;
  special_requests?: string;
  currency?: string;
}

// --- Admin Types ---

export interface AdminTransferVehicle {
  id: number;
  name: LocaleMap;
  description: LocaleMap;
  translated_name: string;
  translated_description: string;
  type: VehicleType;
  type_label: string;
  max_passengers: number;
  max_luggage: number;
  status: 'active' | 'inactive';
  sort_order: number;
  image: { id: number; url: string; name: string } | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleRequest {
  name: LocaleMap;
  description?: LocaleMap;
  type: VehicleType;
  max_passengers: number;
  max_luggage?: number;
  sort_order?: number;
}

export type UpdateVehicleRequest = Partial<CreateVehicleRequest> & {
  status?: 'active' | 'inactive';
};

export interface AdminTransferRoute {
  id: number;
  transfer_type: TransferType;
  transfer_type_label: string;
  pickup_name: LocaleMap;
  dropoff_name: LocaleMap;
  translated_pickup_name: string;
  translated_dropoff_name: string;
  pickup_code: string | null;
  dropoff_code: string | null;
  status: 'active' | 'inactive';
  prices: AdminRoutePrice[];
  created_at: string;
  updated_at: string;
}

export interface AdminRoutePrice {
  id: number;
  transfer_route_id: number;
  transfer_vehicle_id: number;
  price: number;
  currency: string;
  vehicle?: AdminTransferVehicle;
}

export interface CreateRouteRequest {
  transfer_type: TransferType;
  pickup_name: LocaleMap;
  dropoff_name: LocaleMap;
  pickup_code?: string;
  dropoff_code?: string;
}

export type UpdateRouteRequest = Partial<CreateRouteRequest> & {
  status?: 'active' | 'inactive';
};

export interface SetRoutePriceRequest {
  transfer_vehicle_id: number;
  price: number;
  currency?: string;
}

export interface AdminTransferBooking extends TransferBooking {
  id: string;
  formatted_price: string;
  status_color: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  refund_amount: number | null;
  user?: { id: number; name: string; email: string };
  created_at: string;
  updated_at: string;
}

export interface UpdateTransferBookingStatusRequest {
  status: TransferBookingStatus;
  reason?: string;
}
