import { supabase } from './supabase';

export const getCertificates = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch certificates:', error);
    throw error;
  }

  return data || [];
};

export const createCertificate = async (certificateData) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('certificates')
    .insert([
      {
        ...certificateData,
        user_id: user.id
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Failed to create certificate:', error);
    throw error;
  }

  return data;
};

export const deleteCertificate = async (id) => {
  const { error } = await supabase
    .from('certificates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete certificate:', error);
    throw error;
  }
};

export const updateCertificate = async (id, updates) => {
  const { data, error } = await supabase
    .from('certificates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update certificate:', error);
    throw error;
  }

  return data;
};