'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactPhoneInput from 'react-phone-number-input';
import type { Value, Country } from 'react-phone-number-input';
import { getCountryCallingCode } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';
import { Search, ChevronDown } from 'lucide-react';

type E164Number = Value;

interface PhoneInputProps {
  label?: string;
  error?: string;
  value: E164Number | undefined;
  onChange: (value: E164Number | undefined) => void;
  required?: boolean;
  defaultCountry?: 'EG' | 'DE' | 'FR' | 'US' | 'GB';
  placeholder?: string;
}

interface CountryOption {
  value?: string;
  label: string;
  divider?: boolean;
}

interface CountrySelectProps {
  value?: string;
  onChange: (value?: string) => void;
  options: CountryOption[];
  disabled?: boolean;
  readOnly?: boolean;
  iconComponent: React.ComponentType<{ country: string; label: string }>;
  [key: string]: unknown;
}

function CountrySelectWithSearch({
  value,
  onChange,
  options,
  iconComponent: IconComponent,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) => {
    if (opt.divider) return false;
    if (!search) return true;
    return opt.label.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelect = useCallback((optValue?: string) => {
    onChange(optValue === 'ZZ' ? undefined : optValue);
    setOpen(false);
    setSearch('');
  }, [onChange]);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current || !value) return;
    const activeEl = listRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [open, value]);

  let callingCode = '';
  if (value) {
    try {
      callingCode = '+' + getCountryCallingCode(value as Country);
    } catch { /* ignore */ }
  }

  return (
    <div ref={containerRef} className="relative flex items-center shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 pr-3 border-r border-[var(--line-soft)] mr-3 text-[var(--field-text)] hover:text-primary transition-colors h-full"
      >
        {value ? (
          <IconComponent country={value} label={value} />
        ) : (
          <span className="text-sm text-[var(--text-muted)]">🌐</span>
        )}
        {callingCode && (
          <span className="text-sm font-sans text-[var(--text-muted)]">{callingCode}</span>
        )}
        <ChevronDown size={12} className="text-primary opacity-80" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[var(--surface-card)] border border-[var(--line-soft)] shadow-2xl z-50 max-h-72 flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--line-soft)]">
            <Search size={14} className="text-[var(--text-muted)] shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full bg-transparent text-sm font-sans text-[var(--field-text)] placeholder-[var(--field-placeholder)] outline-none"
            />
          </div>
          <div ref={listRef} className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 && (
              <p className="text-xs text-[var(--text-muted)] font-sans px-3 py-4 text-center">No countries found</p>
            )}
            {filteredOptions.map((opt) => {
              const isActive = (opt.value || 'ZZ') === (value || 'ZZ');
              return (
                <button
                  key={opt.value || 'ZZ'}
                  type="button"
                  data-active={isActive}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm font-sans transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-[var(--field-text)] hover:bg-[var(--line-soft)]'
                  }`}
                >
                  {opt.value && (
                    <IconComponent country={opt.value} label={opt.label} />
                  )}
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PhoneInput({
  label,
  error,
  value,
  onChange,
  required,
  defaultCountry = 'EG',
  placeholder = 'Phone number',
}: PhoneInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <ReactPhoneInput
        international
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        flags={flags}
        countrySelectComponent={CountrySelectWithSearch}
        className={`akaza-phone-input ${error ? 'akaza-phone-input--error' : ''}`}
      />
      {error && (
        <p className="text-red-400 text-xs font-sans">{error}</p>
      )}
    </div>
  );
}

export type { E164Number };
