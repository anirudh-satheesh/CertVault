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
  Trash2,
  ArrowUpDown,
  Archive,
  Tag,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCertStore } from '../stores/useCertStore';
import { Card } from '../components/common/Card';
import { SearchBar } from '../components/common/SearchBar';
import { CertificateCard } from '../components/certificate/CertificateCard';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
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
    sortOrder,
    setSortOrder,
    getStats,
    getFilteredCertificates,
    deleteCertificate,
    toggleArchiveCertificate,
    fetchCertificates,
    isLoading
  } = useCertStore();

  // Local state for debouncing search input
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search query update
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 200);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Keep local search query aligned if store changes (e.g. tag clicks)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

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
    }, 200);
    return () => clearTimeout(timer);
  }, [categoryFilter]);

  const showSkeletons = isLoading || isTabLoading;

  // Clickable Tag Filter
  const handleTagClick = (tag) => {
    setLocalSearch(tag);
  };

  // Horizontal scroll pill-style categories
  const tabs = [
    { id: 'all', label: 'All', count: certificates.filter(c => c.category !== 'Archive').length },
    { id: 'Certifications', label: 'Certifications', count: certificates.filter(c => c.category === 'Certifications').length },
    { id: 'Awards', label: 'Awards', count: certificates.filter(c => c.category === 'Awards').length },
    { id: 'Internships', label: 'Internships', count: certificates.filter(c => c.category === 'Internships').length },
    { id: 'Licenses', label: 'Licenses', count: certificates.filter(c => c.category === 'Licenses').length },
    { id: 'Archived', label: 'Archived', count: certificates.filter(c => c.category === 'Archive').length }
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
      {/* Welcome & Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-text-primary uppercase tracking-wider">
            Workspace Registry
          </h1>
          <p className="text-[10px] text-text-muted mt-0.5">
            Manage your credentials and verify certifications securely in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/settings')}
            icon={<SlidersHorizontal size={12} />}
          >
            Preferences
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/upload')}
            icon={<Plus size={12} />}
          >
            Stage Document
          </Button>
        </div>
      </div>

      <hr className="border-border-color/60" />

      {/* Main Grid: Left Column Workspace, Right Column Activity & Side Info */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Workspace Operations (Search, Filters, Document Grid) */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* Dynamic Statistics Cards Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {showSkeletons ? (
              <SkeletonLoader variant="stats" count={4} className="grid grid-cols-2 md:grid-cols-4 col-span-4 gap-4" />
            ) : (
              <>
                <Card className="flex flex-col justify-between py-3 px-4 shadow-sm border-border-color/70 hover:border-border-color transition-all">
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Total Credentials</span>
                    <span className="text-xl font-bold tracking-tight text-text-primary mt-1 block">
                      {stats.totalCertificates}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-text-secondary mt-2">
                    <FileText size={11} className="text-text-muted" />
                    <span>Documents vaulted</span>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between py-3 px-4 shadow-sm border-border-color/70 hover:border-border-color transition-all">
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Active Categories</span>
                    <span className="text-xl font-bold tracking-tight text-text-primary mt-1 block">
                      {stats.categoriesCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-text-secondary mt-2">
                    <FileCheck size={11} className="text-text-muted" />
                    <span>Active classifications</span>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between py-3 px-4 shadow-sm border-border-color/70 hover:border-border-color transition-all">
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Recent Uploads</span>
                    <span className="text-xl font-bold tracking-tight text-text-primary mt-1 block">
                      {stats.recentUploads}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-text-secondary mt-2">
                    <Clock size={11} className="text-text-muted" />
                    <span>Added last 30d</span>
                  </div>
                </Card>

                <Card className="flex flex-col justify-between py-3 px-4 shadow-sm border-border-color/70 hover:border-border-color transition-all">
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Archived Vault</span>
                    <span className="text-xl font-bold tracking-tight text-text-primary mt-1 block">
                      {stats.archivedCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-text-secondary mt-2">
                    <Archive size={11} className="text-text-muted" />
                    <span>Soft-deleted registries</span>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Interactive discovery bar (Search & Filtering System & Sorting) */}
          <div className="flex flex-col gap-4 bg-surface p-4 border border-border-color/70 rounded-xl">
            {/* Search Bar Row */}
            <div className="w-full">
              <SearchBar
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onClear={() => setLocalSearch('')}
                placeholder="Search certificates, skills, tags, or issuers..."
              />
            </div>

            {/* Pill Filters & Sorting select */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Pill Tabs */}
              <div className="flex items-center overflow-x-auto scrollbar-none gap-1.5 pb-1 w-full md:w-auto">
                {tabs.map((tab) => {
                  const isActive = categoryFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCategoryFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 focus:outline-none border ${
                        isActive 
                          ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm' 
                          : 'bg-surface border-border-color text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                          isActive ? 'bg-neutral-800 text-white' : 'bg-bg-secondary text-text-muted'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sorting options select */}
              <div className="w-full md:w-auto shrink-0 flex justify-end">
                <div className="flex items-center gap-1.5 border border-border-color bg-surface pl-3 pr-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-text-primary focus-within:ring-1 focus-within:ring-neutral-400">
                  <span className="text-text-muted"><ArrowUpDown size={11} /></span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-transparent focus:outline-none cursor-pointer pr-1 text-[10px] font-bold uppercase tracking-wider appearance-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="issuer-asc">Issuer A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          {showSkeletons ? (
            <SkeletonLoader variant="card" count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
          ) : filteredCerts.length === 0 ? (
            <EmptyState
              title={
                searchQuery 
                  ? 'No search matches' 
                  : categoryFilter === 'Archived' 
                  ? 'Archive vault clean'
                  : `No items in ${categoryFilter}`
              }
              description={
                searchQuery 
                  ? 'No matching documents found. Double-check your spelling, search for related skills or tags, or reset the query.' 
                  : categoryFilter === 'Archived'
                  ? 'Your archive vault is clean. Archive old or inactive credentials to declutter your workspace.'
                  : 'There are no active staged documents in this workspace category yet. Stage a document to begin.'
              }
              actionLabel={
                searchQuery 
                  ? 'Clear Search Filter' 
                  : categoryFilter === 'Archived'
                  ? null
                  : 'Stage Document'
              }
              onAction={
                searchQuery 
                  ? () => setLocalSearch('') 
                  : categoryFilter === 'Archived'
                  ? null
                  : () => navigate('/upload')
              }
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
                      onArchive={() => toggleArchiveCertificate(cert.id)}
                      onTagClick={handleTagClick}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Sidebar: Vault updates & Info */}
        <div className="xl:col-span-1 flex flex-col gap-6 text-left">
          {/* Highlights Summary */}
          {stats.newestCredential !== 'None' && (
            <Card className="p-4 flex flex-col gap-1 border-border-color/80 shadow-sm">
              <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest block">Newest Registry</span>
              <span className="text-xs font-bold text-text-primary mt-1 block truncate uppercase tracking-wider">{stats.newestCredential}</span>
            </Card>
          )}

          {/* Security Info */}
          <Card className="p-4 flex flex-col gap-2 bg-neutral-900/5 border border-neutral-900/10">
            <span className="text-[8px] font-bold text-neutral-950 uppercase tracking-widest">Workspace assurance</span>
            <p className="text-[10px] text-neutral-600 leading-relaxed">
              All credentials uploaded into CertVault benefit from absolute user isolation, ownership constraints, and military-grade AES local encryption.
            </p>
          </Card>
        </div>

      </div>

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
