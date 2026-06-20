import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  pillText?: string;
  pillIcon?: LucideIcon;
  pillColor?: 'teal' | 'indigo';
  className?: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  pillText,
  pillIcon: PillIcon,
  pillColor = 'teal',
  className,
  centered = true,
}: SectionHeaderProps) {
  const pillColorClasses = pillColor === 'teal' 
    ? "text-teal-600 bg-teal-500/5 border-teal-500/10" 
    : "text-indigo-600 bg-indigo-500/5 border-indigo-500/10";

  return (
    <div className={cn(
      "space-y-4",
      centered ? "text-center mx-auto" : "text-left",
      className
    )}>
      {pillText && (
        <span className={cn(
          "px-3.5 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5 w-fit shadow-sm border",
          centered && "mx-auto",
          pillColorClasses
        )}>
          {PillIcon && <PillIcon className="h-3.5 w-3.5 animate-pulse" />}
          {pillText}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
        {subtitle}
      </p>
    </div>
  );
}

