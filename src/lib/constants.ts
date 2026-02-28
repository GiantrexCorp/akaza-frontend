import type { BadgeColor } from '@/components/ui/Badge';

// Hotel booking statuses (7 states with cancellation/reconciliation)
export const HOTEL_BOOKING_STATUS_COLORS: Record<string, BadgeColor> = {
  pending: 'yellow',
  confirmed: 'green',
  failed: 'red',
  cancelled: 'gray',
  pending_cancellation: 'orange',
  cancellation_failed: 'red',
  pending_reconciliation: 'purple',
};

// Tour/transfer booking statuses — admin view (completed = blue)
export const SERVICE_BOOKING_STATUS_COLORS: Record<string, BadgeColor> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'gray',
  completed: 'blue',
  no_show: 'red',
};

// Tour/transfer booking statuses — customer view (completed = purple)
export const CUSTOMER_BOOKING_STATUS_COLORS: Record<string, BadgeColor> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'gray',
  completed: 'purple',
  no_show: 'red',
};

// Entity statuses
export const TOUR_STATUS_COLORS: Record<string, BadgeColor> = {
  draft: 'yellow',
  active: 'green',
  inactive: 'gray',
};

export const ACTIVE_STATUS_COLORS: Record<string, BadgeColor> = {
  active: 'green',
  inactive: 'gray',
};

export const USER_STATUS_COLORS: Record<string, BadgeColor> = {
  active: 'green',
  inactive: 'gray',
  suspended: 'red',
};

export const CUSTOMER_STATUS_COLORS: Record<string, BadgeColor> = {
  active: 'green',
  inactive: 'gray',
  vip: 'yellow',
};

export const LEAD_STATUS_COLORS: Record<string, BadgeColor> = {
  new: 'blue',
  contacted: 'yellow',
  qualified: 'orange',
  converted: 'green',
  lost: 'gray',
};

export const NOTIFICATION_STATUS_COLORS: Record<string, BadgeColor> = {
  pending: 'yellow',
  sent: 'green',
  failed: 'red',
};

// Combined booking statuses — dashboard view (all booking types)
export const ALL_BOOKING_STATUS_COLORS: Record<string, BadgeColor> = {
  pending: 'yellow',
  confirmed: 'green',
  failed: 'red',
  cancelled: 'gray',
  completed: 'purple',
  no_show: 'red',
  pending_cancellation: 'orange',
  cancellation_failed: 'red',
  pending_reconciliation: 'purple',
};

// Pagination defaults
export const PAGE_SIZE = {
  GRID: 9,
  TABLE: 15,
  TABLE_LARGE: 20,
} as const;
