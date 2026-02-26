'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: string;
}

const sizes = {
  sm: { track: 'w-8 h-[18px]', thumb: 'w-3.5 h-3.5', translate: 'translate-x-[14px]' },
  md: { track: 'w-10 h-[22px]', thumb: 'w-4 h-4', translate: 'translate-x-[18px]' },
};

export default function Toggle({ checked, onChange, disabled = false, size = 'md', label }: ToggleProps) {
  const s = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`relative inline-flex items-center shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-card)] ${s.track} ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-primary' : 'bg-[var(--line-strong)]'}`}
    >
      <span
        className={`inline-block transition-transform duration-200 bg-white ${s.thumb} ${
          checked ? s.translate : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
