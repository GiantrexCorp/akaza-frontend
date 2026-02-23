import Breadcrumb from '@/components/ui/Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="relative pt-36 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)] leading-none mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-[var(--text-muted)] font-sans font-light max-w-2xl">
            {subtitle}
          </p>
        )}
        <div className="mt-8 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </section>
  );
}
