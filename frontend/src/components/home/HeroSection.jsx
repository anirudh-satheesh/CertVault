import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, FileText, LayoutGrid } from 'lucide-react';

const MotionSection = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export const HeroSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'smooth';
      return () => {
        document.documentElement.style.scrollBehavior = previousBehavior;
      };
    }
  }, []);

  return (
    <section className="relative overflow-hidden mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-text-primary/5 blur-[120px]" />
        <div className="absolute top-32 -left-24 h-72 w-72 rounded-full bg-border-color/10 blur-[100px]" />
        <div className="absolute bottom-0 -right-24 h-80 w-80 rounded-full bg-text-primary/5 blur-[120px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"> 
        {/* Copy */}
        <div className="lg:col-span-6 text-center lg:text-left">
          <MotionSection>
            <div className="max-w-xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-color/60 bg-bg-primary/30">
                <span className="h-1.5 w-1.5 rounded-full bg-text-primary/70" />
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Secure by design</span>
              </div>

              <h1 className="mt-4 text-[40px] leading-[1.05] sm:text-[52px] lg:text-[56px] font-semibold tracking-tight">
                Your credentials. Organized professionally.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-text-muted">
                Securely manage certifications, licenses, awards, and professional documents in one clean workspace.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-text-primary text-bg-primary hover:bg-neutral-900 transition-all duration-200"
                >
                  <span className="text-sm font-semibold">Get Started</span>
                  <ArrowRight size={16} />
                </button>

                <Link
                  to="/"
                  onClick={(e) => {
                    e.preventDefault();
                    // keep consistent with requirement: View Workspace -> /login
                    navigate('/login');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border-color bg-transparent text-text-primary hover:bg-bg-secondary transition-all duration-200"
                >
                  <span className="text-sm font-semibold">View Workspace</span>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-3 text-xs text-text-muted">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-color/60 bg-bg-primary/30">
                  <ShieldCheck size={14} /> AES-256 Storage
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-color/60 bg-bg-primary/30">
                  <Search size={14} /> Fast Search
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-color/60 bg-bg-primary/30">
                  <FileText size={14} /> Clean Previews
                </span>
              </div>
            </div>
          </MotionSection>
        </div>

        {/* Preview */}
        <div className="lg:col-span-6">
          <MotionSection>
            <div className="relative">
              {/* soft frame */}
              <div className="rounded-3xl border border-border-color bg-surface/70 backdrop-blur p-4 shadow-sm">
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    <LayoutGrid size={14} /> Workspace Preview
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-text-primary/70" />
                    <span className="h-2 w-2 rounded-full bg-text-primary/40" />
                    <span className="h-2 w-2 rounded-full bg-text-primary/25" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div className="rounded-2xl border border-border-color bg-bg-primary/30 p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Certification</div>
                      <div className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border-color text-text-muted">Verified</div>
                    </div>
                    <div className="mt-4 font-semibold text-text-primary tracking-tight">AWS Solutions Architect</div>
                    <div className="mt-1 text-[11px] text-text-muted">Issued • 2024</div>
                  </div>

                  <div className="rounded-2xl border border-border-color bg-bg-primary/30 p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">License</div>
                      <div className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border-color text-text-muted">Active</div>
                    </div>
                    <div className="mt-4 font-semibold text-text-primary tracking-tight">Professional Engineer</div>
                    <div className="mt-1 text-[11px] text-text-muted">Renewal • 2026</div>
                  </div>

                  <div className="rounded-2xl border border-border-color bg-bg-primary/30 p-5 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Search & Organization</div>
                        <div className="mt-1 text-sm font-semibold">Find anything in seconds</div>
                      </div>
                      <div className="h-10 w-10 rounded-xl border border-border-color bg-bg-primary/40 flex items-center justify-center">
                        <Search size={16} />
                      </div>
                    </div>
                    <div className="mt-4 h-11 rounded-xl border border-border-color bg-surface/80 flex items-center px-3 gap-3 shadow-inner">
                      <div className="h-7 w-7 rounded-lg bg-bg-primary/60 border border-border-color/60" />
                      <div className="flex-1">
                        <div className="h-2 bg-text-muted/50 rounded-full w-1/2" />
                        <div className="mt-2 h-1.5 bg-text-muted/30 rounded-full w-1/3" />
                      </div>
                      <div className="h-6 w-10 rounded-md bg-accent/10 border border-accent/20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* extra subtle card stack */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden xl:block absolute -bottom-8 -right-8 rounded-2xl border border-border-color bg-surface/80 backdrop-blur p-4 shadow-lg shadow-black/5"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Quick Actions</div>
                <div className="mt-2 text-[11px] text-text-muted font-medium">Archive → Review → Restore</div>
              </motion.div>
            </div>
          </MotionSection>
        </div>
      </div>
    </section>
  );
};
