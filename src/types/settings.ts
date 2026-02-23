export interface PublicSetting {
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  group: string;
  type: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'email' | 'url';
}
