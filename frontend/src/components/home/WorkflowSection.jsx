import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, FolderOpen, KeyRound } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Add certificates, licenses, awards, and documents.'
  },
  {
    icon: FolderOpen,
    title: 'Organize',
    description: 'Categorize and structure items for instant retrieval.'
  },
  {
    icon: Search,
    title: 'Search',
    description: 'Find by name, issuer, and category in seconds.'
  },
  {
    icon: KeyRound,
    title: 'Access Anywhere',
    description: 'Secure access whenever you need it.'
  }
];

export const WorkflowSection = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center sm:text-left">A workflow that stays effortless.</h2>
        <p className="mt-4 text-base leading-relaxed text-text-muted text-center sm:text-left max-w-2xl">
          Upload, organize, search, and retrieve—built for credentials that never sit still.
        </p>
      </motion.div>

      <div className="mt-14">
        <div className="hidden md:flex items-center justify-between gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isLast = idx === steps.length - 1;
            return (
              <React.Fragment key={s.title}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="flex-1"
                >
                  <div className="rounded-2xl border border-border-color/70 bg-surface/50 backdrop-blur p-6">
                    <div className="flex flex-col items-start gap-4">
                      <div className="h-11 w-11 rounded-xl border border-border-color bg-bg-primary/40 flex items-center justify-center shadow-sm">
                        <Icon size={18} className="text-text-primary/80" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold uppercase tracking-widest text-text-primary">{s.title}</div>
                        <div className="mt-2 text-xs text-text-muted leading-relaxed">{s.description}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {!isLast && (
                  <div className="flex items-center justify-center w-12 opacity-40">
                    <div className="h-px w-full bg-border-color" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile stacked */}
        <div className="md:hidden flex flex-col gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
                className="rounded-2xl border border-border-color/70 bg-surface/50 backdrop-blur p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl border border-border-color bg-bg-primary/35 flex items-center justify-center">
                    <Icon size={18} className="text-text-primary/80" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-text-primary">{s.title}</div>
                    <div className="mt-1 text-xs text-text-muted leading-relaxed">{s.description}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
