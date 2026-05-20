import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit3, Trash2, Calendar, ShieldCheck, ExternalLink } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CertificateCard = ({
  certificate,
  onView,
  onEdit,
  onDelete,
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

  // Extract initials for mock logo
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)' }}
      className={`bg-surface border border-border-color rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group transition-all duration-300 h-full text-left ${className}`}
    >
      <div className="p-5 flex-1 flex flex-col" onClick={onView}>
        {/* Document Thumbnail Area - Apple Files/Notion style */}
        <div className="w-full aspect-[4/3] bg-bg-secondary rounded-lg flex flex-col justify-between p-4 mb-4 relative overflow-hidden border border-border-color/30 group-hover:border-border-color transition-colors duration-300">
          <div className="flex justify-between items-start">
            <Badge variant="outline" size="sm" className="bg-surface/85 backdrop-blur-[2px] border-border-color/60 text-text-primary">
              {category}
            </Badge>
            <ShieldCheck size={16} className="text-text-muted/80" />
          </div>
          
          {/* Logo Badge */}
          <div className="self-center flex flex-col items-center justify-center gap-1.5 my-2">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center font-bold tracking-wider text-sm shadow-sm ${thumbnailColor}`}>
              {getInitials(issuer)}
            </div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">{issuer}</span>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-wrap gap-1 max-w-[80%]">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[9px] bg-surface/75 px-1.5 py-0.5 rounded text-text-secondary border border-border-color/30 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
            {credentialId && (
              <span className="text-[9px] font-mono text-text-muted/80">
                {credentialId}
              </span>
            )}
          </div>
        </div>

        {/* Text Metadata */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="text-sm font-semibold text-text-primary group-hover:text-black line-clamp-1 leading-tight hover:underline cursor-pointer"
            >
              {title}
            </h3>
            <p className="text-xs text-text-secondary mt-1">{issuer}</p>
          </div>
          
          <div className="flex items-center gap-1.5 text-text-muted text-[11px] mt-3">
            <Calendar size={12} />
            <span>Issued {issueDate}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3 border-t border-border-color/40 bg-bg-primary/20 flex items-center justify-between group-hover:bg-bg-primary/30 transition-colors duration-300">
        <button
          onClick={onView}
          className="text-text-muted hover:text-text-primary flex items-center gap-1 text-[11px] font-medium transition-colors"
        >
          <Eye size={12} />
          <span>Workspace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit Details"
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all"
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete Document"
            className="p-1 rounded text-text-muted hover:text-neutral-950 hover:bg-neutral-200 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
