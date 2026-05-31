import { supabase } from '../lib/supabase';

/**
 * Upload file to private bucket
 */
export const uploadFile = async (path, file) => {
  const { error } = await supabase.storage
    .from('certificates')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return path;
};

/**
 * Get temporary signed URL (PRIVATE BUCKET SAFE)
 */
export const getSignedUrl = async (path) => {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from('certificates')
    .createSignedUrl(path, 60 * 60); // 1 hour

  if (error) {
    console.error('Signed URL error:', error);
    return null;
  }

  return data.signedUrl;
};