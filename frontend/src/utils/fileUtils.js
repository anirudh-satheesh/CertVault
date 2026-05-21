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
import pb from '../lib/pocketbase';

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
 * Helper to get preview URL for PocketBase file
 * @param {object} record PocketBase record
 * @param {string} filename The filename stored in PocketBase
 * @returns {string}
 */
export const getPBFileUrl = (record, filename) => {
  if (!record || !filename) return null;
  return pb.files.getURL(record, filename);
};
