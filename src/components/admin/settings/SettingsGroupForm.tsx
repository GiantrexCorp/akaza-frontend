'use client';

import { useState } from 'react';
import { Globe, Lock } from 'lucide-react';
import { Button, Input, Toggle } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminSettingsApi } from '@/lib/api/admin-settings';
import { ApiError } from '@/lib/api/client';
import type { AdminSetting } from '@/types/settings';

interface SettingsGroupFormProps {
  settings: AdminSetting[];
  onSaved: () => void;
}

function formatKey(key: string): string {
  const short = key.includes('.') ? key.split('.').slice(1).join('.') : key;
  return short
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseInitialValues(settings: AdminSetting[]): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const s of settings) {
    if (s.type === 'json') {
      values[s.key] = Array.isArray(s.value) ? (s.value as string[]).join(', ') : JSON.stringify(s.value);
    } else {
      values[s.key] = s.value;
    }
  }
  return values;
}

export default function SettingsGroupForm({ settings, onSaved }: SettingsGroupFormProps) {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, unknown>>(() => parseInitialValues(settings));
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const s of settings) {
        const raw = values[s.key];
        if (s.type === 'integer') {
          payload[s.key] = Number(raw);
        } else if (s.type === 'float') {
          payload[s.key] = Number(raw);
        } else if (s.type === 'boolean') {
          payload[s.key] = Boolean(raw);
        } else if (s.type === 'json') {
          const str = String(raw || '');
          payload[s.key] = str.split(',').map((v) => v.trim()).filter(Boolean);
        } else {
          payload[s.key] = raw;
        }
      }
      await adminSettingsApi.update(payload);
      toast('success', 'Settings updated successfully');
      onSaved();
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to update settings');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.key} className="space-y-1">
            <div className="flex items-center gap-2">
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
                {formatKey(setting.key)}
              </label>
              <span title={setting.is_public ? 'Public' : 'Private'}>
                {setting.is_public ? (
                  <Globe size={12} className="text-primary" />
                ) : (
                  <Lock size={12} className="text-[var(--text-muted)]" />
                )}
              </span>
            </div>
            {setting.description && (
              <p className="text-[10px] text-[var(--text-muted)] font-sans mb-1">
                {setting.description}
              </p>
            )}

            {setting.type === 'boolean' ? (
              <div className="pt-1">
                <Toggle
                  checked={Boolean(values[setting.key])}
                  onChange={(checked) => handleChange(setting.key, checked)}
                  label={formatKey(setting.key)}
                />
              </div>
            ) : setting.type === 'integer' || setting.type === 'float' ? (
              <Input
                type="number"
                size="sm"
                step={setting.type === 'float' ? '0.01' : '1'}
                value={String(values[setting.key] ?? '')}
                onChange={(e) => handleChange(setting.key, e.target.value)}
              />
            ) : setting.type === 'json' ? (
              <Input
                type="text"
                size="sm"
                value={String(values[setting.key] ?? '')}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                placeholder="Comma-separated values"
              />
            ) : (
              <Input
                type={setting.type === 'email' ? 'email' : setting.type === 'url' ? 'url' : 'text'}
                size="sm"
                value={String(values[setting.key] ?? '')}
                onChange={(e) => handleChange(setting.key, e.target.value)}
              />
            )}

            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[9px] text-[var(--text-muted)] font-mono">{setting.key}</span>
              <span className="text-[9px] text-[var(--text-muted)] font-sans">({setting.type})</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-[var(--line-soft)]">
        <Button size="md" loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
