import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Database, 
  Check, 
  Save, 
  Download
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCertStore } from '../stores/useCertStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { SectionHeader } from '../components/common/SectionHeader';

export const Settings = () => {
  const { certificates, getStats } = useCertStore();
  const { user, updateProfile } = useAuthStore();
  const stats = getStats();

  const [activeSubTab, setActiveSubTab] = useState('profile'); // profile, storage
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [profileName, setProfileName] = useState(user?.name || '');
  const profileEmail = user?.email || '';

  // Get initials for profile placeholder
  const getInitials = (name) => {
    return name
      ? name
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'US';
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name: profileName });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  // Export Vault JSON Helper
  const handleExportVault = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `certvault_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const menuItems = [
    { id: 'profile', label: 'User Profile', icon: <User size={14} /> },
    { id: 'storage', label: 'Vault Backup', icon: <Database size={14} /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Page Title */}
      <div className="text-left">
        <h1 className="text-sm font-bold uppercase tracking-widest text-text-primary">
          Settings Panel
        </h1>
        <p className="text-[10px] text-text-muted mt-0.5">
          Configure profile details and export secure backups of your workspace registry.
        </p>
      </div>

      <hr className="border-border-color/60" />

      {/* Grid Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        {/* Left Side: Category Links */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-left transition-all ${
                activeSubTab === item.id 
                  ? 'bg-surface text-text-primary border border-border-color/60 shadow-sm' 
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Tab Contents */}
        <div className="md:col-span-9">
          {/* PROFILE SUB-TAB */}
          {activeSubTab === 'profile' && (
            <Card className="p-6">
              <SectionHeader 
                title="User Profile" 
                description="Manage your professional identification details." 
              />
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-5">
                <div className="flex items-center gap-4 pb-2">
                  <div className="h-14 w-14 bg-neutral-900 rounded-full flex items-center justify-center font-bold text-sm text-surface border border-neutral-800 shadow-sm">
                    {getInitials(user?.name || user?.username)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-primary uppercase tracking-wide block">
                      {user?.name || user?.username || 'Authenticated User'}
                    </span>
                    <span className="text-[9px] text-text-muted font-mono block mt-0.5">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />
                  <Input
                    label="Work Email Address"
                    type="email"
                    value={profileEmail}
                    disabled
                    className="opacity-70 bg-bg-secondary cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border-color/40 pt-4 mt-2">
                  <span className="text-[9px] text-text-muted font-medium">
                    Account Registered: {new Date(user?.created).toLocaleDateString()}
                  </span>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={isSaved ? <Check size={14} /> : <Save size={14} />}
                  >
                    {isSaved ? 'Settings Saved' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* STORAGE SUB-TAB */}
          {activeSubTab === 'storage' && (
            <Card className="p-6">
              <SectionHeader 
                title="Vault Storage & Backups" 
                description="Manage your client-side data exports." 
              />
              <div className="flex flex-col gap-6">
                {/* Storage Meter Gauge */}
                <div className="bg-bg-primary/50 border border-border-color/80 rounded-xl p-5">
                  <div className="flex justify-between items-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                    <span>Active Storage capacity</span>
                    <span className="font-mono">{stats.totalCertificates} Items</span>
                  </div>
                  <div className="w-full bg-bg-secondary h-2.5 rounded-full overflow-hidden mt-3">
                    <div 
                      className="bg-accent h-full rounded-full"
                      style={{ width: `${Math.min(100, (stats.totalCertificates / 50) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-text-muted mt-3">
                    <span>Active database collection items: {stats.totalCertificates}</span>
                    <span>No local storage sync overhead</span>
                  </div>
                </div>

                {/* Backups Action Blocks */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border border-border-color/60 rounded-xl bg-surface">
                  <div className="text-left">
                    <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">Export Entire Vault</span>
                    <p className="text-[11px] text-text-muted mt-1 max-w-sm leading-relaxed">
                      Download your stored credentials locally as a formatted, readable JSON backup. 
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onClick={handleExportVault}
                    icon={<Download size={13} />}
                  >
                    Export JSON
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};
