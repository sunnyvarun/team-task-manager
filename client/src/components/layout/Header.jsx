import { useAuth } from '../../context/AuthContext';

export const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-14 bg-white border-b border-surface-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 -ml-1.5 text-surface-800 hover:text-surface-700 hover:bg-surface-100 rounded-lg lg:hidden transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-surface-900">
            {getGreeting()}, <span className="text-surface-700">{user?.name?.split(' ')[0]}</span>
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search shortcut hint */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-lg 
                        text-xs text-surface-700 cursor-text hover:border-surface-300 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search</span>
          <kbd className="ml-3 px-1.5 py-0.5 text-2xs bg-surface-200 text-surface-800 rounded font-mono">
            Ctrl+K
          </kbd>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-surface-200 mx-1" />
        
        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center text-white text-xs font-semibold shadow-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm font-medium text-surface-700">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};