export interface NotificationLog {
  id: string;
  user_id: string;
  type: string;
  type_label: string;
  channel: 'email' | 'sms' | 'in_app';
  recipient_email: string | null;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  status_label: string;
  error_message: string | null;
  metadata: Record<string, unknown>;
  sent_at: string | null;
  created_at: string;
}
