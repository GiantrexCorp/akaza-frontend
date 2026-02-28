import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

type ThemeMode = 'dark' | 'light';

const getThemeSnapshot = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  const documentTheme = document.documentElement.getAttribute('data-theme');
  if (documentTheme === 'light' || documentTheme === 'dark') return documentTheme;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
  return 'dark';
};

const subscribeTheme = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener('themechange', handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('themechange', handler);
  };
};

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'dark' as ThemeMode);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    window.dispatchEvent(new Event('themechange'));
  };

  return { theme, isLight: theme === 'light', toggleTheme };
}

interface ThemeToggleProps {
  isLight: boolean;
  theme: ThemeMode;
  onToggle: () => void;
  mobile?: boolean;
}

export default function ThemeToggle({ isLight, theme, onToggle, mobile }: ThemeToggleProps) {
  if (mobile) {
    return (
      <button
        onClick={onToggle}
        className={`w-full rounded-full border border-[var(--line-soft)] px-4 py-2 text-xs uppercase tracking-widest font-medium text-[var(--text-secondary)] transition-colors hover:text-primary hover:border-primary flex items-center justify-center gap-2 ${
          isLight ? 'bg-white/80' : 'bg-black/15'
        }`}
        aria-label="Toggle theme"
        type="button"
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
      </button>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`h-10 w-10 rounded-full border border-[var(--line-soft)] text-[var(--text-secondary)] transition-colors flex items-center justify-center ${
        isLight
          ? 'bg-white/70 hover:border-primary/40 hover:text-[var(--text-primary)]'
          : 'bg-black/15 hover:border-[var(--nav-avatar-border)] hover:text-[var(--nav-user-hover-text)]'
      }`}
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
