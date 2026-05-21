import { create } from 'zustand';
import {
  getCertificates,
  createCertificate,
  updateCertificate as pbUpdateCertificate,
  deleteCertificate as pbDeleteCertificate
} from '../services/certificateService';

// Safe JSON parser that always returns an array
const safeParseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const useCertStore = create((set, get) => ({
  certificates: [],
  isLoading: false,
  error: null,
  selectedCertId: null,
  categoryFilter: 'all', // 'all', 'Certifications', 'Awards', 'Internships', 'Licenses', 'Archived'
  searchQuery: '',
  sortOrder: 'newest', // 'newest', 'oldest', 'title-asc', 'issuer-asc'

  // Actions
  fetchCertificates: async () => {
    set({ isLoading: true, error: null });
    try {
      let list = await getCertificates();
      set({ certificates: list, isLoading: false });
    } catch (err) {
      console.error('Failed to sync certificates:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  addCertificate: async (certData) => {
    set((state) => ({
      certificates: [certData, ...state.certificates],
      isLoading: false
    }));
    return certData;
  },

  updateCertificate: async (id, updatedFields) => {
    set({ isLoading: true, error: null });
    try {
      // Handle _orig_cat tag consistency when category changes
      const cert = get().certificates.find(c => c.id === id);
      if (cert && updatedFields.category && updatedFields.category !== cert.category) {
        const currentTags = safeParseArray(updatedFields.tags !== undefined ? updatedFields.tags : cert.tags);

        if (updatedFields.category === 'Archive' && cert.category !== 'Archive') {
          // Moving to Archive: save original category
          const tagsWithoutOrigCat = currentTags.filter(t => !t.startsWith('_orig_cat:'));
          updatedFields.tags = JSON.stringify([...tagsWithoutOrigCat, `_orig_cat:${cert.category}`]);
        } else if (cert.category === 'Archive' && updatedFields.category !== 'Archive') {
          // Moving out of Archive: remove _orig_cat tag
          updatedFields.tags = JSON.stringify(currentTags.filter(t => !t.startsWith('_orig_cat:')));
        }
      }

      const updated = await pbUpdateCertificate(id, updatedFields);
      set((state) => ({
        certificates: state.certificates.map((cert) =>
          cert.id === id ? updated : cert
        ),
        isLoading: false
      }));
      return updated;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteCertificate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await pbDeleteCertificate(id);
      set((state) => ({
        certificates: state.certificates.filter((cert) => cert.id !== id),
        selectedCertId: state.selectedCertId === id ? null : state.selectedCertId,
        isLoading: false
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  toggleArchiveCertificate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const cert = get().certificates.find(c => c.id === id);
      if (!cert) throw new Error('Certificate not found');
      
      const isCurrentlyArchived = cert.category === 'Archive';
      let nextCategory = 'Archive';
      let nextTags = safeParseArray(cert.tags);
      
      if (isCurrentlyArchived) {
        // Restore: find original category in tags
        const origCatTag = nextTags.find(t => t.startsWith('_orig_cat:'));
        nextCategory = origCatTag ? origCatTag.split(':')[1] : 'Certifications';
        nextTags = nextTags.filter(t => !t.startsWith('_orig_cat:'));
      } else {
        // Archive: save current category
        nextTags = [...nextTags.filter(t => !t.startsWith('_orig_cat:')), `_orig_cat:${cert.category}`];
        nextCategory = 'Archive';
      }

      const updated = await pbUpdateCertificate(id, { 
        category: nextCategory,
        tags: JSON.stringify(nextTags)
      });
      
      set((state) => ({
        certificates: state.certificates.map((c) =>
          c.id === id ? updated : c
        ),
        isLoading: false
      }));

      return updated;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setSelectedCertId: (id) => set({ selectedCertId: id }),

  // Helpers
  getRandomThumbnailColor: () => {
    const colors = [
      'bg-neutral-900 text-neutral-100',
      'bg-neutral-800 text-neutral-200',
      'bg-neutral-700 text-neutral-100',
      'bg-neutral-600 text-neutral-200'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // Computed Stats Selector
  getStats: () => {
    const certs = get().certificates;
    const activeCerts = certs.filter(c => c.category !== 'Archive');
    const archivedCerts = certs.filter(c => c.category === 'Archive');

    // Total unique active categories
    const categories = new Set(activeCerts.map(c => c.category));

    // Recent active uploads (created in last 30 days, or issueDate in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCount = activeCerts.filter(c => {
      const uploadDate = new Date(c.created || c.issueDate);
      return uploadDate >= thirtyDaysAgo;
    }).length;

    // Newest credential
    let newest = null;
    if (activeCerts.length > 0) {
      const sorted = [...activeCerts].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
      newest = sorted[0];
    }

    return {
      totalCertificates: certs.length,
      activeCredentials: activeCerts.length,
      categoriesCount: categories.size,
      archivedCount: archivedCerts.length,
      recentUploads: recentCount,
      newestCredential: newest ? newest.title : 'None'
    };
  },

  // Get filtered & sorted certificates list
  getFilteredCertificates: () => {
    const { certificates, categoryFilter, searchQuery, sortOrder } = get();
    
    let filtered = certificates.filter((cert) => {
      const isCertArchived = cert.category === 'Archive';
      
      // Determine archive status filter
      if (categoryFilter === 'Archived') {
        if (!isCertArchived) return false;
      } else {
        if (isCertArchived) return false;
        
        // Category filter
        if (categoryFilter !== 'all' && cert.category !== categoryFilter) {
          return false;
        }
      }

      // Search query filter
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;

      // Extract skills / tags
      const rawTags = safeParseArray(cert.tags);
      const tags = rawTags.filter(t => !t.startsWith('_orig_cat:'));

      const skills = safeParseArray(cert.skills);

      return (
        cert.title.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        cert.category.toLowerCase().includes(query) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(query)) ||
        (cert.notes && cert.notes.toLowerCase().includes(query)) ||
        tags.some(tag => tag.toLowerCase().includes(query)) ||
        skills.some(skill => skill.toLowerCase().includes(query))
      );
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.issueDate || b.created) - new Date(a.issueDate || a.created);
      }
      if (sortOrder === 'oldest') {
        return new Date(a.issueDate || a.created) - new Date(b.issueDate || b.created);
      }
      if (sortOrder === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortOrder === 'issuer-asc') {
        return a.issuer.localeCompare(b.issuer);
      }
      return 0;
    });

    return filtered;
  }
}));
