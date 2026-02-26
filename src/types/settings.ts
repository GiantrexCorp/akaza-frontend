export interface PublicSetting {
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  group: string;
  type: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'email' | 'url';
}

export type SettingType = 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'email' | 'url';

export type SettingGroup = 'general' | 'hotel' | 'payment' | 'company' | 'email';

export interface AdminSetting {
  id: number;
  group: SettingGroup;
  key: string;
  value: unknown;
  type: SettingType;
  is_public: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

export type GroupedSettings = Record<string, AdminSetting[]>;

export interface BulkUpdateSettingsRequest {
  settings: Record<string, unknown>;
}
