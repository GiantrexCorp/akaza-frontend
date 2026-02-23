'use client';

import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'py-1.5 text-sm',
  md: 'py-2 text-lg',
  lg: 'py-3 text-xl',
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, size = 'md', className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            className={`w-full appearance-none bg-transparent border-b ${error ? 'border-red-500' : 'border-[var(--line-strong)] focus:border-primary'} text-[var(--field-text)] font-serif outline-none cursor-pointer transition-colors duration-300 pr-8 ${sizes[size]} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" className="bg-[var(--surface-card)] text-[var(--text-muted)]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[var(--surface-card)] text-[var(--field-text)]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
        </div>
        {error && (
          <p className="text-red-400 text-xs font-sans">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
