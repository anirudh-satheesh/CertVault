import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  ShieldCheck, 
  Layers, 
  Tag, 
  FileText,
  Clock,
  Printer,
  Copy,
  Check,
  Award,
  RefreshCcw,
  Share2
} from 'lucide-react';
import { useCertStore } from '../stores/useCertStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Dropdown } from '../components/common/Dropdown';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { SectionHeader } from '../components/common/SectionHeader';
import { 
  getPBFileUrl, 
  isImageFile, 
  isPDFFile, 
  getFileIcon, 
  getFileCategory 
} from '../utils/fileUtils';

export const CertificateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    certificates, 
    updateCertificate, 
    deleteCertificate,
    fetchCertificates,
    isLoading: storeLoading
  } = useCertStore();

  const certificate = certificates.find((c) => c.id === id);

  const tags = certificate
    ? (Array.isArray(certificate.tags) ? certificate.tags : JSON.parse(certificate.tags || '[]'))
    : [];
  const skills = certificate
    ? (Array.isArray(certificate.skills) ? certificate.skills : JSON.parse(certificate.skills || '[]'))
    : [];

  const [localLoading, setLocalLoading] = useState(true);
  const isLoading = localLoading || storeLoading;
  const [isCopied, setIsCopied] = useState(false);
  
  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Edit Form Fields
  const [editTitle, setEditTitle] = useState('');
  const [editIssuer, setEditIssuer] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editIssueDate, setEditIssueDate] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editCredentialId, setEditCredentialId] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editTagsInput, setEditTagsInput] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [editSkillsInput, setEditSkillsInput] = useState('');
  const [editSkills, setEditSkills] = useState([]);

  // Fetch credentials if not loaded (SPA refresh recovery)
  useEffect(() => {
    const loadData = async () => {
      setLocalLoading(true);
      try {
        if (certificates.length === 0) {
          await fetchCertificates();
        }
      } catch (err) {
        console.error('Failed to sync certificates:', err);
      } finally {
        setLocalLoading(false);
      }
    };
    loadData();
  }, [id, fetchCertificates, certificates.length]);

  useEffect(() => {
    if (certificate) {
      setEditTitle(certificate.title);
      setEditIssuer(certificate.issuer);
      setEditCategory(certificate.category);
      setEditIssueDate(certificate.issueDate);
      setEditExpiryDate(certificate.expiryDate || '');
      setEditCredentialId(certificate.credentialId || '');
      setEditNotes(certificate.notes || '');

      const parsedTags = Array.isArray(certificate.tags) 
        ? certificate.tags 
        : JSON.parse(certificate.tags || '[]');
      const parsedSkills = Array.isArray(certificate.skills) 
        ? certificate.skills 
        : JSON.parse(certificate.skills || '[]');
      setEditTags(parsedTags);
      setEditSkills(parsedSkills);

      // If URL contains ?edit=true, automatically open the editor modal
      if (searchParams.get('edit') === 'true') {
        setIsEditOpen(true);
      }
    }
  }, [certificate, searchParams]);

  // File Upload / Replace State
  const fileInputRef = React.useRef(null);
  const [isReplacing, setIsReplacing] = useState(false);

  const handleReplaceFile = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsReplacing(true);
    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      await updateCertificate(certificate.id, formData);
      // Wait a moment, fetch latest to update the view
      await fetchCertificates();
    } catch (err) {
      console.error('Failed to replace file:', err);
      alert('Failed to replace file.');
    } finally {
      setIsReplacing(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!certificate && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 bg-surface border border-border-color rounded-xl max-w-md mx-auto my-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary">Document Not Found</h2>
        <p className="text-xs text-text-muted mt-2 mb-6">The credential ID you are looking for does not exist or has been deleted.</p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  // Copy mock verify shareable link
  const handleCopyLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(`https://certvault.io/verify/${certificate?.id}`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editIssuer.trim() || !editIssueDate) return;

    try {
      await updateCertificate(certificate.id, {
        title: editTitle,
        issuer: editIssuer,
        category: editCategory,
        issueDate: editIssueDate,
        expiryDate: editExpiryDate || null,
        credentialId: editCredentialId || null,
        notes: editNotes,
        tags: editTags,
        skills: editSkills
      });

      setIsEditOpen(false);
      setSearchParams({});
    } catch (err) {
      console.error('Failed to update certificate:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCertificate(certificate.id);
      setIsDeleteOpen(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete certificate:', err);
    }
  };

  // Tag helper
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = editTagsInput.trim().toLowerCase();
      if (val && !editTags.includes(val)) {
        setEditTags([...editTags, val]);
      }
      setEditTagsInput('');
    }
  };

  // Skill helper
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = editSkillsInput.trim();
      if (val && !editSkills.includes(val)) {
        setEditSkills([...editSkills, val]);
      }
      setEditSkillsInput('');
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 hover:bg-surface border border-transparent hover:border-border-color rounded-lg text-text-muted hover:text-text-primary transition-all duration-200"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Credential Profile</span>
            <h1 className="text-base font-bold text-text-primary uppercase tracking-wider mt-0.5 max-w-sm sm:max-w-md md:max-w-xl truncate">
              {isLoading ? 'Loading Certificate...' : certificate.title}
            </h1>
          </div>
        </div>

        {/* Top actions */}
        {!isLoading && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              icon={isCopied ? <Check size={13} /> : <Share2 size={13} />}
            >
              {isCopied ? 'Link Copied' : 'Share Verify'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              icon={<Edit3 size={13} />}
            >
              Edit Details
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              icon={<Trash2 size={13} />}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <hr className="border-border-color/60" />

      {/* Main Split Layout */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <div className="lg:col-span-7">
            <SkeletonLoader variant="details" count={1} />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-5">
            <SkeletonLoader variant="stats" count={3} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Left Column: Virtual Digital Document Workspace */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Digital Document Preview
            </span>

            {/* Real File Preview Area */}
            <div className="w-full aspect-[4/3] sm:aspect-[16/11] bg-surface-hover border border-border-color shadow-sm rounded-xl relative overflow-hidden flex flex-col items-center justify-center select-none group">
              {isReplacing && (
                <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                  <RefreshCcw size={24} className="animate-spin text-text-primary mb-3" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Replacing Document...</span>
                </div>
              )}
              
              {certificate.document ? (
                isImageFile('', certificate.document) ? (
                  <img 
                    src={getPBFileUrl(certificate, certificate.document)} 
                    alt={certificate.title} 
                    loading="lazy"
                    className="w-full h-full object-contain p-2"
                  />
                ) : isPDFFile('', certificate.document) ? (
                  <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center bg-bg-secondary">
                    <FileText size={48} className="text-neutral-400 mb-4 drop-shadow-sm" />
                    <span className="text-sm font-semibold text-text-primary uppercase tracking-wider">{certificate.document}</span>
                    <span className="text-[10px] text-text-muted mt-2 font-medium bg-surface px-2 py-1 border border-border-color rounded-md shadow-sm">PDF Document</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center bg-bg-secondary">
                    {React.createElement(getFileIcon(certificate.document), { size: 48, className: 'text-neutral-400 mb-4 drop-shadow-sm' })}
                    <span className="text-sm font-semibold text-text-primary uppercase tracking-wider">{certificate.document}</span>
                    <span className="text-[10px] text-text-muted mt-2 font-medium bg-surface px-2 py-1 border border-border-color rounded-md shadow-sm">
                      {getFileCategory(certificate.document)}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center bg-bg-secondary">
                  <FileText size={48} className="text-neutral-300 mb-4" />
                  <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">No Document Uploaded</span>
                </div>
              )}
            </div>

            {/* Toolbar under preview */}
            <div className="flex items-center gap-3 bg-surface border border-border-color/60 rounded-xl p-3 justify-between">
              <span className="text-[10px] font-medium text-text-secondary truncate">
                File handling tools
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleReplaceFile}
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isReplacing}
                  icon={<RefreshCcw size={12} />}
                >
                  Replace
                </Button>
                {certificate.document && (
                  <a 
                    href={getPBFileUrl(certificate, certificate.document)} 
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button 
                      variant="secondary" 
                      size="sm"
                      icon={<Printer size={12} />} // Download/View
                    >
                      View / Download
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Detail Display */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Metadata Card */}
            <Card className="p-6 flex flex-col gap-5">
              <SectionHeader 
                title="Credential Data" 
                description="Crypto verify keys and active metadata." 
              />

              {/* Grid Metadata values */}
              <div className="flex flex-col gap-3.5">
                {/* 1. Title */}
                <div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Document Name</span>
                  <span className="text-xs font-semibold text-text-primary mt-1 block leading-tight">{certificate.title}</span>
                </div>

                {/* 2. Issuer */}
                <div className="grid grid-cols-2 gap-4 border-t border-border-color/40 pt-3">
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Issuer Group</span>
                    <span className="text-xs font-semibold text-text-primary mt-1 block">{certificate.issuer}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Vault Category</span>
                    <Badge variant="outline" size="sm" className="mt-1">
                      {certificate.category}
                    </Badge>
                  </div>
                </div>

                {/* 3. Dates */}
                <div className="grid grid-cols-2 gap-4 border-t border-border-color/40 pt-3">
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Issue Date</span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-text-primary mt-1">
                      <Calendar size={12} className="text-text-muted" />
                      <span>{certificate.issueDate}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Expiry Date</span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-text-primary mt-1">
                      <Clock size={12} className="text-text-muted" />
                      <span>{certificate.expiryDate || 'Indefinite'}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Credential ID */}
                {certificate.credentialId && (
                  <div className="border-t border-border-color/40 pt-3">
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block">Verified Record ID</span>
                    <span className="text-xs font-mono font-bold text-text-primary mt-1 block uppercase tracking-wider">{certificate.credentialId}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Skills Card */}
            {skills && skills.length > 0 && (
              <Card className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-1.5 text-text-primary font-semibold text-xs uppercase tracking-wider">
                  <Layers size={13} />
                  <span>Verified Competencies</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" size="md">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags Card */}
            {tags && tags.length > 0 && (
              <Card className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-1.5 text-text-primary font-semibold text-xs uppercase tracking-wider">
                  <Tag size={13} />
                  <span>Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-text-secondary bg-bg-secondary px-2.5 py-1 rounded font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Notes Workspace */}
            <Card className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-text-primary font-semibold text-xs uppercase tracking-wider">
                <FileText size={13} />
                <span>Workspace Private Notes</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed bg-bg-primary/40 rounded-lg p-3 border border-border-color/40 max-h-[140px] overflow-y-auto whitespace-pre-wrap">
                {certificate.notes || 'No private notes registered for this document. Click Edit details to add studying paths, scores, or comments.'}
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSearchParams({});
        }}
        title="Edit Credential Metadata"
        size="lg"
      >
        <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Document Title"
              placeholder="e.g. AWS Cloud Practitioner"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />

            <Input
              label="Issuer Name"
              placeholder="e.g. Amazon Web Services"
              value={editIssuer}
              onChange={(e) => setEditIssuer(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dropdown
              label="Document Category"
              options={[
                { value: 'Certifications', label: 'Certifications' },
                { value: 'Awards', label: 'Awards' },
                { value: 'Internships', label: 'Internships' },
                { value: 'Archive', label: 'Archive' }
              ]}
              value={editCategory}
              onChange={(val) => setEditCategory(val)}
            />

            <Input
              label="Verified Record ID"
              placeholder="e.g. AWS-CCP-88203"
              value={editCredentialId}
              onChange={(e) => setEditCredentialId(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Issue Date"
              type="date"
              value={editIssueDate}
              onChange={(e) => setEditIssueDate(e.target.value)}
              required
              icon={<Calendar size={14} />}
            />

            <Input
              label="Expiry Date"
              type="date"
              value={editExpiryDate}
              onChange={(e) => setEditExpiryDate(e.target.value)}
              icon={<Calendar size={14} />}
            />
          </div>

          {/* Edit Tags */}
          <div className="flex flex-col gap-1.5">
            <Input
              label="Workspace Tags"
              placeholder="Press Enter or comma to insert tags (e.g. 'cloud', 'aws')"
              value={editTagsInput}
              onChange={(e) => setEditTagsInput(e.target.value)}
              onKeyDown={handleAddTag}
              icon={<Tag size={14} />}
            />
            {editTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {editTags.map((tag, idx) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    size="md" 
                    onRemove={() => setEditTags(editTags.filter((_, i) => i !== idx))}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Edit Skills */}
          <div className="flex flex-col gap-1.5">
            <Input
              label="Key Skills Verified"
              placeholder="Press Enter or comma to insert skills (e.g. 'Cloud Security', 'Networking')"
              value={editSkillsInput}
              onChange={(e) => setEditSkillsInput(e.target.value)}
              onKeyDown={handleAddSkill}
              icon={<Layers size={14} />}
            />
            {editSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {editSkills.map((skill, idx) => (
                  <Badge 
                    key={skill} 
                    variant="outline" 
                    size="md" 
                    onRemove={() => setEditSkills(editSkills.filter((_, i) => i !== idx))}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Edit Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Workspace Private Notes
            </label>
            <textarea
              className="w-full px-3.5 py-2.5 text-sm bg-surface rounded-lg border border-border-color/80 text-text-primary placeholder-text-muted/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:border-border-color min-h-[100px] max-h-[200px]"
              placeholder="Enter study path, context, private credentials or logs..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-border-color/60">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsEditOpen(false);
                setSearchParams({});
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-center">
          <div className="h-10 w-10 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center mx-auto">
            <Trash2 size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Delete Document?</h4>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-text-primary">"{certificate?.title}"</span>? This will permanently remove the credential from your workspace.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Button
              variant="secondary"
              className="flex-1"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              size="sm"
              onClick={handleDeleteConfirm}
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
