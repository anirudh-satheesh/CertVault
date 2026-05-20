import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useCertStore } from '../../stores/useCertStore';
import { useAuthStore } from '../../stores/authStore';

export const Navbar = ({ onMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryFilter } = useCertStore();

  // Determine current page title / breadcrumbs
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const items = [{ label: 'CertVault', path: '/dashboard' }];

    if (path.includes('/dashboard') || path === '/') {
      items.push({ 
        label: 'Dashboard', 
        path: '/dashboard' 
      });
      if (categoryFilter !== 'all') {
        items.push({ 
          label: categoryFilter, 
          path: '/dashboard' 
        });
      }
    } else if (path.includes('/upload')) {
      items.push({ label: 'Upload Document', path: '/upload' });
    } else if (path.includes('/certificate/')) {
      items.push({ label: 'Certificate Details', path: path });
    } else if (path.includes('/settings')) {
      items.push({ label: 'Settings', path: '/settings' });
    }

    return items;
  };

  const { logout } = useAuthStore();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 bg-surface border-b border-border-color px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="md:hidden p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-primary transition-colors focus:outline-none"
        >
          <Menu size={18} />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <ChevronRight size={10} className="text-text-muted" />}
                {isLast ? (
                  <span className="text-text-primary truncate max-w-[120px] md:max-w-none">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    to={crumb.path} 
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1 bg-bg-primary border border-border-color/60 px-2 py-0.5 rounded text-[9px] font-mono text-text-muted">
          <Shield size={10} />
          <span>AES-256 SECURED</span>
        </div>

        <button 
          className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-primary transition-colors relative"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-neutral-900 rounded-full" />
        </button>

        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-primary transition-colors inline-flex items-center cursor-pointer border-none bg-transparent"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
