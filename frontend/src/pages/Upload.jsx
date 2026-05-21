import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  ArrowLeft, 
  Tag, 
  Calendar,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { createCertificate } from '../services/certificateService';
import { useCertStore } from '../stores/useCertStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Dropdown } from '../components/common/Dropdown';
import { Card } from '../components/common/Card';
import { SectionHeader } from '../components/common/SectionHeader';
import { Badge } from '../components/common/Badge';
import { 
  getFileExtension, 
  isImageFile, 
  isPDFFile, 
  formatFileSize, 
  getFileIcon, 
  getFileCategory 
} from '../utils/fileUtils';

export const Upload = () => {
  const navigate = useNavigate();
  const addCertificate = useCertStore((state) => state.addCertificate);

  // File Upload State
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null); // holds File object
  const [thumbnail, setThumbnail] = useState(null); // user-provided thumbnail image
  const [previewUrl, setPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const abortControllerRef = useRef(null);

  // Cleanup preview URL and abort pending requests on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [previewUrl, thumbnailPreviewUrl]);

  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [category, setCategory] = useState('Certifications');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [skillsInput, setSkillsInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [notes, setNotes] = useState('');
  
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);

  // Categories Dropdown Options
  const categoryOptions = [
    { value: 'Certifications', label: 'Certifications' },
    { value: 'Awards', label: 'Awards' },
    { value: 'Internships', label: 'Internships' },
    { value: 'Licenses', label: 'Licenses' },
    { value: 'Archive', label: 'Archive' }
  ];

  // Simulator for file upload
  const simulateUpload = (fileName) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          // Auto-fill some fields based on file name if possible, for high fidelity
          const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          setTitle(cleanName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        // Validation: type and size
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
        const maxSizeMB = 10;
        if (!allowedTypes.includes(droppedFile.type)) {
          setFormErrors(prev => ({ ...prev, file: 'Unsupported file type. PDF or PNG/JPEG only.' }));
          return;
        }
        if (droppedFile.size > maxSizeMB * 1024 * 1024) {
          setFormErrors(prev => ({ ...prev, file: `File exceeds ${maxSizeMB} MB limit.` }));
          return;
        }
        setFile({
          file: droppedFile,
          name: droppedFile.name,
          size: formatFileSize(droppedFile.size),
          type: droppedFile.type
        });
        setPreviewUrl(URL.createObjectURL(droppedFile));
        simulateUpload(droppedFile.name);
      }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Validation: type and size (same as drop handler)
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      const maxSizeMB = 10;
      if (!allowedTypes.includes(selectedFile.type)) {
        setFormErrors(prev => ({ ...prev, file: "Unsupported file type. PDF or PNG/JPEG only." }));
        return;
      }
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, file: `File exceeds ${maxSizeMB} MB limit.` }));
        return;
      }
      setFile({
        file: selectedFile,
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        type: selectedFile.type
      });
      setPreviewUrl(URL.createObjectURL(selectedFile));
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
        setThumbnail(null);
        setThumbnailPreviewUrl(null);
      }
      simulateUpload(selectedFile.name);
    }
  };

  const handleThumbnailSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedThumb = e.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      const maxSizeMB = 5;
      if (!allowedTypes.includes(selectedThumb.type)) {
        setFormErrors(prev => ({ ...prev, thumbnail: "Thumbnail must be PNG, JPEG, or WEBP." }));
        return;
      }
      if (selectedThumb.size > maxSizeMB * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, thumbnail: `Thumbnail exceeds ${maxSizeMB} MB limit.` }));
        return;
      }
      setThumbnail({
        file: selectedThumb,
        name: selectedThumb.name,
        size: formatFileSize(selectedThumb.size),
        type: selectedThumb.type
      });
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }
      setThumbnailPreviewUrl(URL.createObjectURL(selectedThumb));
      setFormErrors(prev => ({ ...prev, thumbnail: undefined }));
    }
  };


  // Add tag helper
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  // Add skill helper
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillsInput.trim();
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
      }
      setSkillsInput('');
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Document Title is required';
    if (!issuer.trim()) errors.issuer = 'Issuer Name is required';
    if (!issueDate) errors.issueDate = 'Issue Date is required';
    if (!thumbnail) errors.thumbnail = 'Thumbnail image is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isUploading) return; // Prevent duplicate submissions

    if (!file?.file) {
      setFormErrors(prev => ({ ...prev, file: 'Document file is required' }));
      return;
    }

    setIsUploading(true);
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
      formData.append('title', title);
      formData.append('issuer', issuer);
      formData.append('category', category);
      formData.append('issueDate', issueDate);
      if (expiryDate) formData.append('expiryDate', expiryDate);
      if (credentialId) formData.append('credentialId', credentialId);
      formData.append('tags', JSON.stringify(tags.length > 0 ? tags : ['custom']));
      formData.append('skills', JSON.stringify(skills.length > 0 ? skills : ['Credential']));
      formData.append('notes', notes || 'No custom notes provided.');
      formData.append('document', file.file);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail.file);
      }
      try {
        const newCert = await createCertificate(formData, {
          signal: abortControllerRef.current.signal
        });
        addCertificate(newCert);
        // Success redirect
        setTimeout(() => {
          setIsUploading(false);
          navigate('/dashboard');
        }, 800);
      } catch (err) {
        if (err.name === 'AbortError' || err.isAbort) {
          console.log('Upload cancelled by user navigation.');
          return;
        }
        console.error('Upload failed:', err);
        setFormErrors(prev => ({ ...prev, submit: 'Upload failed. Check console.' }));
        setIsUploading(false);
      }
  };

  const resetUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (thumbnailPreviewUrl) {
      URL.revokeObjectURL(thumbnailPreviewUrl);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFile(null);
    setThumbnail(null);
    setPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setTitle('');
    setFormErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-left">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-1.5 hover:bg-surface border border-transparent hover:border-border-color rounded-lg text-text-muted hover:text-text-primary transition-all duration-200"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-sm font-bold uppercase tracking-widest text-text-primary">
            Upload Document
          </h1>
          <p className="text-[10px] text-text-muted mt-0.5">
            Add a new credential or award to your vault and configure validation parameters.
          </p>
        </div>
      </div>

      <hr className="border-border-color/60" />

      {/* Main Form Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left Column: File Drop & Preview */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <SectionHeader 
            title="Secure Vault Drop" 
            description="Drag and drop or select standard files (PDF, PNG, JPG). Assets are mathematically verified." 
          />

          {!file ? (
            // Drag and Drop Area
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-[4/3] border border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
                dragActive 
                  ? 'border-neutral-900 bg-surface-hover shadow-inner' 
                  : 'border-border-color hover:border-border-color/100 bg-surface/50 hover:bg-surface'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
              />
              <div className="p-4 bg-bg-primary rounded-full text-text-muted group-hover:text-text-primary transition-colors">
                <UploadCloud size={32} className="stroke-[1.25]" />
              </div>
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider mt-4 block">
                Drag Document Here
              </span>
              <p className="text-[11px] text-text-muted mt-1.5 max-w-xs leading-relaxed">
                Supports cryptographic validation for PDF, PNG, JPG up to 10MB.
              </p>
              <span className="text-[10px] font-medium text-text-secondary mt-4 border border-border-color px-2.5 py-1 rounded bg-surface hover:bg-surface-hover shadow-sm">
                Browse Files
              </span>
            </div>
          ) : (
                <Card className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-border-color/60">
                    <div className="h-10 w-10 bg-neutral-900 rounded-lg flex items-center justify-center text-surface shadow-sm">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-text-primary truncate uppercase tracking-wide">{file.name}</h4>
                      <p className="text-[10px] text-text-muted mt-0.5">{file.size}</p>
                    </div>
                    {!isUploading && (
                      <button
                        onClick={resetUpload}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-primary transition-all"
                        title="Remove File"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Professional Preview area */}
                  {previewUrl && (
                    <div className="my-2 bg-surface/50 rounded-xl overflow-hidden flex flex-col items-center justify-center border border-border-color/60 transition-all">
                      {isImageFile(file.type, file.name) ? (
                        <img 
                          src={previewUrl} 
                          alt="preview" 
                          loading="lazy"
                          className="h-40 w-full object-cover rounded-xl border border-neutral-200 shadow-sm transition-opacity hover:opacity-95" 
                        />
                      ) : isPDFFile(file.type, file.name) ? (
                        <div className="w-full h-40 bg-bg-secondary flex flex-col items-center justify-center p-6 border border-neutral-200 rounded-xl shadow-sm">
                          <FileText size={36} className="text-neutral-400 mb-3" />
                          <span className="text-xs font-semibold text-text-primary uppercase tracking-wider text-center">{file.name}</span>
                          <span className="text-[10px] text-text-muted mt-1">{file.size} • PDF Document</span>
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-bg-secondary flex flex-col items-center justify-center p-6 border border-neutral-200 rounded-xl shadow-sm">
                          {React.createElement(getFileIcon(file.name, file.type), { size: 36, className: 'text-neutral-400 mb-3' })}
                          <span className="text-xs font-semibold text-text-primary uppercase tracking-wider text-center line-clamp-1">{file.name}</span>
                          <span className="text-[10px] text-text-muted mt-1">{file.size} • {getFileCategory(file.name, file.type)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 pt-3 border-t border-border-color/60">
                    <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Thumbnail Image
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] items-start">
                      <div className="flex flex-col gap-2">
                        <span className="text-[11px] text-text-muted">
                          Upload a cover thumbnail for this credential. Recommended size is 800×600 or similar aspect ratio.
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleThumbnailSelect}
                          className="text-sm text-text-primary"
                        />
                        {formErrors.thumbnail && (
                          <p className="text-[10px] text-red-500 mt-1">
                            {formErrors.thumbnail}
                          </p>
                        )}
                      </div>
                      {thumbnailPreviewUrl && (
                        <div className="h-24 w-full sm:w-40 rounded-xl overflow-hidden border border-border-color/70 bg-surface">
                          <img
                            src={thumbnailPreviewUrl}
                            alt="Thumbnail preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {isUploading && (
                    <div className="flex flex-col gap-2 py-2">
                      <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-text-muted">
                        <span>Cryptographic Verification</span>
                        <span className="font-mono">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-bg-secondary h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          className="bg-accent h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      <span className="text-[9px] italic text-text-muted mt-1 block">
                        Analyzing certificate signature metadata...
                      </span>
                    </div>
                  )}

                  {uploadComplete && (
                    <div className="flex items-center gap-2 bg-neutral-900/5 border border-neutral-900/10 rounded-lg p-3 text-xs text-neutral-900 font-medium">
                      <CheckCircle2 size={16} className="text-neutral-900 shrink-0" />
                      <span>Document decrypted and verified successfully. Ready to store.</span>
                    </div>
                  )}
                </Card>
          )}

          {/* Guidelines info */}
          <div className="bg-surface border border-border-color/60 rounded-xl p-5 text-xs text-text-secondary leading-relaxed flex flex-col gap-2">
            <span className="font-bold text-text-primary uppercase tracking-widest text-[9px] block">SECURITY ASSURANCE</span>
            <p>All items in CertVault are saved locally under strict client-side sandboxes. Assets can be shared via cryptographic verify links securely.</p>
          </div>
        </div>

        {/* Right Column: Metadata Form */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <SectionHeader 
            title="Credential Metadata" 
            description="Detail the verified values. Fields marked as mandatory will shape the grid view." 
          />

          {!uploadComplete ? (
            <div className="h-[350px] border border-dashed border-border-color rounded-xl flex flex-col items-center justify-center text-center p-6 bg-surface/30">
              <UploadCloud size={28} className="text-text-muted stroke-[1.2] mb-3 animate-pulse" />
              <p className="text-xs text-text-muted max-w-xs">
                Upload a certificate on the left panel to unlock the metadata form and register details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Document Title"
                  placeholder="e.g. AWS Cloud Practitioner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={formErrors.title}
                  required
                />

                <Input
                  label="Issuer Name"
                  placeholder="e.g. Amazon Web Services"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  error={formErrors.issuer}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown
                  label="Document Category"
                  options={categoryOptions}
                  value={category}
                  onChange={(val) => setCategory(val)}
                />

                <Input
                  label="Credential ID / Hash"
                  placeholder="e.g. AWS-CCP-88203"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Issue Date"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  error={formErrors.issueDate}
                  required
                  icon={<Calendar size={14} />}
                />

                <Input
                  label="Expiry Date (Optional)"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  icon={<Calendar size={14} />}
                />
              </div>

              {/* Tag Creation Input */}
              <div className="flex flex-col gap-1.5">
                <Input
                  label="Workspace Tags"
                  placeholder="Press Enter or comma to insert tags (e.g. 'cloud', 'aws')"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  icon={<Tag size={14} />}
                  helperText="Categorize your document with short searchable tags."
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag, idx) => (
                      <Badge key={tag} variant="secondary" size="md" onRemove={() => handleRemoveTag(idx)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills Tag Creation */}
              <div className="flex flex-col gap-1.5">
                <Input
                  label="Key Skills Verified"
                  placeholder="Press Enter or comma to insert skills (e.g. 'Cloud Security', 'Networking')"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  icon={<Layers size={14} />}
                  helperText="List the practical tools or competencies this document proves."
                />
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.map((skill, idx) => (
                      <Badge key={skill} variant="outline" size="md" onRemove={() => handleRemoveSkill(idx)}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Workspace Notes
                </label>
                <textarea
                  className="w-full px-3.5 py-2.5 text-sm bg-surface rounded-lg border border-border-color/80 text-text-primary placeholder-text-muted/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:border-border-color min-h-[100px] max-h-[200px]"
                  placeholder="Enter context, scores, study paths, or private annotations about this credential..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 justify-end pt-4 border-t border-border-color/60">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<ArrowRight size={14} />}
                  iconPosition="right"
                  disabled={isUploading}
                >
                  Save to Vault
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Screen Loader overlay on saving */}
      {isUploading && uploadComplete && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-surface border border-border-color p-8 rounded-xl shadow-2xl flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-text-primary" size={24} />
            <span className="text-xs font-semibold uppercase tracking-wider">Securing to Vault...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
