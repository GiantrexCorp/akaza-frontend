'use client';

import { useState, useRef, useEffect, useId, useCallback } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import Spinner from './Spinner';

export interface AutocompleteOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface AutocompleteProps {
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  options: AutocompleteOption[];
  isLoading?: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (option: AutocompleteOption) => void;
  selectedLabel?: string;
  onClear?: () => void;
  error?: string;
}

const sizes = {
  sm: 'py-1.5 text-sm',
  md: 'py-2 text-lg',
  lg: 'py-3 text-xl',
};

function highlightMatch(text: string, query: string) {
  if (!query || query.length < 2) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-bold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function Autocomplete({
  label,
  placeholder,
  icon,
  size = 'md',
  options,
  isLoading = false,
  query,
  onQueryChange,
  onSelect,
  selectedLabel,
  onClear,
  error,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const inputId = `autocomplete-${generatedId}`;
  const listboxId = `listbox-${generatedId}`;
  const errorId = `${inputId}-error`;

  const showDropdown = isOpen && (options.length > 0 || isLoading || (query.length >= 2 && !isLoading));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [options]);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && query.length >= 2) {
        setIsOpen(true);
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          onSelect(options[activeIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, activeIndex, options, onSelect, query.length]);

  const displayValue = selectedLabel || query;

  return (
    <div className="space-y-2" ref={containerRef}>
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
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          aria-autocomplete="list"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={displayValue}
          onChange={(e) => {
            onQueryChange(e.target.value);
            if (selectedLabel && onClear) onClear();
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.length >= 2 && !selectedLabel) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent border-b ${error ? 'border-red-500' : 'border-[var(--line-strong)] focus:border-primary'} text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif outline-none transition-colors duration-300 ${icon ? 'pl-11' : 'pl-0'} ${selectedLabel ? 'pr-10' : 'pr-0'} ${sizes[size]}`}
        />
        {selectedLabel && onClear && (
          <button
            type="button"
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            aria-label="Clear selection"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-primary transition-colors p-1"
          >
            <X size={14} />
          </button>
        )}

        {showDropdown && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="absolute z-50 left-0 right-0 top-full mt-1 max-h-60 overflow-auto bg-[var(--surface-card)] border border-[var(--line-soft)] shadow-xl"
          >
            {isLoading ? (
              <li className="flex items-center justify-center py-4">
                <Spinner size="sm" />
              </li>
            ) : options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-[var(--text-muted)] font-sans">
                No destinations found
              </li>
            ) : (
              options.map((option, idx) => (
                <li
                  key={option.value}
                  id={`${listboxId}-option-${idx}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`px-4 py-2.5 cursor-pointer transition-colors ${
                    idx === activeIndex
                      ? 'bg-primary/10 text-[var(--text-primary)]'
                      : 'text-[var(--text-primary)] hover:bg-primary/5'
                  }`}
                >
                  <div className="text-sm font-serif">
                    {highlightMatch(option.label, query)}
                  </div>
                  {option.sublabel && (
                    <div className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
                      {option.sublabel}
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-red-400 text-xs font-sans">{error}</p>
      )}
    </div>
  );
}
