import { cn } from '../../utils/helpers';

const variants = {
  todo: 'bg-surface-100 text-surface-700 border-surface-200',
  in_progress: 'bg-brand-50 text-brand-700 border-brand-200',
  completed: 'bg-success-50 text-success-700 border-success-200',
  overdue: 'bg-danger-50 text-danger-700 border-danger-200',
  pending: 'bg-warning-50 text-warning-700 border-warning-200',
  admin: 'bg-accent-50 text-accent-700 border-accent-200',
  member: 'bg-surface-50 text-surface-600 border-surface-200',
  primary: 'bg-brand-50 text-brand-700 border-brand-200',
  success: 'bg-success-50 text-success-700 border-success-200',
  warning: 'bg-warning-50 text-warning-700 border-warning-200',
  danger: 'bg-danger-50 text-danger-700 border-danger-200',
  neutral: 'bg-surface-100 text-surface-600 border-surface-200',
};

const dotColors = {
  todo: 'bg-surface-500',
  in_progress: 'bg-brand-500',
  completed: 'bg-success-500',
  overdue: 'bg-danger-500',
  pending: 'bg-warning-500',
  admin: 'bg-accent-500',
  member: 'bg-surface-400',
  primary: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  neutral: 'bg-surface-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-2xs gap-1',
  md: 'px-2.5 py-0.5 text-xs gap-1.5',
  lg: 'px-3 py-1 text-sm gap-1.5',
};

export const Badge = ({ 
  children, 
  variant = 'neutral', 
  dot = false, 
  size = 'md',
  className 
}) => {
  return (
    <span className={cn(
      'inline-flex items-center rounded-md font-semibold border',
      'transition-colors duration-150',
      variants[variant] || variants.neutral,
      sizes[size],
      className
    )}>
      {dot && (
        <span className={cn(
          'rounded-full shrink-0',
          size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5',
          dotColors[variant] || dotColors.neutral
        )} />
      )}
      {children}
    </span>
  );
};