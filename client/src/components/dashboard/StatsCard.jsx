const variants = {
          brand: {
            accent: 'bg-brand-500',
            iconBg: 'bg-brand-50',
            iconColor: 'text-brand-600',
          },
          success: {
            accent: 'bg-success-500',
            iconBg: 'bg-success-50',
            iconColor: 'text-success-600',
          },
          warning: {
            accent: 'bg-warning-500',
            iconBg: 'bg-warning-50',
            iconColor: 'text-warning-600',
          },
          danger: {
            accent: 'bg-danger-500',
            iconBg: 'bg-danger-50',
            iconColor: 'text-danger-600',
          },
          accent: {
            accent: 'bg-accent-500',
            iconBg: 'bg-accent-50',
            iconColor: 'text-accent-600',
          },
          neutral: {
            accent: 'bg-surface-400',
            iconBg: 'bg-surface-100',
            iconColor: 'text-surface-800',
          },
        };
        
        export const StatsCard = ({ title, value, icon, variant = 'brand', subtitle }) => {
          const styles = variants[variant] || variants.brand;
        
          return (
            <div className="card relative overflow-hidden group p-5 cursor-default">
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${styles.accent}`} />
        
              {/* Large background icon */}
              <div className={`absolute -top-4 -right-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300`}>
                <div className="w-24 h-24">
                  {icon}
                </div>
              </div>
        
              <div className="relative flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <p className="text-xs font-semibold text-surface-800 uppercase tracking-wider">
                    {title}
                  </p>
                  <p className="text-3xl font-bold text-surface-900 tracking-tight">
                    {value}
                  </p>
                  {subtitle && (
                    <p className="text-xs text-surface-700">{subtitle}</p>
                  )}
                </div>
        
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${styles.iconBg}`}>
                  <div className={`w-5 h-5 ${styles.iconColor}`}>
                    {icon}
                  </div>
                </div>
              </div>
            </div>
          );
        };