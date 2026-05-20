import { create } from 'zustand';
import { 
  getCertificates, 
  createCertificate, 
  updateCertificate as pbUpdateCertificate, 
  deleteCertificate as pbDeleteCertificate 
} from '../services/certificateService';


export const useCertStore = create((set, get) => ({
  certificates: [],
  isLoading: false,
  error: null,
  selectedCertId: null,
  categoryFilter: 'all',
  searchQuery: '',

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
        // Directly add the already created certificate to the store
        set((state) => ({
          certificates: [certData, ...state.certificates],
          isLoading: false
        }));
        return certData;
      },

  updateCertificate: async (id, updatedFields) => {
    set({ isLoading: true, error: null });
    try {
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

  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
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
    const total = certs.length;
    
    // Active = status 'active' and not archived category
    const active = certs.filter(c => c.status === 'active' && c.category !== 'Archive').length;
    
    // Expiring Soon = active & has expiry date within next 3 months (90 days)
    const expiringSoon = certs.filter(c => {
      if (!c.expiryDate || c.status !== 'active') return false;
      const today = new Date('2026-05-20');
      const exp = new Date(c.expiryDate);
      const diffTime = exp - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 90;
    }).length;

    // Recent Uploads = uploaded within past month or very recent (created date after 2026-04-15)
    const recent = certs.filter(c => {
      const date = new Date(c.created || c.issueDate);
      return date >= new Date('2026-04-15');
    }).length;

    return {
      totalCertificates: total,
      activeCredentials: active,
      expiringSoon: expiringSoon,
      recentUploads: recent
    };
  },

  // Get filtered certificates list
  getFilteredCertificates: () => {
    const { certificates, categoryFilter, searchQuery } = get();
    return certificates.filter((cert) => {
      // Category filter
      const matchesCategory =
        categoryFilter === 'all' ||
        cert.category === categoryFilter;

      // Search query filter
      const query = searchQuery.toLowerCase().trim();
      
      // Parse dynamic skills/tags array (supports raw tags or PB string arrays)
      const tags = Array.isArray(cert.tags) 
        ? cert.tags 
        : JSON.parse(cert.tags || '[]');
      const skills = Array.isArray(cert.skills) 
        ? cert.skills 
        : JSON.parse(cert.skills || '[]');

      const matchesSearch =
        !query ||
        cert.title.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(query)) ||
        tags.some(tag => tag.toLowerCase().includes(query)) ||
        skills.some(skill => skill.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }
}));
