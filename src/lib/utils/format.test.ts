import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime, formatPrice, formatDate } from './format';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-28T12:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Never" for null input', () => {
    expect(formatRelativeTime(null)).toBe('Never');
  });

  it('returns custom null display text', () => {
    expect(formatRelativeTime(null, '—')).toBe('—');
  });

  it('returns "Just now" for less than 1 minute ago', () => {
    expect(formatRelativeTime('2026-02-28T11:59:45Z')).toBe('Just now');
  });

  it('returns minutes ago', () => {
    expect(formatRelativeTime('2026-02-28T11:45:00Z')).toBe('15m ago');
  });

  it('returns hours ago', () => {
    expect(formatRelativeTime('2026-02-28T09:00:00Z')).toBe('3h ago');
  });

  it('returns days ago', () => {
    expect(formatRelativeTime('2026-02-26T12:00:00Z')).toBe('2d ago');
  });

  it('returns months ago', () => {
    expect(formatRelativeTime('2025-12-28T12:00:00Z')).toBe('2mo ago');
  });

  it('returns years ago', () => {
    expect(formatRelativeTime('2024-01-01T12:00:00Z')).toBe('2y ago');
  });
});

describe('formatPrice', () => {
  it('formats USD price', () => {
    expect(formatPrice(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('formats EUR price', () => {
    const result = formatPrice(99.99, 'EUR');
    expect(result).toContain('99.99');
  });

  it('formats zero price', () => {
    expect(formatPrice(0, 'USD')).toBe('$0.00');
  });

  it('formats large numbers with commas', () => {
    expect(formatPrice(1000000, 'USD')).toBe('$1,000,000.00');
  });
});

describe('formatDate', () => {
  it('formats date with default options', () => {
    const result = formatDate('2026-02-28T15:30:00Z');
    expect(result).toContain('2026');
    expect(result).toContain('Feb');
  });

  it('formats date with custom options', () => {
    const result = formatDate('2026-02-28T15:30:00Z', { year: 'numeric', month: 'long', day: 'numeric' });
    expect(result).toContain('February');
    expect(result).toContain('28');
    expect(result).toContain('2026');
  });
});
