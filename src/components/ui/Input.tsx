'use client';

import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'py-1.5 text-sm',
  md: 'py-2 text-lg',
  lg: 'py-3 text-xl',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, size = 'md', className = '', type, id: externalId, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`w-full bg-transparent border-b ${error ? 'border-red-500' : 'border-[var(--line-strong)] focus:border-primary'} text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif outline-none transition-colors duration-300 ${icon ? 'pl-11' : 'pl-0'} ${isPassword ? 'pr-12' : 'pr-0'} ${sizes[size]} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-red-400 text-xs font-sans">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
