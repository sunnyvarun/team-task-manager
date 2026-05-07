import { cn } from '../../utils/helpers';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-glow focus:ring-brand-500 shadow-sm',
  secondary: 'bg-white text-surface-700 border border-surface-300 hover:bg-surface-50 hover:border-surface-400 hover:text-surface-900 focus:ring-surface-400 shadow-sm',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 hover:shadow-lg hover:shadow-danger-500/25 focus:ring-danger-500 shadow-sm',
  success: 'bg-success-600 text-white hover:bg-success-700 hover:shadow-lg hover:shadow-success-500/25 focus:ring-success-500 shadow-sm',
  ghost: 'bg-transparent text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:ring-surface-300',
  outline: 'bg-transparent text-brand-600 border-2 border-brand-300 hover:bg-brand-50 hover:border-brand-500 focus:ring-brand-400',
  dark: 'bg-surface-800 text-white hover:bg-surface-900 hover:shadow-lg hover:shadow-surface-900/25 focus:ring-surface-600 shadow-sm',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
  sm: 'px-3.5 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2',
  xl: 'px-8 py-3.5 text-base rounded-xl gap-2.5',
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isLoading, 
  icon: Icon,
  disabled,
  ...props 
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-150 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        isLoading && 'opacity-50 cursor-wait pointer-events-none',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg 
          className="animate-spin shrink-0" 
          width={size === 'xs' ? '14' : size === 'sm' ? '16' : '18'} 
          height={size === 'xs' ? '14' : size === 'sm' ? '16' : '18'} 
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className={cn(
          'shrink-0',
          size === 'xs' ? 'w-3.5 h-3.5' : 
          size === 'sm' ? 'w-4 h-4' : 
          size === 'lg' || size === 'xl' ? 'w-5 h-5' : 
          'w-4 h-4'
        )} />
      ) : null}
      {children}
    </button>
  );
};