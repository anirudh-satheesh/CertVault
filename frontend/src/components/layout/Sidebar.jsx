import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Award, 
  Briefcase, 
  Archive, 
  Settings, 
  Shield, 
  PlusCircle, 
  X,
  FileBadge
} from 'lucide-react';
import { useCertStore } from '../../stores/useCertStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

export const Sidebar = ({ isMobile = false, onClose }) => {
  const navigate = useNavigate();
  const { certificates, categoryFilter, setCategoryFilter } = useCertStore();

  // Get dynamic counts for sidebar badges
  const total = certificates.length;
  const certsCount = certificates.filter(c => c.category === 'Certifications').length;
  const awardsCount = certificates.filter(c => c.category === 'Awards').length;
  const internsCount = certificates.filter(c => c.category === 'Internships').length;
  const archiveCount = certificates.filter(c => c.category === 'Archive').length;

  const mainNav = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={16} />, 
      path: '/dashboard',
      action: () => setCategoryFilter('all') 
    },
    { 
      name: 'Certifications', 
      icon: <FileBadge size={16} />, 
      path: '/dashboard', 
      badge: certsCount,
      action: () => setCategoryFilter('Certifications')
    },
    { 
      name: 'Awards', 
      icon: <Award size={16} />, 
      path: '/dashboard', 
      badge: awardsCount,
      action: () => setCategoryFilter('Awards')
    },
    { 
      name: 'Internships', 
      icon: <Briefcase size={16} />, 
      path: '/dashboard', 
      badge: internsCount,
      action: () => setCategoryFilter('Internships')
    },
    { 
      name: 'Archive', 
      icon: <Archive size={16} />, 
      path: '/dashboard', 
      badge: archiveCount,
      action: () => setCategoryFilter('Archive')
    }
  ];

  const handleNavClick = (navItem) => {
    if (navItem.action) {
      navItem.action();
    }
    if (isMobile && onClose) {
      onClose();
    }
    navigate(navItem.path);
  };

  const activeClass = "flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-primary bg-bg-secondary rounded-lg border border-border-color/60 transition-all duration-200";
  const inactiveClass = "flex items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-all duration-200";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface border-r border-border-color text-text-primary">
      {/* Brand Header */}
      <div className="px-6 py-6 border-b border-border-color/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick({ path: '/dashboard', action: () => setCategoryFilter('all') })}>
          <div className="h-7 w-7 bg-accent text-surface rounded-lg flex items-center justify-center font-bold text-sm tracking-wider">
            CV
          </div>
          <span className="font-bold tracking-widest text-xs uppercase text-text-primary">
            CertVault
          </span>
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-bg-primary transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick Action */}
      <div className="px-4 py-4">
        <button
          onClick={() => {
            if (isMobile && onClose) onClose();
            navigate('/upload');
          }}
          className="w-full py-2 bg-accent text-surface text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-accent-hover active:bg-black transition-all-custom flex items-center justify-center gap-1.5 shadow-sm"
        >
          <PlusCircle size={14} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted/65 block mb-2">
          Workspace
        </span>
        <nav className="space-y-1">
          {mainNav.map((item) => {
            // Determine active based on current path and store filter state
            const isDashboard = window.location.pathname === '/dashboard' || window.location.pathname === '/';
            const isPathMatching = item.path === '/dashboard' && isDashboard;
            const isFilterMatching = item.name === 'Dashboard' 
              ? categoryFilter === 'all' 
              : categoryFilter === item.name;
            
            const isActive = isPathMatching && isFilterMatching;

            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className="w-full text-left focus:outline-none"
              >
                <div className={isActive ? activeClass : inactiveClass}>
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-accent text-surface' : 'bg-bg-secondary text-text-muted'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings Navigation */}
      <div className="p-4 border-t border-border-color/60 bg-bg-primary/20">
        <NavLink
          to="/settings"
          onClick={() => isMobile && onClose && onClose()}
          className={({ isActive }) => isActive ? activeClass : inactiveClass}
        >
          <div className="flex items-center gap-2.5">
            <Settings size={16} />
            <span>Settings</span>
          </div>
        </NavLink>
        
        {/* User Card */}
        {(() => {
          const user = useAuthStore.getState().user;
          const uName = user?.name || user?.username || 'Anirudh Dev';
          const uEmail = user?.email || 'admin@certvault.io';
          const initials = uName.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'AN';
          
          return (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-color/40">
              <div className="h-8 w-8 bg-neutral-900 rounded-full flex items-center justify-center text-xs font-bold text-surface border border-neutral-800">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {uName}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {uEmail}
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );

  if (isMobile) {
    return <SidebarContent />;
  }

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 hidden md:block z-20">
      <SidebarContent />
    </aside>
  );
};
