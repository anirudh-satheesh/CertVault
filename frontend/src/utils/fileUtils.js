import { 
  FileText, 
  ImageIcon, 
  FileBadge, 
  File as FileIconDefault,
  FileCode,
  FileArchive,
  FileVideo,
  FileAudio
} from 'lucide-react';
import { supabase } from '../lib/supabase';
/**
 * Extract the file extension from a filename.
 * @param {string} filename 
 * @returns {string} 
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const parts = filename.split('.');
  if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) return '';
  return parts.pop().toLowerCase();
};

/**
 * Detect if a file or mimetype is an image.
 * @param {string} mimeType 
 * @param {string} filename 
 * @returns {boolean}
 */
export const isImageFile = (mimeType, filename = '') => {
  if (mimeType && mimeType.startsWith('image/')) return true;
  const ext = getFileExtension(filename);
  return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
};

/**
 * Detect if a file or mimetype is a PDF.
 * @param {string} mimeType 
 * @param {string} filename 
 * @returns {boolean}
 */
export const isPDFFile = (mimeType, filename = '') => {
  if (mimeType === 'application/pdf') return true;
  const ext = getFileExtension(filename);
  return ext === 'pdf';
};

/**
 * Format file size in bytes to a human-readable string.
 * @param {number} bytes 
 * @param {number} decimals 
 * @returns {string}
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Get a mapped Lucide icon component based on filename or mime type.
 * @param {string} filename 
 * @param {string} mimeType 
 * @returns {import('react').ComponentType}
 */
export const getFileIcon = (filename, mimeType = '') => {
  if (isPDFFile(mimeType, filename)) return FileText;
  if (isImageFile(mimeType, filename)) return ImageIcon;
  
  const ext = getFileExtension(filename);
  switch (ext) {
    case 'docx':
    case 'doc':
      return FileBadge;
    case 'zip':
    case 'tar':
    case 'gz':
    case 'rar':
      return FileArchive;
    case 'mp4':
    case 'mov':
    case 'avi':
      return FileVideo;
    case 'mp3':
    case 'wav':
    case 'ogg':
      return FileAudio;
    case 'json':
    case 'js':
    case 'html':
    case 'css':
      return FileCode;
    default:
      return FileIconDefault;
  }
};

/**
 * Get a human-readable file category/type.
 * @param {string} filename 
 * @param {string} mimeType 
 * @returns {string}
 */
export const getFileCategory = (filename, mimeType = '') => {
  if (isPDFFile(mimeType, filename)) return 'PDF Document';
  if (isImageFile(mimeType, filename)) return 'Image File';
  const ext = getFileExtension(filename);
  return ext ? `${ext.toUpperCase()} File` : 'Unknown File';
};

/**
 * Helper to get preview URL for Supabase file
 * @param {object} record Supabase record
 * @param {string} filename The filename stored in Supabase
 * @returns {string}
 */

export const getSupabaseFileUrl = (bucket, filePath) => {
  if (!bucket || !filePath) return null;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Compatibility helper: used by CertificateDetails.jsx.
 * Generates a public URL for a certificate document stored in Supabase storage.
 *
 * Expected record shape (from existing code):
 * - record.file_path or record.document_path holds the storage path
 * - record.thumbnail_path might exist for thumbs (not used here)
 *
 * Fallback behavior:
 * - If `filePath` argument looks like a full path, use it.
 * - If it's a filename, try `${record.id}/${filePath}`.
 */
export const getPBFileUrl = (record, filePathOrName) => {
  if (!record || !filePathOrName) return null;

  // Determine storage bucket (commonly 'certificates'/'documents' etc.).
  // If your project uses a different bucket, update this constant.
  const bucket = 'certificates';

  const directPath = record.file_path || record.document_path || record.path || null;

  // If we already have a full path on the record, prefer it.
  if (directPath) return getSupabaseFileUrl(bucket, directPath);

  // Otherwise, build path from record.id.
  const builtPath = filePathOrName.includes('/')
    ? filePathOrName
    : `${record.id}/${filePathOrName}`;

  return getSupabaseFileUrl(bucket, builtPath);
};
