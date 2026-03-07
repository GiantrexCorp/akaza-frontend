'use client';

import { useState, useRef, useEffect, useId, type ReactNode } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  MONTHS,
  WEEKDAYS,
  parseDate,
  toDateString,
  isSameDay,
  isBefore,
  isAfter,
  getToday,
  generateCalendarGrid,
  formatDateDisplay,
} from './calendar-utils';

interface DatePickerProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  renderTrigger?: (props: { displayValue: string; onClick: () => void }) => ReactNode;
}

const sizes = {
  sm: 'py-1.5 text-sm',
  md: 'py-2 text-lg',
  lg: 'py-3 text-xl',
};

export default function DatePicker({
  label,
  error,
  icon,
  size = 'md',
  placeholder = 'Select date',
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  id: externalId,
  className = '',
  renderTrigger,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const errorId = `${inputId}-error`;
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseDate(value);
  const today = getToday();

  const [viewYear, setViewYear] = useState(parsed?.year ?? today.year);
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.month);

  useEffect(() => {
    const p = parseDate(value);
    if (p) {
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day: number) => {
    const dateStr = toDateString(viewYear, viewMonth, day);
    if (minDate && isBefore(dateStr, minDate)) return;
    if (maxDate && isAfter(dateStr, maxDate)) return;
    onChange(dateStr);
    setOpen(false);
  };

  const grid = generateCalendarGrid(viewYear, viewMonth);
  const iconNode = icon ?? <Calendar size={size === 'sm' ? 16 : 18} />;

  const toggleOpen = () => { if (!disabled) setOpen(!open); };
  const displayValue = formatDateDisplay(value);

  const calendarDropdown = open && (
    <div className="absolute z-50 top-full mt-2 left-0 w-[280px] bg-[var(--surface-card)] border border-[var(--line-soft)] shadow-xl select-none">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--line-soft)]">
        <button type="button" onClick={prevMonth} className="p-1 text-[var(--text-muted)] hover:text-primary transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-serif text-[var(--text-primary)]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth} className="p-1 text-[var(--text-muted)] hover:text-primary transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 px-2 pt-2">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="text-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-sans py-1">
            {wd}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 px-2 pb-2">
        {grid.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-8" />;
          const dateStr = toDateString(viewYear, viewMonth, day);
          const isDisabled = (minDate && isBefore(dateStr, minDate)) || (maxDate && isAfter(dateStr, maxDate));
          const isSelected = parsed && isSameDay(parsed, { year: viewYear, month: viewMonth, day });
          const isToday = isSameDay(today, { year: viewYear, month: viewMonth, day });
          let dayClass = 'text-[var(--text-secondary)] hover:text-primary hover:bg-primary/10';
          if (isSelected) dayClass = 'bg-primary text-white';
          else if (isDisabled) dayClass = 'text-[var(--text-muted)]/30 cursor-not-allowed';
          else if (isToday) dayClass = 'text-primary font-bold hover:bg-primary/10';
          return (
            <button key={`day-${day}`} type="button" disabled={!!isDisabled} onClick={() => handleDayClick(day)} className={`h-8 w-full flex items-center justify-center text-xs font-sans transition-colors ${dayClass}`}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (renderTrigger) {
    return (
      <div ref={containerRef} className="relative">
        {renderTrigger({ displayValue, onClick: toggleOpen })}
        {calendarDropdown}
      </div>
    );
  }

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label htmlFor={inputId} className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
          {label}
        </label>
      )}
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
          {iconNode}
        </span>
        <input
          id={inputId}
          type="text"
          readOnly
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onClick={toggleOpen}
          className={`w-full bg-transparent border-b ${error ? 'border-red-500' : 'border-[var(--line-strong)] focus:border-primary'} text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif outline-none transition-colors duration-300 pl-11 pr-0 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${sizes[size]} ${className}`}
        />
        {calendarDropdown}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-red-400 text-xs font-sans">{error}</p>
      )}
    </div>
  );
}
