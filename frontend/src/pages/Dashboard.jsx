import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  UploadCloud, 
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCertStore } from '../stores/useCertStore';
import { Card } from '../components/common/Card';
import { SearchBar } from '../components/common/SearchBar';
import { CertificateCard } from '../components/certificate/CertificateCard';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Tabs } from '../components/common/Tabs';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCertForDelete, setSelectedCertForDelete] = useState(null);

  // Local tab transition loader (micro-animation UX)
  const [isTabLoading, setIsTabLoading] = useState(false);

  const {
    certificates,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    getStats,
    getFilteredCertificates,
    deleteCertificate,
    fetchCertificates,
    isLoading
  } = useCertStore();

  const stats = getStats();
  const filteredCerts = getFilteredCertificates();

  // 1. Fetch real certificates from PocketBase on mount
  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // 2. Micro-animation skeleton loader on category tab switch
  useEffect(() => {
    setIsTabLoading(true);
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [categoryFilter]);

  const showSkeletons = isLoading || isTabLoading;

  // Handle Tab navigation
  const tabs = [
    { id: 'all', label: 'All Documents', count: certificates.length },
    { id: 'Certifications', label: 'Certifications', count: certificates.filter(c => c.category === 'Certifications').length },
    { id: 'Awards', label: 'Awards', count: certificates.filter(c => c.category === 'Awards').length },
    { id: 'Internships', label: 'Internships', count: certificates.filter(c => c.category === 'Internships').length },
    { id: 'Archive', label: 'Archive', count: certificates.filter(c => c.category === 'Archive').length }
  ];

  const handleOpenDelete = (cert) => {
    setSelectedCertForDelete(cert);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCertForDelete) {
      deleteCertificate(selectedCertForDelete.id);
      setDeleteModalOpen(false);
      setSelectedCertForDelete(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Welcome, Anirudh Dev
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Manage your credentials and verify certifications securely in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/settings')}
            icon={<SlidersHorizontal size={14} />}
          >
            Preferences
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/upload')}
            icon={<Plus size={14} />}
          >
            Quick Upload
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {showSkeletons ? (
          <SkeletonLoader variant="stats" count={4} className="grid grid-cols-2 lg:grid-cols-4 col-span-4 gap-4" />
        ) : (
          <>
            {/* Stat Card 1 */}
            <Card className="flex flex-col justify-between py-4 px-5">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Total Credentials</span>
                <span className="text-2xl font-bold tracking-tight text-text-primary mt-1.5 block">
                  {stats.totalCertificates}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mt-3">
                <FileText size={12} className="text-text-muted" />
                <span>Documents stored</span>
              </div>
            </Card>

            {/* Stat Card 2 */}
            <Card className="flex flex-col justify-between py-4 px-5">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Active Verify</span>
                <span className="text-2xl font-bold tracking-tight text-text-primary mt-1.5 block">
                  {stats.activeCredentials}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mt-3">
                <CheckCircle size={12} className="text-text-muted" />
                <span>Valid on chain</span>
              </div>
            </Card>

            {/* Stat Card 3 */}
            <Card className="flex flex-col justify-between py-4 px-5 border-neutral-300">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Expiring Soon</span>
                <span className={`text-2xl font-bold tracking-tight mt-1.5 block ${stats.expiringSoon > 0 ? 'text-text-primary underline decoration-dotted' : 'text-text-primary'}`}>
                  {stats.expiringSoon}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mt-3">
                <Clock size={12} className="text-text-muted" />
                <span>Expires &lt; 90 days</span>
              </div>
            </Card>

            {/* Stat Card 4 */}
            <Card className="flex flex-col justify-between py-4 px-5">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Recent Uploads</span>
                <span className="text-2xl font-bold tracking-tight text-text-primary mt-1.5 block">
                  {stats.recentUploads}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mt-3">
                <UploadCloud size={12} className="text-text-muted" />
                <span>Added this month</span>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Filter and Search Action Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mt-4">
        {/* Category Tabs */}
        <div className="w-full lg:w-auto">
          <Tabs
            tabs={tabs}
            activeTab={categoryFilter}
            onChange={(tabId) => setCategoryFilter(tabId)}
          />
        </div>

        {/* Search Bar */}
        <div className="w-full lg:w-96">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>
      </div>

      {/* Grid Content */}
      {showSkeletons ? (
        <SkeletonLoader variant="card" count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
      ) : filteredCerts.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No search matches' : `No items in ${categoryFilter}`}
          description={searchQuery ? 'Double-check your spelling, search for related skills or tags, or reset the query.' : 'There are no uploaded credentials in this category yet. Click upload below to add one.'}
          actionLabel={searchQuery ? 'Clear Search Bar' : 'Upload Document'}
          onAction={searchQuery ? () => setSearchQuery('') : () => navigate('/upload')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <CertificateCard
                  certificate={cert}
                  onView={() => navigate(`/certificate/${cert.id}`)}
                  onEdit={() => navigate(`/certificate/${cert.id}?edit=true`)}
                  onDelete={() => handleOpenDelete(cert)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-center">
          <div className="h-10 w-10 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Delete Document?</h4>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-text-primary">"{selectedCertForDelete?.title}"</span>? This will permanently remove the credential from your workspace.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Button
              variant="secondary"
              className="flex-1"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              size="sm"
              onClick={handleConfirmDelete}
              icon={<Trash2 size={13} />}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
