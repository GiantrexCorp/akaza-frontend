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
    <div className="group text-center p-10 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
      <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center text-primary group-hover:text-white transition-colors">
        <Icon size={48} strokeWidth={1} />
      </div>
      <h4 className="text-2xl font-serif text-white mb-4 italic">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed tracking-wide font-sans">
        {description}
      </p>
    </div>
  );
}
