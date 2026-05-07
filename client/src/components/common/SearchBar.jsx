import { useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className,
  autoFocus = false,
  shortcut = true
}) => {
  const inputRef = useRef(null);

  // Keyboard shortcut: Cmd+K or Ctrl+K to focus search
  useEffect(() => {
    if (!shortcut) return;
    
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to blur
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcut]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className={cn('relative group', className)}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <svg 
          className={cn(
            'w-4 h-4 transition-colors duration-150',
            value ? 'text-brand-500' : 'text-surface-700 group-hover:text-surface-800'
          )}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-20 py-2.5 rounded-lg border bg-white text-sm text-surface-800',
          'placeholder:text-surface-700',
          'transition-all duration-150 ease-out',
          'focus:outline-none focus:ring-4',
          value 
            ? 'border-brand-300 focus:border-brand-500 focus:ring-brand-500/10' 
            : 'border-surface-200 focus:border-brand-500 focus:ring-brand-500/10 hover:border-surface-300'
        )}
      />

      {/* Right side: Clear button + Keyboard shortcut */}
      <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1 text-surface-700 hover:text-surface-600 hover:bg-surface-100 
                       rounded-md transition-colors focus:outline-none"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {shortcut && !value && (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-2xs font-medium 
                          text-surface-700 bg-surface-100 border border-surface-200 rounded-md">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 8a1 1 0 012 0v2a1 1 0 01-2 0V8zm10 0a1 1 0 012 0v2a1 1 0 01-2 0V8zm-9.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L6 13.586l-1.293-1.293z" clipRule="evenodd" />
            </svg>
            K
          </kbd>
        )}
      </div>
    </div>
  );
};