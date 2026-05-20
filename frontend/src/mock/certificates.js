export const MOCK_CATEGORIES = [
  { id: 'all', name: 'All Documents', count: 12 },
  { id: 'Certifications', name: 'Certifications', count: 6 },
  { id: 'Awards', name: 'Awards', count: 3 },
  { id: 'Internships', name: 'Internships', count: 2 },
  { id: 'Archive', name: 'Archive', count: 1 }
];

export const MOCK_CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    category: 'Certifications',
    issueDate: '2026-01-12',
    expiryDate: '2029-01-12',
    credentialId: 'AWS-CCP-88402',
    tags: ['cloud', 'aws', 'infrastructure'],
    skills: ['AWS Services', 'Cloud Security', 'Pricing Models'],
    notes: 'Completed the core training pathways and passed on the first attempt with 865/1000. Core understanding of cloud economics and identity access management.',
    status: 'active',
    thumbnailColor: 'bg-neutral-900 text-neutral-100'
  },
  {
    id: 'cert-2',
    title: 'Advanced React & Frontend Architecture',
    issuer: 'Frontend Masters',
    category: 'Certifications',
    issueDate: '2025-11-04',
    expiryDate: null,
    credentialId: 'FM-ADV-REACT-09',
    tags: ['react', 'frontend', 'javascript'],
    skills: ['Custom Hooks', 'Performance Optimization', 'Design Patterns'],
    notes: 'In-depth focus on advanced reconciliation mechanisms, fiber tree traversal, state managers, and custom caching patterns.',
    status: 'active',
    thumbnailColor: 'bg-neutral-800 text-neutral-200'
  },
  {
    id: 'cert-3',
    title: 'Google UX Design Professional Certificate',
    issuer: 'Google',
    category: 'Certifications',
    issueDate: '2025-08-20',
    expiryDate: null,
    credentialId: 'GGL-UXD-384910',
    tags: ['ux', 'design', 'research'],
    skills: ['Wireframing', 'Prototyping', 'User Research', 'Figma'],
    notes: 'Seven-course series covering foundational user research, wireframing, high-fidelity mockup creation, and cross-platform usability testing.',
    status: 'active',
    thumbnailColor: 'bg-neutral-700 text-neutral-300'
  },
  {
    id: 'cert-4',
    title: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'The Linux Foundation',
    category: 'Certifications',
    issueDate: '2026-04-15',
    expiryDate: '2026-08-15', // Expiring soon (within 3 months)
    credentialId: 'CKA-9923-010',
    tags: ['devops', 'kubernetes', 'containers'],
    skills: ['Cluster Architecture', 'Troubleshooting', 'Pod Scheduling'],
    notes: 'Hands-on exam covering scheduling, logging, security, cluster maintenance, and networking. Need to renew before August expiration.',
    status: 'active',
    thumbnailColor: 'bg-neutral-600 text-neutral-100'
  },
  {
    id: 'cert-5',
    title: 'Outstanding Graduate Award',
    issuer: 'Stanford University',
    category: 'Awards',
    issueDate: '2025-06-15',
    expiryDate: null,
    credentialId: 'SU-GRAD-2025-01',
    tags: ['academic', 'stanford', 'honors'],
    skills: ['Computer Science', 'Academic Excellence', 'Leadership'],
    notes: 'Awarded to the top 2% of the graduating Computer Science cohort for exceptional academic standing and contributions to student tutoring.',
    status: 'active',
    thumbnailColor: 'bg-neutral-900 text-neutral-200'
  },
  {
    id: 'cert-6',
    title: 'Hackathon Grand Prize Winner',
    issuer: 'Vercel & Next.js Hack',
    category: 'Awards',
    issueDate: '2025-10-18',
    expiryDate: null,
    credentialId: 'VHC-2025-GP',
    tags: ['nextjs', 'hackathon', 'ai'],
    skills: ['Next.js App Router', 'Vector Databases', 'Tailwind CSS'],
    notes: 'Won 1st place out of 450 submissions for a real-time semantic document search application with instantaneous offline embedding support.',
    status: 'active',
    thumbnailColor: 'bg-neutral-800 text-neutral-100'
  },
  {
    id: 'cert-7',
    title: 'UX Design Excellence Fellowship',
    issuer: 'Adobe Design Circle',
    category: 'Awards',
    issueDate: '2024-04-01',
    expiryDate: null,
    credentialId: 'ADBC-FELLOW-24',
    tags: ['fellowship', 'adobe', 'design'],
    skills: ['Interaction Design', 'Product Strategy', 'Creative Suite'],
    notes: 'Prestigious yearly fellowship supporting 10 creative students globally. Included direct mentorship from Adobe Design executives.',
    status: 'active',
    thumbnailColor: 'bg-neutral-700 text-neutral-200'
  },
  {
    id: 'cert-8',
    title: 'Software Engineering Intern',
    issuer: 'Stripe',
    category: 'Internships',
    issueDate: '2025-09-01',
    expiryDate: '2025-12-15',
    credentialId: 'STRIPE-INT-25',
    tags: ['internship', 'fintech', 'backend'],
    skills: ['Ruby on Rails', 'API Development', 'Distributed Systems'],
    notes: 'Worked in the Billing core infrastructure group. Refactored the invoice generation pipeline resulting in a 14% improvement in P99 query latency.',
    status: 'active',
    thumbnailColor: 'bg-neutral-900 text-neutral-300'
  },
  {
    id: 'cert-9',
    title: 'Product Design Intern',
    issuer: 'Linear',
    category: 'Internships',
    issueDate: '2024-06-01',
    expiryDate: '2024-08-31',
    credentialId: 'LIN-INT-24',
    tags: ['internship', 'product', 'design'],
    skills: ['Figma prototyping', 'Design Systems', 'React'],
    notes: 'Worked directly with the product team to design and iterate on the cycle statistics workspace. Contributed high fidelity motion prototypes.',
    status: 'active',
    thumbnailColor: 'bg-neutral-800 text-neutral-100'
  },
  {
    id: 'cert-10',
    title: 'Legacy Python Scripting Accreditation',
    issuer: 'Codecademy Pro',
    category: 'Archive',
    issueDate: '2021-03-12',
    expiryDate: null,
    credentialId: 'CC-PY2-1192',
    tags: ['python', 'legacy', 'archive'],
    skills: ['Python 2.7', 'Basic Scripting'],
    notes: 'Old introductory certification completed in high school. Archived because the skills are outdated relative to modern Python 3 experience.',
    status: 'archived',
    thumbnailColor: 'bg-neutral-600 text-neutral-300'
  },
  {
    id: 'cert-11',
    title: 'Meta Frontend Developer Capstone',
    issuer: 'Meta',
    category: 'Certifications',
    issueDate: '2026-05-02',
    expiryDate: null,
    credentialId: 'META-FED-9988',
    tags: ['meta', 'frontend', 'capstone'],
    skills: ['React Hooks', 'Jest Testing', 'GitHub Workflow'],
    notes: 'Final capstone project building a full-featured Little Lemon restaurant booking application incorporating unit tests and state synchronization.',
    status: 'active',
    thumbnailColor: 'bg-neutral-700 text-neutral-100'
  },
  {
    id: 'cert-12',
    title: 'Introduction to Algorithms (CS 161)',
    issuer: 'Stanford Online',
    category: 'Certifications',
    issueDate: '2026-05-18', // Recent upload (within past week)
    expiryDate: null,
    credentialId: 'SO-CS161-ALGO',
    tags: ['algorithms', 'cs', 'stanford'],
    skills: ['Divide and Conquer', 'Dynamic Programming', 'Graph Search'],
    notes: 'Intense mathematical and algorithmic training. Covered sorting lower bounds, randomized selection, Dijkstra/Bellman-Ford, and NP-completeness.',
    status: 'active',
    thumbnailColor: 'bg-neutral-900 text-neutral-200'
  }
];

export const MOCK_STATS = {
  totalCertificates: 12,
  activeCredentials: 11,
  expiringSoon: 1, // CKA expires in August 2026
  recentUploads: 2 // Meta and Stanford CS 161 uploaded recently
};
