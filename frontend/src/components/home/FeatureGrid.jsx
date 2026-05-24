import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Eye, Archive } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure credential storage',
    description: 'Encrypted vault for certifications, licenses, awards, and professional documents.'
  },
  {
    icon: Search,
    title: 'Fast search & organization',
    description: 'Find what you need instantly with clean categories and powerful filtering.'
  },
  {
    icon: Eye,
    title: 'Professional visual previews',
    description: 'Review documents with a premium, monochrome preview experience.'
  },
  {
    icon: Archive,
    title: 'Archive & restore workflows',
    description: 'Keep your workspace tidy, then restore items when you need them.'
  }
];

export const FeatureGrid = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-color/60 bg-bg-primary/30">
          <span className="h-1.5 w-1.5 rounded-full bg-text-primary/70" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Built for clarity</span>
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">Everything you need to stay credential-ready.</h2>
        <p className="mt-4 text-base leading-relaxed text-text-muted">
          CertVault keeps your important documents organized, secure, and easy to access—without visual noise.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="group rounded-2xl border border-border-color/70 bg-surface/60 backdrop-blur p-6 shadow-sm hover:shadow-md hover:bg-surface transition-all"
            >
              <div className="h-11 w-11 rounded-xl border border-border-color bg-bg-primary/40 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Icon size={20} className="text-text-primary/80" />
              </div>
              <h3 className="font-semibold text-base tracking-tight group-hover:text-text-primary transition-colors">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-text-muted">
                {f.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
