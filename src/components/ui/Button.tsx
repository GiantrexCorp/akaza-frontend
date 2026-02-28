import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-primary/20',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-[var(--text-secondary)] hover:text-primary hover:bg-white/5',
  gradient: 'bg-gradient-to-r from-primary to-primary-gradient-end hover:to-primary text-white shadow-lg hover:shadow-primary/20',
};

const sizes = {
  sm: 'px-4 py-2.5 text-[10px]',
  md: 'px-8 py-3 text-xs',
  lg: 'px-10 py-4 text-sm',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={`inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-page)] ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
