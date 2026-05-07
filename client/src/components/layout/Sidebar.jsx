import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
      </svg>
    )
  },
  { 
    name: 'Projects', 
    href: '/projects', 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )
  },
  { 
    name: 'Tasks', 
    href: '/tasks', 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-surface-950/30 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-60 bg-white border-r border-surface-200',
        'flex flex-col',
        'transform transition-transform duration-200 ease-out',
        'lg:translate-x-0 lg:static lg:z-0',
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-surface-100 shrink-0">
          <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-base font-bold text-surface-900 tracking-tight">TaskFlow</span>
          </NavLink>
          <button 
            onClick={onClose}
            className="p-1.5 -mr-1.5 text-surface-700 hover:text-surface-600 hover:bg-surface-100 rounded-lg lg:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-100 group',
                  isActive 
                    ? 'bg-surface-100 text-surface-900 font-semibold' 
                    : 'text-surface-800 hover:bg-surface-50 hover:text-surface-800'
                )}
              >
                <span className={cn(
                  'shrink-0 transition-colors duration-100',
                  isActive ? 'text-brand-600' : 'text-surface-700 group-hover:text-surface-800'
                )}>
                  {item.icon}
                </span>
                {item.name}
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-surface-100 shrink-0">
          <div className="flex items-center gap-2.5 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate leading-tight">{user?.name}</p>
              <p className="text-2xs text-surface-800 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-surface-800 
                       hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};