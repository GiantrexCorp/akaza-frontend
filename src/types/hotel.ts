export interface HotelSearchParams {
  checkIn: string;
  checkOut: string;
  destination: string;
  occupancies: HotelOccupancy[];
  hotelCode?: string;
  filters?: Record<string, unknown>;
}

export interface HotelOccupancy {
  adults: number;
  children: number;
  ages?: number[];
}

export interface HotelSearchResult {
  hotel_code: string;
  hotel_name: string;
  destination_code: string;
  destination_name: string;
  category_code: string;
  category_name: string;
  latitude: number;
  longitude: number;
  currency: string;
  check_in: string;
  check_out: string;
  min_rate: number;
  max_rate: number;
  markup_percentage: number;
  min_selling_price: number;
  max_selling_price: number;
  rooms: HotelRoom[];
}

export interface HotelRoom {
  room_code: string;
  room_name: string;
  board_code: string;
  board_name: string;
  rate_key: string;
  rate_type: string;
  rate_class: string;
  packaging: boolean;
  net_price: number;
  markup_amount: number;
  selling_price: number;
  currency: string;
  adults: number;
  children: number;
  rooms: number;
  cancellation_policies: CancellationPolicy[];
  promotions: string[];
}

export interface CancellationPolicy {
  amount: string;
  from: string;
}

export interface CheckRateRequest {
  rate_keys: string[];
}

export interface HotelBooking {
  id: string;
  booking_reference: string;
  bedbank_booking_id: string | null;
  bedbank_provider: string;
  status: HotelBookingStatus;
  status_label: string;
  status_color: string;
  hotel_code: string;
  hotel_name: string;
  check_in: string;
  check_out: string;
  nights_count: number;
  total_rooms: number;
  net_price: number;
  markup_percentage: number;
  markup_amount: number;
  selling_price: number;
  formatted_selling_price: string;
  currency: string;
  holder_name: string;
  holder_email: string;
  holder_phone: string;
  is_cancellable: boolean;
  cancellation_policy: string | null;
  cancellation_deadline: string | null;
  confirmed_at: string | null;
  voucher_path: string | null;
  rooms: HotelBookingRoom[];
  created_at: string;
  updated_at: string;
}

export type HotelBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'failed'
  | 'cancelled'
  | 'pending_cancellation'
  | 'cancellation_failed'
  | 'pending_reconciliation';

export interface HotelBookingRoom {
  id: string;
  room_code: string;
  room_name: string;
  board_code: string;
  board_name: string;
  net_price: number;
  selling_price: number;
  adults: number;
  children: number;
  guests: HotelBookingGuest[];
}

export interface HotelBookingGuest {
  type: 'AD' | 'CH';
  name: string;
  surname: string;
  age: number | null;
}

export interface CreateHotelBookingRequest {
  rate_key: string;
  rate_type: string;
  holder_name: string;
  holder_surname: string;
  holder_email: string;
  holder_phone: string;
  rooms: {
    room_code: string;
    room_name: string;
    board_code: string;
    board_name: string;
    rate_key: string;
    net_price: number;
    currency: string;
    guests: HotelBookingGuest[];
  }[];
  hotel_code: string;
  hotel_name: string;
  destination_code: string;
  destination_name: string;
  check_in: string;
  check_out: string;
  cancellation_policies?: CancellationPolicy[];
}

export interface CancellationCost {
  cancellation_cost: number;
  currency: string;
}

export interface HotelBookingStatusLog {
  id: number;
  from_status: HotelBookingStatus | null;
  to_status: HotelBookingStatus;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  changed_by: { id: number; name: string };
  created_at: string;
}

export interface AdminHotelBooking extends HotelBooking {
  holder_surname: string;
  hotel_address: string | null;
  hotel_phone: string | null;
  hotel_category_code: string | null;
  hotel_category_name: string | null;
  destination_code: string;
  destination_name: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  refund_amount: number | null;
  status_logs: HotelBookingStatusLog[];
  status_logs_count: number;
  user?: { id: number; name: string; email: string };
}

export type ReconcileAction = 'retry' | 'refund';

export interface ReconcileRequest {
  action: ReconcileAction;
  reason?: string;
}
