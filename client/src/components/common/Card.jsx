import { cn } from '../../utils/helpers';

export const Card = ({ children, className, onClick, hover = true, padding = true }) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-xl border border-surface-200 shadow-card',
        padding && 'p-5',
        hover && 'transition-all duration-200 ease-out cursor-pointer',
        hover && 'hover:shadow-card-hover hover:border-surface-300 hover:-translate-y-0.5',
        hover && 'active:scale-[0.99] active:shadow-card',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
    >
      {children}
    </div>
  );
};

export const StatsCard = ({ title, value, icon: Icon, trend, variant = 'brand', className }) => {
  const gradients = {
    brand: 'bg-gradient-brand',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-warning',
    danger: 'bg-gradient-danger',
    accent: 'from-accent-500 to-accent-600',
    dark: 'bg-gradient-dark',
  };

  const iconBg = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
    accent: 'bg-accent-50 text-accent-600',
  };

  return (
    <div className={cn(
      'card relative overflow-hidden group',
      className
    )}>
      {/* Subtle top accent bar */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-0.5',
        gradients[variant] || gradients.brand
      )} />
      
      {/* Background icon */}
      {Icon && (
        <div className="absolute top-3 right-3 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300">
          <Icon className="w-24 h-24" />
        </div>
      )}

      <div className="relative flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <p className="text-xs font-semibold text-surface-800 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-surface-900 tracking-tight">
              {value}
            </h3>
            {trend !== undefined && trend !== null && (
              <span className={cn(
                'inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
                trend > 0 ? 'bg-success-50 text-success-700' : 
                trend < 0 ? 'bg-danger-50 text-danger-700' : 
                'bg-surface-100 text-surface-600'
              )}>
                <svg 
                  className={cn('w-3 h-3', trend > 0 ? 'rotate-0' : 'rotate-180')} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        
        {Icon && (
          <div className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
            'transition-transform duration-200 group-hover:scale-110',
            iconBg[variant] || iconBg.brand
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};