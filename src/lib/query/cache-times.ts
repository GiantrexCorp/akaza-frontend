export const CACHE_TIME = {
  SHORT:  { staleTime: 60_000,      gcTime: 5 * 60_000 },
  MEDIUM: { staleTime: 5 * 60_000,  gcTime: 15 * 60_000 },
  LONG:   { staleTime: 10 * 60_000, gcTime: 30 * 60_000 },
} as const;
