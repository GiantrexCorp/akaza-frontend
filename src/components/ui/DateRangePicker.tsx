'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
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
  formatShortDate,
  type CalendarDate,
} from './calendar-utils';

export interface DateRange {
  checkIn: string;
  checkOut: string;
}

type Phase = 'checkIn' | 'checkOut';

interface DateRangePickerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  value: DateRange;
  onChange: (value: DateRange) => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  className?: string;
  renderTrigger?: (props: {
    displayValue: string;
    checkInDisplay: string;
    checkOutDisplay: string;
    phase: Phase;
    onClick: () => void;
  }) => ReactNode;
}

const sizes = {
  sm: 'py-1.5 text-sm',
  md: 'py-2 text-lg',
  lg: 'py-3 text-xl',
};

function getNextMonth(year: number, month: number): { year: number; month: number } {
  return month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
}

function CalendarMonth({
  year,
  month,
  checkIn,
  checkOut,
  hoveredDate,
  phase,
  minDate,
  maxDate,
  onDayClick,
  onDayHover,
}: {
  year: number;
  month: number;
  checkIn: CalendarDate | null;
  checkOut: CalendarDate | null;
  hoveredDate: string | null;
  phase: Phase;
  minDate?: string;
  maxDate?: string;
  onDayClick: (dateStr: string) => void;
  onDayHover: (dateStr: string | null) => void;
}) {
  const today = getToday();
  const grid = generateCalendarGrid(year, month);

  const checkInStr = checkIn ? toDateString(checkIn.year, checkIn.month, checkIn.day) : null;
  const checkOutStr = checkOut ? toDateString(checkOut.year, checkOut.month, checkOut.day) : null;

  // Range end for highlighting: use checkOut if set, otherwise hoveredDate during checkOut phase
  const rangeEnd = checkOutStr || (phase === 'checkOut' && hoveredDate ? hoveredDate : null);

  return (
    <div>
      <div className="text-center text-sm font-serif text-[var(--text-primary)] py-3">
        {MONTHS[month]} {year}
      </div>
      <div className="grid grid-cols-7 px-2">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="text-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-sans py-1">
            {wd}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 px-2 pb-2">
        {grid.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-8" />;

          const dateStr = toDateString(year, month, day);
          const isDisabled = (minDate && isBefore(dateStr, minDate)) || (maxDate && isAfter(dateStr, maxDate));
          const cellDate: CalendarDate = { year, month, day };
          const isStart = checkIn && isSameDay(cellDate, checkIn);
          const isEnd = checkOut && isSameDay(cellDate, checkOut);
          const isToday = isSameDay(today, cellDate);

          // Range membership
          let inRange = false;
          let inHoverPreview = false;
          if (checkInStr && rangeEnd && !isBefore(rangeEnd, checkInStr)) {
            if (!isBefore(dateStr, checkInStr) && !isAfter(dateStr, rangeEnd)) {
              if (checkOutStr) {
                inRange = true;
              } else {
                inHoverPreview = true;
              }
            }
          }

          let cellClass = '';
          if (isStart || isEnd) {
            cellClass = 'bg-primary text-white';
          } else if (isDisabled) {
            cellClass = 'text-[var(--text-muted)]/30 cursor-not-allowed';
          } else if (inRange) {
            cellClass = 'bg-primary/10 text-[var(--text-secondary)] hover:bg-primary/20';
          } else if (inHoverPreview) {
            cellClass = 'bg-primary/5 text-[var(--text-secondary)] hover:bg-primary/10';
          } else if (isToday) {
            cellClass = 'text-primary font-bold hover:bg-primary/10';
          } else {
            cellClass = 'text-[var(--text-secondary)] hover:text-primary hover:bg-primary/10';
          }

          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={!!isDisabled}
              onClick={() => onDayClick(dateStr)}
              onMouseEnter={() => onDayHover(dateStr)}
              onMouseLeave={() => onDayHover(null)}
              className={`h-8 w-full flex items-center justify-center text-xs font-sans transition-colors ${cellClass}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangePicker({
  label,
  size = 'md',
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  className = '',
  renderTrigger,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('checkIn');
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkIn = parseDate(value.checkIn);
  const checkOut = parseDate(value.checkOut);
  const today = getToday();

  const [viewYear, setViewYear] = useState(checkIn?.year ?? today.year);
  const [viewMonth, setViewMonth] = useState(checkIn?.month ?? today.month);

  useEffect(() => {
    const ci = parseDate(value.checkIn);
    if (ci) {
      setViewYear(ci.year);
      setViewMonth(ci.month);
    }
  }, [value.checkIn]);

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

  const handleOpen = () => {
    if (disabled) return;
    setOpen(!open);
    if (!open) {
      setPhase('checkIn');
      setHoveredDate(null);
    }
  };

  const handleDayClick = (dateStr: string) => {
    if (minDate && isBefore(dateStr, minDate)) return;
    if (maxDate && isAfter(dateStr, maxDate)) return;

    if (phase === 'checkIn') {
      onChange({ checkIn: dateStr, checkOut: '' });
      setPhase('checkOut');
    } else {
      // checkOut phase
      const currentCheckIn = value.checkIn || dateStr;
      if (isBefore(dateStr, currentCheckIn) || dateStr === currentCheckIn) {
        // Clicked before or on check-in: restart
        onChange({ checkIn: dateStr, checkOut: '' });
        setPhase('checkOut');
      } else {
        onChange({ checkIn: currentCheckIn, checkOut: dateStr });
        setOpen(false);
        setPhase('checkIn');
      }
    }
  };

  const nextMo = getNextMonth(viewYear, viewMonth);

  const checkInDisplay = formatShortDate(value.checkIn);
  const checkOutDisplay = formatShortDate(value.checkOut);
  const displayValue = checkInDisplay && checkOutDisplay
    ? `${checkInDisplay} — ${checkOutDisplay}`
    : checkInDisplay
      ? `${checkInDisplay} — ...`
      : '';

  const phaseLabel = phase === 'checkIn'
    ? 'Select check-in date'
    : `Check-in ${checkInDisplay} — Select check-out`;

  const calendarDropdown = open && (
    <div className="absolute z-50 top-full mt-2 left-0 bg-[var(--surface-card)] border border-[var(--line-soft)] shadow-xl select-none">
      {/* Phase indicator */}
      <div className="px-4 py-2.5 border-b border-[var(--line-soft)] text-xs font-sans text-[var(--text-muted)]">
        {phaseLabel}
      </div>

      {/* Navigation + Calendars */}
      <div className="flex items-start">
        {/* Prev arrow */}
        <button type="button" onClick={prevMonth} className="p-2 mt-2.5 text-[var(--text-muted)] hover:text-primary transition-colors shrink-0">
          <ChevronLeft size={16} />
        </button>

        {/* Month grids */}
        <div className="flex">
          {/* First month - always visible */}
          <div className="w-[240px]">
            <CalendarMonth
              year={viewYear}
              month={viewMonth}
              checkIn={checkIn}
              checkOut={checkOut}
              hoveredDate={hoveredDate}
              phase={phase}
              minDate={minDate}
              maxDate={maxDate}
              onDayClick={handleDayClick}
              onDayHover={setHoveredDate}
            />
          </div>

          {/* Second month - hidden on mobile */}
          <div className="hidden md:block w-[240px] border-l border-[var(--line-soft)]">
            <CalendarMonth
              year={nextMo.year}
              month={nextMo.month}
              checkIn={checkIn}
              checkOut={checkOut}
              hoveredDate={hoveredDate}
              phase={phase}
              minDate={minDate}
              maxDate={maxDate}
              onDayClick={handleDayClick}
              onDayHover={setHoveredDate}
            />
          </div>
        </div>

        {/* Next arrow */}
        <button type="button" onClick={nextMonth} className="p-2 mt-2.5 text-[var(--text-muted)] hover:text-primary transition-colors shrink-0">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  if (renderTrigger) {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        {renderTrigger({
          displayValue,
          checkInDisplay,
          checkOutDisplay,
          phase,
          onClick: handleOpen,
        })}
        {calendarDropdown}
      </div>
    );
  }

  const iconNode = <Calendar size={size === 'sm' ? 16 : 18} />;

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">
          {label}
        </label>
      )}
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
          {iconNode}
        </span>
        <input
          type="text"
          readOnly
          disabled={disabled}
          value={displayValue}
          placeholder="Select dates"
          onClick={handleOpen}
          className={`w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif outline-none transition-colors duration-300 pl-11 pr-0 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${sizes[size]} ${className}`}
        />
        {calendarDropdown}
      </div>
    </div>
  );
}
