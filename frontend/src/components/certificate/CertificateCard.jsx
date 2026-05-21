import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit3, Trash2, Calendar, ShieldCheck, Archive } from 'lucide-react';
import { Badge } from '../common/Badge';
import { isImageFile, isPDFFile, getPBFileUrl } from '../../utils/fileUtils';

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
    thumbnailColor = 'bg-neutral-900 text-neutral-100'
  } = certificate;

  const archived = category === 'Archive';

  const documentUrl = useMemo(() => {
    const docFile = certificate.document
      ? Array.isArray(certificate.document)
        ? certificate.document[0]
        : certificate.document
      : null;
    return docFile ? getPBFileUrl(certificate, docFile) : null;
  }, [certificate]);

  const isPdf = certificate.document && isPDFFile('', certificate.document);
  const isImage = certificate.document && isImageFile('', certificate.document);
  const parsedTags = (Array.isArray(tags)
    ? tags
    : JSON.parse(tags || '[]')).filter((t) => !t.startsWith('_orig_cat:'));

  const thumbnailFile = certificate.thumbnail
    ? Array.isArray(certificate.thumbnail)
      ? certificate.thumbnail[0]
      : certificate.thumbnail
    : null;
  const thumbnailUrl = thumbnailFile ? getPBFileUrl(certificate, thumbnailFile) : null;
  const thumbnailSrc = thumbnailUrl || (isImage ? documentUrl : null);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.08)' }}
      className={`bg-surface border ${
        archived ? 'border-dashed border-border-color/80 opacity-80' : 'border-border-color'
      } rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group transition-all duration-300 h-full text-left ${className}`}
    >
      <div className="flex-1 flex flex-col" onClick={onView}>
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-950">
          {thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
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

        <div className="px-5 pt-5 pb-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium">
            <Calendar size={12} />
            <span>Issued {issueDate}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-border-color/40 bg-bg-primary/20 flex items-center justify-between gap-3 group-hover:bg-bg-primary/30 transition-colors duration-300">
        <button
          onClick={onView}
          className="text-text-muted hover:text-text-primary flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors"
        >
          <Eye size={11} />
          <span>Workspace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive();
            }}
            title={archived ? 'Restore Document' : 'Archive Document'}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all"
          >
            <Archive size={14} className={archived ? 'text-neutral-950 fill-neutral-950/10' : ''} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit Details"
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete Document"
            className="p-2 rounded-xl text-text-muted hover:text-neutral-950 hover:bg-neutral-200 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
