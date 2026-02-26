export type CustomerStatus = 'active' | 'inactive' | 'vip';

export type CustomerSource = 'booking' | 'manual' | 'lead';

export type NoteType = 'note' | 'follow_up' | 'complaint';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export type LeadSource = 'hotel_booking' | 'tour_booking' | 'transfer_booking' | 'website' | 'manual';

export type BookingType = 'hotel' | 'tour' | 'transfer';

export interface Customer {
  id: number;
  user_id: number | null;
  name: string;
  surname: string;
  full_name: string;
  email: string;
  phone: string | null;
  nationality: string | null;
  language: string | null;
  source: CustomerSource;
  source_label: string;
  status: CustomerStatus;
  status_label: string;
  status_color: string;
  total_bookings: number;
  total_spent: number;
  currency: string;
  last_booking_at: string | null;
  created_at: string;
  updated_at: string;
  notes?: CustomerNote[];
}

export interface UpdateCustomerRequest {
  name?: string;
  surname?: string;
  phone?: string | null;
  nationality?: string | null;
  language?: string | null;
  status?: CustomerStatus;
}

export interface CustomerNote {
  id: number;
  customer_id: number;
  created_by: number;
  type: NoteType;
  type_label: string;
  content: string;
  is_pinned: boolean;
  follow_up_date: string | null;
  follow_up_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteRequest {
  type?: NoteType;
  content: string;
  is_pinned?: boolean;
  follow_up_date?: string;
}

export interface UpdateNoteRequest {
  type?: NoteType;
  content?: string;
  is_pinned?: boolean;
  follow_up_date?: string | null;
}

export interface BookingHistoryItem {
  id: number;
  booking_reference: string;
  status: string;
  total_price: number;
  currency: string;
  created_at: string;
  type: BookingType;
}

export interface Lead {
  id: number;
  customer_id: number | null;
  name: string;
  email: string;
  phone: string | null;
  source: LeadSource;
  source_label: string;
  status: LeadStatus;
  status_label: string;
  status_color: string;
  notes: string | null;
  assigned_to: number | null;
  converted_at: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface CreateLeadRequest {
  name: string;
  email: string;
  phone?: string;
  source?: LeadSource;
  notes?: string;
  assigned_to?: number;
}

export interface UpdateLeadRequest {
  name?: string;
  email?: string;
  phone?: string | null;
  source?: LeadSource;
  status?: LeadStatus;
  notes?: string | null;
  assigned_to?: number | null;
}
