export type BookingServiceType = 'hotel' | 'tour' | 'transfer';

export type RevenuePeriodType = 'daily' | 'monthly' | 'yearly';

export interface MonthlyTrendItem {
  period: string;
  revenue: number;
  bookings: number;
}

export interface RecentBookingItem {
  booking_reference: string;
  status: string;
  total_price: string;
  currency: string;
  created_at: string;
  type: BookingServiceType;
}

export interface RevenueBreakdown {
  hotel: number;
  tour: number;
  transfer: number;
}

export interface FinanceDashboard {
  total_revenue: number;
  breakdown: RevenueBreakdown;
  monthly_trend: MonthlyTrendItem[];
  recent_bookings: RecentBookingItem[];
}

export interface BookingStatusCounts {
  [status: string]: number;
}

export interface BookingStatusSummary {
  hotel: BookingStatusCounts;
  tour: BookingStatusCounts;
  transfer: BookingStatusCounts;
}

export interface FinanceReport {
  period: RevenuePeriodType;
  date_range: { from: string; to: string };
  total_revenue: number;
  breakdown: RevenueBreakdown;
  revenue_by_period: MonthlyTrendItem[];
  booking_status_summary: BookingStatusSummary;
  generated_at: string;
}

export interface FinanceReportParams {
  period: RevenuePeriodType;
  from: string;
  to: string;
}
