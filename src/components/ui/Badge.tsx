export type BadgeColor = 'yellow' | 'green' | 'red' | 'gray' | 'orange' | 'blue' | 'purple';

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  size?: 'sm' | 'md';
}

const colors = {
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  gray: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[9px]',
  md: 'px-3 py-1 text-[10px]',
};

export default function Badge({ label, color = 'gray', size = 'md' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-sans font-bold uppercase tracking-wider border ${colors[color]} ${sizes[size]}`}>
      {label}
    </span>
  );
}
