import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit3, Trash2, Calendar, ShieldCheck, Archive } from 'lucide-react';
import { Badge } from '../common/Badge';
import { isImageFile, isPDFFile } from '../../utils/fileUtils';
import { getSignedUrl } from '../../services/storageService';

export const CertificateCard = ({
  certificate,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onTagClick,
  className = ''
}) => {

  const {
    title,
    issuer,
    issueDate,
    category,
    credentialId,
    tags = [],
  } = certificate;

  const archived = category === 'Archive';

  const docFile = Array.isArray(certificate.document)
    ? certificate.document[0]
    : certificate.document;

  const thumbnailFile = Array.isArray(certificate.thumbnail)
    ? certificate.thumbnail[0]
    : certificate.thumbnail;

  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [documentUrl, setDocumentUrl] = useState(null);

  const parsedTags = (Array.isArray(tags)
    ? tags
    : JSON.parse(tags || '[]')
  ).filter((t) => !t.startsWith('_orig_cat:'));

  // 🔐 Load signed URLs (PRIVATE BUCKET SAFE)
  useEffect(() => {
    let mounted = true;

    const loadFiles = async () => {
      if (thumbnailFile) {
        const url = await getSignedUrl(thumbnailFile);
        if (mounted) setThumbnailUrl(url);
      }

      if (docFile) {
        const url = await getSignedUrl(docFile);
        if (mounted) setDocumentUrl(url);
      }
    };

    loadFiles();

    return () => {
      mounted = false;
    };
  }, [thumbnailFile, docFile]);

  const isPdf = docFile ? isPDFFile('', docFile) : false;
  const isImage = docFile ? isImageFile('', docFile) : false;

  const thumbnailSrc = thumbnailUrl || (isImage ? documentUrl : null);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.08)' }}
      className={`bg-surface border ${
        archived ? 'border-dashed border-border-color/80 opacity-80' : 'border-border-color'
      } rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group transition-all duration-300 h-full text-left ${className}`}
    >
      <div className="flex-1 flex flex-col" onClick={onView}>

        {/* IMAGE AREA */}
        <div className="relative w-full h-48 overflow-hidden bg-neutral-950 flex items-center justify-center">

          {thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full bg-neutral-950 flex items-center justify-center px-6 text-center">
              <div className="space-y-3">
                <div className="h-16 w-16 rounded-3xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white/80 text-lg font-semibold">
                  {isPdf ? 'PDF' : 'DOC'}
                </div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                  Preview unavailable
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute inset-x-0 bottom-0 p-5 space-y-3 text-white z-10">

            <div className="flex items-center justify-between gap-3">
              <Badge
                variant="outline"
                size="sm"
                className="bg-black/50 border-white/10 text-white uppercase tracking-[0.16em] text-[9px] font-semibold"
              >
                {category}
              </Badge>

              {archived ? (
                <Badge variant="secondary" size="sm" className="bg-white/10 text-white text-[8px] tracking-widest font-bold">
                  ARCHIVED
                </Badge>
              ) : (
                <ShieldCheck size={16} className="text-white/75" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-semibold tracking-tight line-clamp-2">
                {title}
              </h3>
              <p className="text-[11px] text-white/70 uppercase tracking-[0.18em] font-medium">
                {issuer}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {parsedTags.slice(0, 2).map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick && onTagClick(tag);
                  }}
                  className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full border border-white/10 text-white/85 hover:bg-white/15 transition"
                >
                  #{tag}
                </button>
              ))}

              {credentialId && (
                <span className="text-[10px] font-mono text-white/60 tracking-[0.18em]">
                  {credentialId}
                </span>
              )}
            </div>

          </div>
        </div>

        {/* META */}
        <div className="px-5 pt-5 pb-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium">
            <Calendar size={12} />
            <span>Issued {issueDate}</span>
          </div>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="px-5 py-3 border-t border-border-color/40 bg-bg-primary/20 flex items-center justify-between gap-3 group-hover:bg-bg-primary/30 transition-colors duration-300">

        <button
          onClick={onView}
          className="text-text-muted hover:text-text-primary flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors"
        >
          <Eye size={11} />
          <span>Workspace</span>
        </button>

        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onArchive(); }}>
            <Archive size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit3 size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 size={14} />
          </button>
        </div>

      </div>
    </motion.div>
  );
};