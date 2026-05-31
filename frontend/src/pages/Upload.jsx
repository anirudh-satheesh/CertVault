import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

import { supabase } from '../lib/supabase';

import { useCertStore } from '../stores/useCertStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Dropdown } from '../components/common/Dropdown';
import { Card } from '../components/common/Card';
import { SectionHeader } from '../components/common/SectionHeader';
import { Badge } from '../components/common/Badge';

import {
  isImageFile,
  isPDFFile,
  formatFileSize,
  getFileIcon,
  getFileCategory
} from '../utils/fileUtils';

import { uploadFile } from '../services/storageService';
import { createCertificate, updateCertificate } from '../services/certificateService';

// Validation
export const allowedFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];
export const maxFileSizeMB = 10;

export const validateFile = (file) => {
  if (!allowedFileTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type. PDF or PNG/JPEG only.' };
  }
  if (file.size > maxFileSizeMB * 1024 * 1024) {
    return { valid: false, error: `File exceeds ${maxFileSizeMB} MB limit.` };
  }
  return { valid: true };
};

export const Upload = () => {
  const navigate = useNavigate();
  const addCertificate = useCertStore((state) => state.addCertificate);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [category, setCategory] = useState('Certifications');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [tags, setTags] = useState([]);
  const [skills, setSkills] = useState([]);
  const [notes, setNotes] = useState('');

  const [tagInput, setTagInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');

  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);

  const categoryOptions = [
    { value: 'Certifications', label: 'Certifications' },
    { value: 'Awards', label: 'Awards' },
    { value: 'Internships', label: 'Internships' },
    { value: 'Licenses', label: 'Licenses' },
    { value: 'Archive', label: 'Archive' }
  ];

  // cleanup
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    };
  }, [previewUrl, thumbnailPreviewUrl]);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validation = validateFile(selected);
    if (!validation.valid) {
      setFormErrors(prev => ({ ...prev, file: validation.error }));
      return;
    }

    setFile({
      file: selected,
      name: selected.name,
      size: formatFileSize(selected.size),
      type: selected.type
    });

    setPreviewUrl(URL.createObjectURL(selected));
    setUploadProgress(100);
    setUploadComplete(true);

    const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    setTitle(cleanName);
  };

  const handleThumbnailSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setThumbnail({
      file: selected,
      name: selected.name
    });

    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setThumbnailPreviewUrl(URL.createObjectURL(selected));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !tags.includes(val)) setTags([...tags, val]);
      setTagInput('');
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillsInput.trim();
      if (val && !skills.includes(val)) setSkills([...skills, val]);
      setSkillsInput('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!title) errors.title = 'Title required';
    if (!issuer) errors.issuer = 'Issuer required';
    if (!issueDate) errors.issueDate = 'Issue date required';
    if (!file) errors.file = 'File required';
    if (!thumbnail) errors.thumbnail = 'Thumbnail required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!file?.file) return;

    setIsUploading(true);

    try {
      // 1. Create DB record first (metadata only)
      const newCert = await createCertificate({
        title,
        issuer,
        category,
        issueDate,
        expiryDate: expiryDate || null,
        credentialId: credentialId || null,
        tags,
        skills,
        notes,
        file_name: file.file.name,
        file_type: file.file.type,
        file_size: file.file.size
      });

      // 2. Upload main file
      const filePath = `${newCert.id}/${file.file.name}`;
      await uploadFile(filePath, file.file);

      // 3. Upload thumbnail (optional)
      let thumbnailPath = null;

      if (thumbnail?.file) {
        thumbnailPath = `${newCert.id}/thumb_${thumbnail.file.name}`;
        await uploadFile(thumbnailPath, thumbnail.file);
      }

      // 4. Update DB with storage paths
      const updatedCert = await updateCertificate(newCert.id, {
        file_path: filePath,
        thumbnail_path: thumbnailPath
      });

      // 5. Update local store
      addCertificate(updatedCert);

      // 6. Finish UI flow
      setTimeout(() => {
        setIsUploading(false);
        navigate('/dashboard');
      }, 500);

    } catch (err) {
      console.error('Upload failed:', err);
      setFormErrors({ submit: 'Upload failed. Try again.' });
      setIsUploading(false);
    }
  };

  return (
    <motion.div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-sm font-bold">Upload Document</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT */}
        <div>
          <SectionHeader title="Upload File" />

          {!file ? (
            <div
              className="border-dashed border p-10 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileSelect}
              />
              <UploadCloud />
              <p>Click or drop file</p>
            </div>
          ) : (
            <Card className="p-4">
              <FileText />
              <p>{file.name}</p>
              <p>{file.size}</p>
              <button onClick={() => setFile(null)}>
                <Trash2 />
              </button>
            </Card>
          )}

          <input type="file" onChange={handleThumbnailSelect} />
        </div>

        {/* RIGHT */}
        <div>
          {!uploadComplete ? (
            <p>Upload file first</p>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <Input value={title} onChange={e => setTitle(e.target.value)} />
              <Input value={issuer} onChange={e => setIssuer(e.target.value)} />
              <Dropdown
                value={category}
                onChange={setCategory}
                options={categoryOptions}
              />
              <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />

              <Button type="submit" disabled={isUploading}>
                Save
              </Button>
            </form>
          )}
        </div>

      </div>
    </motion.div>
  );
};