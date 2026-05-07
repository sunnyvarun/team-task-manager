import { forwardRef, useState } from 'react';
import { cn } from '../../utils/helpers';

export const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  className,
  id,
  type,
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-semibold text-surface-600 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className={cn(
            'absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-150',
            focused ? 'text-brand-500' : 'text-surface-700'
          )}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-lg border bg-white text-sm text-surface-800',
            'placeholder:text-surface-700',
            'transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-4',
            Icon ? 'pl-10' : 'pl-3.5',
            RightIcon ? 'pr-10' : 'pr-3.5',
            error 
              ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/10' 
              : 'border-surface-300 focus:border-brand-500 focus:ring-brand-500/10 hover:border-surface-400',
            className
          )}
          {...props}
        />

        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className={cn(
              'absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors duration-150',
              onRightIconClick ? 'cursor-pointer hover:text-brand-500' : 'pointer-events-none',
              focused ? 'text-brand-500' : 'text-surface-700'
            )}
          >
            <RightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {error && (
        <p className="flex items-center gap-1 text-xs text-danger-600 mt-1 animate-fade-in">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';