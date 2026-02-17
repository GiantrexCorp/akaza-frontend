import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="group text-center p-10 border border-[var(--line-soft)] bg-[var(--surface-card)]/70 hover:bg-[var(--surface-card)] transition-all duration-500">
      <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center text-primary group-hover:text-primary-dark transition-colors">
        <Icon size={48} strokeWidth={1} />
      </div>
      <h4 className="text-2xl font-serif text-[var(--text-primary)] mb-4 italic">{title}</h4>
      <p className="text-[var(--text-muted)] text-sm leading-relaxed tracking-wide font-sans">
        {description}
      </p>
    </div>
  );
}
