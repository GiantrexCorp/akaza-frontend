'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages: (number | '...')[] = [];
  const delta = 2;

  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2.5 text-[var(--text-muted)] hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-[var(--text-muted)] text-sm font-sans">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[40px] h-10 sm:min-w-[36px] sm:h-9 text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 ${page === currentPage ? 'bg-primary text-white' : 'text-[var(--text-muted)] hover:text-primary hover:bg-white/5'}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="p-2.5 text-[var(--text-muted)] hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
