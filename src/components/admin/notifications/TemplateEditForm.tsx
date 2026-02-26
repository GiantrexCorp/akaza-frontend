'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Select, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminNotificationsApi } from '@/lib/api/admin-notifications';
import { ApiError } from '@/lib/api/client';
import type { NotificationTemplate, NotificationChannel, LocaleMap } from '@/types/admin-notification';

interface TemplateEditFormProps {
  template: NotificationTemplate;
  onSaved: (updated: NotificationTemplate) => void;
}

const channelOptions = [
  { value: 'mail', label: 'Email' },
  { value: 'database', label: 'Database' },
];

export default function TemplateEditForm({ template, onSaved }: TemplateEditFormProps) {
  const { toast } = useToast();
  const locales = Object.keys(template.subject);
  const [activeLocale, setActiveLocale] = useState(locales[0] || 'en');
  const [channel, setChannel] = useState<NotificationChannel>(template.channel);
  const [isActive, setIsActive] = useState(template.is_active);
  const [subject, setSubject] = useState<LocaleMap>({ ...template.subject });
  const [body, setBody] = useState<LocaleMap>({ ...template.body });
  const [saving, setSaving] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const handleSubjectChange = (locale: string, value: string) => {
    setSubject((prev) => ({ ...prev, [locale]: value }));
  };

  const handleBodyChange = (locale: string, value: string) => {
    setBody((prev) => ({ ...prev, [locale]: value }));
  };

  const handleCopyVariable = async (variable: string) => {
    try {
      await navigator.clipboard.writeText(`{{${variable}}}`);
      setCopiedVar(variable);
      setTimeout(() => setCopiedVar(null), 1500);
    } catch {
      toast('error', 'Failed to copy');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminNotificationsApi.updateTemplate(template.id, {
        channel,
        subject,
        body,
        is_active: isActive,
      });
      onSaved(updated);
      toast('success', 'Template updated successfully');
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to update template');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Channel + Active toggle row */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
        <div className="w-48">
          <Select
            label="Channel"
            size="sm"
            options={channelOptions}
            value={channel}
            onChange={(e) => setChannel(e.target.value as NotificationChannel)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
            Status
          </label>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-widest border transition-all duration-200 ${
              isActive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-[var(--line-soft)] text-[var(--text-muted)]'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>

      {/* Locale tabs */}
      <div className="flex gap-6 border-b border-[var(--line-soft)]">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => setActiveLocale(locale)}
            className={`pb-3 text-xs font-sans font-bold uppercase tracking-[0.2em] transition-colors border-b-2 ${
              activeLocale === locale
                ? 'text-primary border-primary'
                : 'text-[var(--text-muted)] border-transparent hover:text-primary'
            }`}
          >
            {locale}
          </button>
        ))}
      </div>

      {/* Per-locale subject + body */}
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
            Subject ({activeLocale})
          </label>
          <input
            type="text"
            value={subject[activeLocale] || ''}
            onChange={(e) => handleSubjectChange(activeLocale, e.target.value)}
            className="w-full bg-transparent border border-[var(--line-soft)] focus:border-primary text-[var(--field-text)] font-serif text-sm px-4 py-3 outline-none transition-colors duration-300"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">
            Body ({activeLocale})
          </label>
          <textarea
            value={body[activeLocale] || ''}
            onChange={(e) => handleBodyChange(activeLocale, e.target.value)}
            rows={10}
            className="w-full bg-transparent border border-[var(--line-soft)] focus:border-primary text-[var(--field-text)] font-serif text-sm px-4 py-3 outline-none transition-colors duration-300 resize-y"
          />
        </div>
      </div>

      {/* Variables reference */}
      {template.variables.length > 0 && (
        <div className="border border-[var(--line-soft)] p-4 space-y-3">
          <h3 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
            Available Variables
          </h3>
          <div className="flex flex-wrap gap-2">
            {template.variables.map((variable) => (
              <button
                key={variable}
                onClick={() => handleCopyVariable(variable)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-[var(--line-soft)] text-xs font-mono text-[var(--text-secondary)] hover:border-primary hover:text-primary transition-all duration-200"
              >
                {`{{${variable}}}`}
                {copiedVar === variable ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[var(--text-muted)] font-sans">
            Click to copy a variable to clipboard
          </p>
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <Button size="md" loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
