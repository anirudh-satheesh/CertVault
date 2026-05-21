import pb from '../lib/pocketbase';

/**
 * Fetch all certificates belonging to the authenticated owner from PocketBase.
 * @param {object} options Optional query parameters (filter, sort, expand).
 * @returns {Promise<Array>} List of certificate records.
 */
export const getCertificates = async (options = {}) => {
    try {
    const list = await pb.collection('certificates').getFullList({
      sort: '-created',
      ...options
    });
    // Debug: log fetched certificates summary in dev
    if (process.env.NODE_ENV !== 'production') {
      try { console.debug('getCertificates -> fetched count', list.length, list.slice(0,3).map(l=>({id:l.id, thumbnail:l.thumbnail, document:l.document}))); } catch(e){}
    }
    return list;
    } catch (error) {
        console.error('Failed to fetch certificates:', error);
        throw error;
    }
};

/**
 * Fetch a single certificate record by ID.
 * @param {string} id Unique certificate record ID.
 * @returns {Promise<object>} Certificate record.
 */
export const getCertificate = async (id) => {
    try {
        return await pb.collection('certificates').getOne(id);
    } catch (error) {
        console.error(`Failed to fetch certificate with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new certificate record.
 * Handles file attachments automatically if data is passed as FormData.
 * @param {object|FormData} data Certificate metadata and file payload.
 * @param {object} options Optional PocketBase request options (e.g. signal for cancellation)
 * @returns {Promise<object>} Created certificate record.
 */
export const createCertificate = async (data, options = {}) => {
  console.log('Creating certificate...', data);
  try {
    const owner = pb.authStore.model;
    let payload = data;
    if (data instanceof FormData) {
      if (owner && !data.has('owner')) {
        data.append('owner', owner.id);
      }
    } else {
      payload = {
        ...data,
        owner: owner ? owner.id : undefined
      };
    }
    return await pb.collection('certificates').create(payload, options);
  } catch (error) {
    console.error('Failed to create certificate:', error);
    throw error;
  }
};

/**
 * Update an existing certificate record by ID.
 * Handles file updates automatically if data is passed as FormData.
 * @param {string} id Unique certificate record ID.
 * @param {object|FormData} data Updated certificate payload.
 * @returns {Promise<object>} Updated certificate record.
 */
export const updateCertificate = async (id, data) => {
    try {
        return await pb.collection('certificates').update(id, data);
    } catch (error) {
        console.error(`Failed to update certificate with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a certificate record by ID.
 * @param {string} id Unique certificate record ID.
 * @returns {Promise<boolean>} Deletion success.
 */
export const deleteCertificate = async (id) => {
    try {
        return await pb.collection('certificates').delete(id);
    } catch (error) {
        console.error(`Failed to delete certificate with ID ${id}:`, error);
        throw error;
    }
};
