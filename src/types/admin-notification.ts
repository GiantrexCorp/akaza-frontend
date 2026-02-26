export type NotificationChannel = 'mail' | 'database';

export type NotificationType =
  | 'hotel_booking_confirmed'
  | 'hotel_booking_cancelled'
  | 'tour_booking_confirmed'
  | 'tour_booking_cancelled'
  | 'transfer_booking_confirmed'
  | 'transfer_booking_cancelled'
  | 'voucher_delivery'
  | 'reconciliation_alert';

export type LocaleMap = Record<string, string>;

export interface NotificationTemplate {
  id: number;
  type: NotificationType;
  type_label: string;
  channel: NotificationChannel;
  channel_label: string;
  subject: LocaleMap;
  body: LocaleMap;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateNotificationTemplateRequest {
  channel?: NotificationChannel;
  subject?: LocaleMap;
  body?: LocaleMap;
  is_active?: boolean;
}

export type NotificationLogStatus = 'pending' | 'sent' | 'failed';

export interface AdminNotificationLog {
  id: number;
  user_id: number | null;
  type: NotificationType;
  type_label: string;
  channel: NotificationChannel;
  channel_label?: string;
  recipient_email: string | null;
  subject: string;
  status: NotificationLogStatus;
  status_label: string;
  error_message: string | null;
  metadata: Record<string, unknown>;
  sent_at: string | null;
  created_at: string;
  user?: { id: number; name: string; email: string };
}
