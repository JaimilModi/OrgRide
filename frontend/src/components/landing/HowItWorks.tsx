"use client";

import { motion } from "framer-motion";
import { Search, CarFront, IndianRupee, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-[1200px] mx-auto px-6 py-20 md:py-28 relative z-10">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        
        {/* Left Column - Text Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--landing-blue)]" />
            <span className="text-sm font-bold text-[var(--landing-text-primary)] uppercase tracking-widest">Intelligent Matching</span>
            <span className="px-2 py-0.5 rounded-full border border-[var(--landing-blue)]/30 text-[var(--landing-blue)] text-[10px] font-bold bg-[var(--landing-blue)]/10">
              AI-Powered
            </span>
          </div>

          <h2 className="text-[32px] md:text-5xl font-bold tracking-tight leading-[1.05] text-[var(--landing-text-primary)]">
            Find the perfect ride <br /> in a single search.
          </h2>
          
          <p className="mt-6 text-[var(--landing-text-secondary)] text-base md:text-lg leading-relaxed max-w-md font-medium">
            OrgRide calculates the exact overlap between your commute and verified colleagues driving the same route. Focus on your workday — the logistics handle themselves.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Smart routing", "Verified employees", "Cashless splits", "Live updates"].map((chip) => (
              <span key={chip} className="text-xs font-bold text-[var(--landing-text-secondary)] px-4 py-2 rounded-full border border-[var(--landing-border-strong)] bg-[var(--landing-surface)] hover:bg-[var(--landing-surface-sec)] hover:border-[var(--landing-blue)]/30 transition-all shadow-sm">
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Clean UI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="rounded-3xl p-6 bg-[var(--landing-surface)] border border-[var(--landing-border)] shadow-md"
        >
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-sm font-bold text-[var(--landing-text-primary)]">Commute Workflow</h3>
            <span className="text-xs font-semibold text-[var(--landing-blue)]">3 Simple Steps</span>
          </div>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="rounded-2xl p-4 flex gap-4 items-start group hover:bg-[var(--landing-surface-sec)] border border-transparent hover:border-[var(--landing-blue)]/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-[var(--landing-surface-soft)] flex items-center justify-center shrink-0 border border-[var(--landing-blue)]/10 group-hover:bg-[var(--landing-blue)]/10 group-hover:text-[var(--landing-blue)] transition-all text-[var(--landing-text-muted)]">
                <Search size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--landing-text-primary)] mb-1">1. Find or Offer</h4>
                <p className="text-xs text-[var(--landing-text-secondary)] font-medium leading-relaxed">
                  Enter your home and office locations. Browse colleagues offering rides, or publish your own available seats.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl p-4 flex gap-4 items-start group hover:bg-[var(--landing-surface-sec)] border border-transparent hover:border-[var(--landing-green)]/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-[var(--landing-surface-soft)] flex items-center justify-center shrink-0 border border-[var(--landing-green)]/10 group-hover:bg-[var(--landing-green)]/10 group-hover:text-[var(--landing-green)] transition-all text-[var(--landing-text-muted)]">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--landing-text-primary)] mb-1">2. Secure Verification</h4>
                <p className="text-xs text-[var(--landing-text-secondary)] font-medium leading-relaxed">
                  Every user is authenticated against their enterprise database. Only trusted colleagues can see your commute.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl p-4 flex gap-4 items-start group hover:bg-[var(--landing-surface-sec)] border border-transparent hover:border-[var(--landing-cyan)]/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-[var(--landing-surface-soft)] flex items-center justify-center shrink-0 border border-[var(--landing-cyan)]/10 group-hover:bg-[var(--landing-cyan)]/10 group-hover:text-[var(--landing-cyan)] transition-all text-[var(--landing-text-muted)]">
                <IndianRupee size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--landing-text-primary)] mb-1">3. Automated Cost Split</h4>
                <p className="text-xs text-[var(--landing-text-secondary)] font-medium leading-relaxed">
                  The internal OrgRide wallet calculates the distance and automatically deducts the shared cost at the end of the ride.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
