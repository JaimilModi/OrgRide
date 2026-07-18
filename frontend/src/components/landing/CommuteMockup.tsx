"use client";

import { motion } from "framer-motion";
import { Search, MapPin, CheckCircle2, Navigation, ArrowRight, ShieldCheck, CarFront, IndianRupee, Zap } from "lucide-react";

export default function CommuteMockup() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[32px] overflow-hidden border border-[var(--landing-border)] bg-[var(--landing-surface)] shadow-lg"
      >
        {/* macOS Style Title Bar */}
        <div className="h-12 bg-[var(--landing-surface-sec)] border-b border-[var(--landing-border)] px-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex items-center gap-2 opacity-60">
            <ShieldCheck size={14} className="text-[var(--landing-blue)]" />
            <span className="text-xs font-semibold text-[var(--landing-text-primary)] uppercase tracking-widest">OrgRide OS</span>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="grid lg:grid-cols-12 min-h-[560px]">
          
          {/* Sidebar */}
          <div className="hidden lg:block col-span-3 border-r border-[var(--landing-border)] bg-[var(--landing-surface-sec)] p-5">
            <button className="w-full bg-[var(--landing-surface)] border border-[var(--landing-border-strong)] text-[var(--landing-text-primary)] text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-50 hover:shadow-sm transition-all">
              <Search size={16} className="text-[var(--landing-blue)]" /> Find a Ride
            </button>
            
            <div className="mt-8 space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-[var(--landing-text-muted)] uppercase tracking-widest mb-2">Commutes</div>
              <div className="px-3 py-2.5 rounded-lg bg-[var(--landing-blue)]/10 text-[var(--landing-blue)] font-semibold text-sm flex justify-between items-center border border-[var(--landing-blue)]/20">
                Search Results <span className="bg-[var(--landing-blue)] text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">Live</span>
              </div>
              <div className="px-3 py-2.5 rounded-lg text-[var(--landing-text-secondary)] hover:bg-[var(--landing-border)] font-semibold text-sm transition-colors">
                Upcoming Rides
              </div>
              <div className="px-3 py-2.5 rounded-lg text-[var(--landing-text-secondary)] hover:bg-[var(--landing-border)] font-semibold text-sm transition-colors">
                Wallet Balance
              </div>
            </div>

            <div className="mt-8">
              <div className="px-3 py-2 text-xs font-bold text-[var(--landing-text-muted)] uppercase tracking-widest mb-3">Filters</div>
              <div className="space-y-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--landing-green)] shadow-sm" />
                  <span className="text-sm font-medium text-[var(--landing-text-secondary)]">Verified Colleagues</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--landing-cyan)] shadow-sm" />
                  <span className="text-sm font-medium text-[var(--landing-text-secondary)]">AI Matched</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Context */}
          <div className="col-span-12 lg:col-span-4 border-r border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 flex flex-col">
            <div className="rounded-2xl p-5 mb-6 bg-[var(--landing-surface-sec)] border border-[var(--landing-border)]">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-3 h-3 rounded-full border-2 border-[var(--landing-green)]" />
                  <div className="w-0.5 h-10 bg-[var(--landing-border-strong)] my-1" />
                  <MapPin size={14} className="text-[var(--landing-blue)]" />
                </div>
                <div className="flex-1 space-y-5">
                  <div>
                    <p className="text-[10px] font-bold text-[var(--landing-green)] uppercase tracking-wider mb-1">Pickup (You)</p>
                    <p className="text-sm font-bold text-[var(--landing-text-primary)]">LDRP Institute</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[var(--landing-text-muted)] uppercase tracking-wider mb-1">Destination</p>
                    <p className="text-sm font-bold text-[var(--landing-text-primary)]">GIFT City</p>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-bold text-[var(--landing-text-primary)] mb-4 flex items-center gap-2">
              <Zap size={16} className="text-[var(--landing-blue)]" /> Matched Colleagues (2)
            </h4>
            
            <div className="space-y-3">
              {/* Active Card */}
              <div className="bg-[var(--landing-surface)] border border-[var(--landing-blue)]/30 rounded-xl p-4 cursor-pointer relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-1 h-full bg-[var(--landing-blue)]" />
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--landing-surface-soft)] flex items-center justify-center font-bold text-[var(--landing-blue)] shadow-sm border border-[var(--landing-blue)]/20">
                      S
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--landing-text-primary)]">Shivansh K.</p>
                      <p className="text-xs font-medium text-[var(--landing-text-muted)]">Engineering Team</p>
                    </div>
                  </div>
                  <div className="bg-[var(--landing-green)]/10 text-[var(--landing-green)] border border-[var(--landing-green)]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                    92% Match
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-[var(--landing-text-secondary)]">
                  <span className="flex items-center gap-1.5"><CarFront size={14} className="text-[var(--landing-text-muted)]" /> 2 Seats</span>
                  <span className="flex items-center gap-1.5"><IndianRupee size={14} className="text-[var(--landing-text-muted)]" /> 45</span>
                </div>
              </div>

              {/* Inactive Card */}
              <div className="rounded-xl p-4 border border-[var(--landing-border)] hover:bg-[var(--landing-surface-sec)] cursor-pointer transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--landing-surface-sec)] flex items-center justify-center font-bold text-[var(--landing-text-primary)]">
                      M
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--landing-text-primary)]">Meera T.</p>
                      <p className="text-xs font-medium text-[var(--landing-text-muted)]">Design Team</p>
                    </div>
                  </div>
                  <div className="bg-[var(--landing-surface-sec)] text-[var(--landing-text-muted)] px-2 py-0.5 rounded text-[10px] font-bold">
                    78% Match
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Action View */}
          <div className="col-span-12 lg:col-span-5 p-6 md:p-8 flex flex-col justify-center bg-[var(--landing-bg)]">
            <div className="rounded-3xl p-8 text-center relative overflow-hidden border border-[var(--landing-border)] bg-[var(--landing-surface)] shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--landing-surface-soft)] to-transparent opacity-50" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-[var(--landing-blue)]/10 border border-[var(--landing-blue)]/20 flex items-center justify-center mx-auto mb-6 text-[var(--landing-blue)]">
                  <Navigation size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-[var(--landing-text-primary)] mb-2">Perfect Commute Match</h3>
                <p className="text-sm text-[var(--landing-text-secondary)] leading-relaxed mb-8">
                  Shivansh's route passes within 400m of your pickup point. Request a seat and split the commute cost securely.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[var(--landing-surface-sec)] rounded-xl p-4 text-left border border-[var(--landing-border)]">
                    <p className="text-[10px] font-bold text-[var(--landing-text-muted)] uppercase mb-1">Departure</p>
                    <p className="text-lg font-bold text-[var(--landing-green)]">08:45 AM</p>
                  </div>
                  <div className="bg-[var(--landing-surface-sec)] rounded-xl p-4 text-left border border-[var(--landing-border)]">
                    <p className="text-[10px] font-bold text-[var(--landing-text-muted)] uppercase mb-1">Est. Arrival</p>
                    <p className="text-lg font-bold text-[var(--landing-blue)]">09:30 AM</p>
                  </div>
                </div>

                <button className="w-full bg-[var(--landing-blue)] text-white hover:text-white focus:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-md transition-all">
                  Request Seat — ₹45 <ArrowRight size={16} className="text-white group-hover:text-white" />
                </button>
                <p className="text-[10px] font-semibold text-[var(--landing-green)] mt-4 uppercase tracking-widest flex items-center justify-center gap-1.5 opacity-90">
                  <ShieldCheck size={12} /> Verified Enterprise Authentication
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
