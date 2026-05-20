import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings2, 
  Database, 
  Lock, 
  Key, 
  Check, 
  Save, 
  Download, 
  RotateCcw,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { SectionHeader } from '../components/common/SectionHeader';
import { Badge } from '../components/common/Badge';

export const Settings = () => {
  const { certificates, getStats } = useCertStore();
  const { user, updateProfile } = useAuthStore();
  const stats = getStats();

  const [activeSubTab, setActiveSubTab] = useState('profile'); // profile, preferences, storage, security
  const [isSaved, setIsSaved] = useState(false);

  // Form Mock states
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileBio, setProfileBio] = useState('Frontend Engineer and UX Architect passionate about document security and visual excellence.');
  const [apiKey, setApiKey] = useState('cv_live_8849201948ae88cd91bc77');
  const [showApiKey, setShowApiKey] = useState(false);

  // Toggle helpers
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name: profileName, email: profileEmail });
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

  // Reset Vault helper
  const handleResetVault = () => {
    if (confirm("Are you sure you want to reset the CertVault? This will restore the workspace back to factory default mock credentials.")) {
      localStorage.removeItem('certvault-storage');
      window.location.reload();
    }
  };

  const menuItems = [
    { id: 'profile', label: 'User Profile', icon: <User size={14} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings2 size={14} /> },
    { id: 'storage', label: 'Vault Storage', icon: <Database size={14} /> },
    { id: 'security', label: 'Keys & Security', icon: <Lock size={14} /> }
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
          Configure profile details, manage cryptographic keys, export backups, and scale preferences.
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
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-2">
                  <div className="h-16 w-16 bg-neutral-900 rounded-full flex items-center justify-center font-bold text-lg text-surface border-2 border-neutral-800 shadow">
                    AN
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Profile Picture</span>
                    <div className="flex gap-2 mt-2">
                      <Button type="button" variant="secondary" size="sm">Replace Avatar</Button>
                      <Button type="button" variant="ghost" size="sm">Remove</Button>
                    </div>
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
                    onChange={(e) => setProfileEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">Professional Bio</label>
                  <textarea
                    className="w-full px-3.5 py-2.5 text-sm bg-surface rounded-lg border border-border-color/80 text-text-primary placeholder-text-muted/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:border-border-color min-h-[80px]"
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border-color/40 pt-4 mt-2">
                  <span className="text-[10px] text-text-muted">
                    Last synced: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

          {/* PREFERENCES SUB-TAB */}
          {activeSubTab === 'preferences' && (
            <Card className="p-6">
              <SectionHeader 
                title="Workspace Preferences" 
                description="Tailor the CertVault experience." 
              />
              <div className="flex flex-col gap-5">
                {/* Preference 1 */}
                <div className="flex items-start justify-between pb-4 border-b border-border-color/40">
                  <div className="max-w-md">
                    <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">Compact Document Grid</span>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Optimize layouts for dense monitors, showing compressed borders and removing thumbnails from dashboard cards.
                    </p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={false} id="toggle-compact" />
                    <div className="w-9 h-5 bg-bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                  </div>
                </div>

                {/* Preference 2 */}
                <div className="flex items-start justify-between pb-4 border-b border-border-color/40">
                  <div className="max-w-md">
                    <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">Automatic QR Code Generation</span>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Generate dynamic sharing validation QR badges automatically for newly simulated documents.
                    </p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={true} id="toggle-qr" />
                    <div className="w-9 h-5 bg-bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                  </div>
                </div>

                {/* Preference 3 */}
                <div className="flex items-start justify-between">
                  <div className="max-w-md">
                    <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">Desktop Push Notifications</span>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Receive alerts in real-time when any certificate expiration date falls within 90 days.
                    </p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={true} id="toggle-push" />
                    <div className="w-9 h-5 bg-bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* STORAGE SUB-TAB */}
          {activeSubTab === 'storage' && (
            <Card className="p-6">
              <SectionHeader 
                title="Vault Storage & Backups" 
                description="Manage your client-side data, exports, and sandboxing." 
              />
              <div className="flex flex-col gap-6">
                {/* Storage Meter Gauge */}
                <div className="bg-bg-primary/50 border border-border-color/80 rounded-xl p-5">
                  <div className="flex justify-between items-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                    <span>Sandboxed Vault Capacity</span>
                    <span className="font-mono">{(stats.totalCertificates * 12.4).toFixed(1)} KB / 100.0 MB</span>
                  </div>
                  <div className="w-full bg-bg-secondary h-2.5 rounded-full overflow-hidden mt-3">
                    <div 
                      className="bg-accent h-full rounded-full"
                      style={{ width: `${(stats.totalCertificates * 12.4) / 1000}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-text-muted mt-3">
                    <span>Active items: {stats.totalCertificates}</span>
                    <span>99.98% space remaining</span>
                  </div>
                </div>

                {/* Backups Action Blocks */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border border-border-color/60 rounded-xl bg-surface">
                  <div className="text-left">
                    <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">Export Entire Vault</span>
                    <p className="text-[11px] text-text-muted mt-1 max-w-sm leading-relaxed">
                      Download your stored credentials locally as a formatted, readable JSON backup. You can import this dataset to restore anytime.
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

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border border-border-color/60 rounded-xl bg-surface">
                  <div className="text-left">
                    <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block text-text-primary">Factory Reset Workspace</span>
                    <p className="text-[11px] text-text-muted mt-1 max-w-sm leading-relaxed">
                      Wipe out all custom modifications, deleted elements, or uploads. Restores the 12 original premium certificates.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="shrink-0"
                    onClick={handleResetVault}
                    icon={<RotateCcw size={13} />}
                  >
                    Reset Vault
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* KEYS & SECURITY SUB-TAB */}
          {activeSubTab === 'security' && (
            <Card className="p-6">
              <SectionHeader 
                title="Keys & Security Integrations" 
                description="Cryptographic credentials for pipeline verifications." 
              />
              <div className="flex flex-col gap-5">
                {/* Info Card */}
                <div className="bg-bg-primary/50 border border-border-color/50 rounded-lg p-3 flex gap-2.5 items-start text-xs text-text-secondary">
                  <ShieldCheck size={16} className="text-text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-text-primary block mb-0.5">Verification Integrity</span>
                    Use developer keys to hook CertVault verify statuses onto continuous integration runners or external professional portfolio widgets.
                  </div>
                </div>

                {/* API Key field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">Personal API Token</label>
                  <div className="flex gap-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      className="flex-1 px-3.5 py-2 bg-bg-primary border border-border-color/80 text-xs font-mono rounded-lg text-text-primary placeholder-text-muted/70 focus:outline-none focus:border-accent"
                      value={apiKey}
                      readOnly
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? 'Hide' : 'Reveal'}
                    </Button>
                  </div>
                  <span className="text-[10px] text-text-muted">
                    Treat this token like a password. Never commit keys to public git repositories.
                  </span>
                </div>

                {/* Change password section */}
                <div className="border-t border-border-color/40 pt-5 mt-2 flex flex-col gap-4">
                  <span className="text-xs font-bold text-text-primary uppercase tracking-widest block">Change Workspace Password</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Current Password" type="password" placeholder="••••••••" />
                    <Input label="New Password" type="password" placeholder="••••••••" />
                    <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="self-end mt-2">
                    <Button variant="secondary" size="sm">Update Password</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};
