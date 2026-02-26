import type { User } from './auth';

export type AuditAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'status_changed'
  | 'login'
  | 'logout'
  | 'reconciled'
  | 'refunded'
  | 'markup_changed'
  | 'settings_updated'
  | 'role_assigned'
  | 'exported';

export type AuditEntityType =
  | 'user'
  | 'hotel_booking'
  | 'tour'
  | 'tour_booking'
  | 'transfer_vehicle'
  | 'transfer_route'
  | 'transfer_booking'
  | 'customer'
  | 'lead'
  | 'setting';

export interface AuditLog {
  id: number;
  user_id: number | null;
  user_name: string;
  action: AuditAction;
  action_label: string;
  entity_type: AuditEntityType;
  entity_type_label: string;
  entity_id: number | null;
  description: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user?: User;
}
