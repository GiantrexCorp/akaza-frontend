import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-sans">
      {items.map((item, i) => (
        <span key={item.href ?? item.label} className="flex items-center gap-2">
          {i > 0 && <ChevronRight size={12} className="text-[var(--text-muted)]" />}
          {item.href ? (
            <Link href={item.href} className="text-[var(--text-muted)] hover:text-primary transition-colors uppercase tracking-wider">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary uppercase tracking-wider font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
