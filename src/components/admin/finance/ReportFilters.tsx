'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Select } from '@/components/ui';
import type { FinanceReportParams, RevenuePeriodType } from '@/types/finance';

interface ReportFiltersProps {
  onGenerate: (params: FinanceReportParams) => void;
  loading: boolean;
}

const periodOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

function getDefaultFrom(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function getDefaultTo(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export default function ReportFilters({ onGenerate, loading }: ReportFiltersProps) {
  const [period, setPeriod] = useState<RevenuePeriodType>('monthly');
  const [from, setFrom] = useState(getDefaultFrom);
  const [to, setTo] = useState(getDefaultTo);

  const canGenerate = from && to && !loading;

  const handleGenerate = () => {
    if (!canGenerate) return;
    onGenerate({ period, from, to });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end">
      <div className="w-40">
        <label className="block text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">
          Period
        </label>
        <Select
          size="sm"
          options={periodOptions}
          value={period}
          onChange={(e) => setPeriod(e.target.value as RevenuePeriodType)}
        />
      </div>

      <div className="w-40">
        <label className="block text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">
          From
        </label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] font-serif text-sm py-1.5 outline-none transition-colors duration-300"
        />
      </div>

      <div className="w-40">
        <label className="block text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">
          To
        </label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] font-serif text-sm py-1.5 outline-none transition-colors duration-300"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-sans font-medium hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FileText size={14} />
        Generate Report
      </button>
    </div>
  );
}
