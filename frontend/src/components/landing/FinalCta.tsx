"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FinalCta() {
  return (
    <section className="max-w-[1000px] mx-auto px-6 py-20 md:py-32 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[40px] px-8 py-20 md:py-28 text-center shadow-lg border border-[var(--landing-border)] bg-[var(--landing-surface)]"
      >
        {/* Radial Glow Overlay */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(800px circle at 50% 0%, var(--landing-surface-soft), transparent 80%)" }}
        />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-[var(--landing-text-primary)]">
            Stop driving alone.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--landing-blue)] to-[var(--landing-cyan)]">
              Start commuting together.
            </span>
          </h2>
          
          <p className="mt-6 text-[var(--landing-text-secondary)] max-w-lg mx-auto text-base md:text-lg leading-relaxed font-medium">
            Join thousands of verified employees who treat their commute as an opportunity to connect, save money, and reduce their carbon footprint.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/register/rider"
              className={cn(
                "group flex items-center justify-center gap-2 rounded-full",
                "bg-[var(--landing-blue)] text-white hover:text-white focus:text-white font-bold text-base px-8 py-4",
                "transition-all hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg w-full sm:w-auto"
              )}
            >
              Join as Rider
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform text-white group-hover:text-white" />
            </Link>
            <Link
              href="/register/driver"
              className={cn(
                "group flex items-center justify-center gap-2 rounded-full",
                "bg-[var(--landing-surface)] text-[var(--landing-text-primary)] font-bold text-base px-8 py-4 border border-[var(--landing-border-strong)]",
                "transition-all hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] w-full sm:w-auto shadow-sm"
              )}
            >
              Join as Driver
            </Link>
          </div>
          
          <div className="mt-8">
            <Link href="/signin" className="text-sm font-semibold text-[var(--landing-text-secondary)] hover:text-[var(--landing-blue)] transition-colors">
              Already have an account? Sign In <ChevronRight size={14} className="inline mb-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
