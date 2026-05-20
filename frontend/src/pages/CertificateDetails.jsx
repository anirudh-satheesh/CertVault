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
  Share2,
  Copy,
  Check,
  Award
} from 'lucide-react';
import { useCertStore } from '../stores/useCertStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Dropdown } from '../components/common/Dropdown';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

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

            {/* Virtual Document Render (CSS Designed Certificate) */}
            <div className="w-full aspect-[16/11] bg-white border border-neutral-300 shadow-lg rounded-xl relative p-8 md:p-12 overflow-hidden flex flex-col justify-between select-none">
              {/* Ornamental Frame Lines */}
              <div className="absolute inset-4 border border-neutral-200 pointer-events-none" />
              <div className="absolute inset-5 border-2 border-neutral-300 pointer-events-none" />
              
              {/* Ornamental Corner Decor */}
              <div className="absolute top-6 left-6 h-6 w-6 border-t-2 border-l-2 border-neutral-500 pointer-events-none" />
              <div className="absolute top-6 right-6 h-6 w-6 border-t-2 border-r-2 border-neutral-500 pointer-events-none" />
              <div className="absolute bottom-6 left-6 h-6 w-6 border-b-2 border-l-2 border-neutral-500 pointer-events-none" />
              <div className="absolute bottom-6 right-6 h-6 w-6 border-b-2 border-r-2 border-neutral-500 pointer-events-none" />

              {/* Watermark (Large background CV initials) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-100 font-extrabold text-[120px] md:text-[180px] pointer-events-none z-0 tracking-widest opacity-40 font-sans">
                VAULT
              </div>

              {/* Document Header */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                  <div className={`h-10 w-10 ${certificate.thumbnailColor || 'bg-neutral-900 text-neutral-100'} rounded-lg flex items-center justify-center font-bold text-xs shadow-sm`}>
                    {getInitials(certificate.issuer)}
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">VERIFIED CREDENTIAL</span>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 line-clamp-1">{certificate.issuer}</h4>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 bg-neutral-900 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm border border-neutral-800">
                    <ShieldCheck size={8} />
                    <span>AES-SECURED</span>
                  </div>
                  {certificate.credentialId && (
                    <p className="text-[8px] font-mono text-neutral-500 mt-1 block uppercase tracking-wider">
                      REF: {certificate.credentialId}
                    </p>
                  )}
                </div>
              </div>

              {/* Document Title / Achievement core */}
              <div className="my-auto py-4 text-center z-10 flex flex-col items-center gap-2 md:gap-3">
                <span className="text-[9px] md:text-[10px] font-medium tracking-[0.25em] uppercase text-neutral-400">
                  THIS CERTIFIES AND OFFICIALLY RECOGNIZES THAT
                </span>
                
                {/* Holder Name */}
                <h3 className="text-lg md:text-xl font-bold text-neutral-900 tracking-wide underline decoration-neutral-300 underline-offset-4">
                  Anirudh Dev
                </h3>

                <span className="text-[8px] md:text-[9px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
                  HAS SUCCESSFULLY DEMONSTRATED PROFICIENCY AND MET REQUIREMENTS FOR
                </span>

                {/* Certificate Title */}
                <h2 className="text-sm md:text-base font-bold text-neutral-900 px-6 max-w-lg uppercase tracking-wide leading-tight">
                  {certificate.title}
                </h2>
              </div>

              {/* Document Footer (Signatures & Verification Code) */}
              <div className="flex justify-between items-end border-t border-neutral-100 pt-4 z-10">
                <div className="text-left">
                  <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-semibold block">DATE OF ISSUE</span>
                  <span className="text-[9px] font-bold text-neutral-800 uppercase font-mono">{certificate.issueDate}</span>
                  {certificate.expiryDate && (
                    <span className="text-[8px] text-neutral-400 block mt-0.5 uppercase tracking-wide">
                      Expires: <span className="font-mono font-bold text-neutral-700">{certificate.expiryDate}</span>
                    </span>
                  )}
                </div>

                {/* Cryptographic QR/Seal representation */}
                <div className="flex flex-col items-center justify-center">
                  <div className="h-10 w-10 border border-neutral-300 rounded p-0.5 flex flex-col justify-between items-center bg-white shadow-inner">
                    {/* Mock matrix code (Notion style barcode block) */}
                    <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`rounded-[1px] ${
                            (i * 3 + 1) % 4 === 0 || i % 3 === 0 
                              ? 'bg-neutral-800' 
                              : 'bg-neutral-100'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[7px] text-neutral-400 font-mono mt-1 tracking-widest font-semibold uppercase">CRYPT-STAMP</span>
                </div>

                <div className="text-right">
                  <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-semibold block">VAULT SIGNATURE</span>
                  <span className="text-[10px] font-serif italic text-neutral-800 tracking-wider block">CertVault Verified</span>
                  <div className="h-0.5 w-24 bg-neutral-300 mt-1" />
                </div>
              </div>
            </div>

            {/* Toolbar under preview */}
            <div className="flex items-center gap-3 bg-surface border border-border-color/60 rounded-xl p-3 justify-between">
              <span className="text-[10px] font-medium text-text-secondary">
                Standard document render frame. Ready for print.
              </span>
              <div className="flex items-center gap-1.5">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.print()}
                  icon={<Printer size={12} />}
                >
                  Print PDF
                </Button>
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
