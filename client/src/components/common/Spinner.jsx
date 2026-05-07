import { cn } from '../../utils/helpers';

export const Spinner = ({ size = 'md', variant = 'brand', className }) => {
  const sizes = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-5 h-5 border-2',
    md: 'w-7 h-7 border-[3px]',
    lg: 'w-10 h-10 border-[3px]',
    xl: 'w-14 h-14 border-4',
  };

  const variants = {
    brand: 'border-surface-200 border-t-brand-600',
    light: 'border-white/20 border-t-white',
    success: 'border-surface-200 border-t-success-600',
    danger: 'border-surface-200 border-t-danger-600',
    warning: 'border-surface-200 border-t-warning-600',
  };

  return (
    <div 
      className={cn('flex items-center justify-center', className)}
      role="status"
      aria-label="Loading"
    >
      <div className={cn(
        'rounded-full animate-spin',
        sizes[size],
        variants[variant] || variants.brand
      )} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const PageLoader = ({ message = 'Loading' }) => (
  <div className="flex items-center justify-center min-h-screen bg-surface-50">
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <Spinner size="xl" variant="brand" />
      <p className="text-sm font-medium text-surface-800">{message}</p>
    </div>
  </div>
);

export const InlineLoader = ({ message = 'Loading' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="md" />
      <p className="text-xs text-surface-700">{message}</p>
    </div>
  </div>
);

export const Skeleton = ({ className, lines = 1 }) => {
  if (lines === 1) {
    return (
      <div className={cn(
        'h-4 bg-surface-200 rounded-md animate-pulse-soft',
        className
      )} />
    );
  }

  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 bg-surface-200 rounded-md animate-pulse-soft"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
};