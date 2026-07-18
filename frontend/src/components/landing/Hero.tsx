"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  const shinyStyle = {
    backgroundImage: "linear-gradient(to right, var(--landing-blue) 0%, var(--landing-cyan) 50%, var(--landing-blue) 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  };

  return (
    <section className="pt-24 md:pt-36 pb-20 text-center flex flex-col items-center relative z-10 px-6">
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-[40px] md:text-7xl lg:text-[84px] font-bold tracking-tight leading-[0.95] max-w-4xl flex flex-col items-center"
      >
        <span className="text-[var(--landing-text-primary)]">Share your commute.</span>
        <span className="animate-hero-gradient inline-block mt-2 lg:mt-4" style={shinyStyle}>
          With your colleagues.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-8 text-[var(--landing-text-secondary)] max-w-[500px] text-lg leading-relaxed font-medium"
      >
        OrgRide is the verified workplace mobility network. Connect with people from your organization traveling the same route, reduce emissions, and split costs effortlessly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-12 flex flex-col sm:flex-row items-center gap-4"
      >
        <Link
          href="/register/rider"
          className={cn(
            "group flex items-center justify-center gap-2 rounded-full",
            "bg-[var(--landing-blue)] text-white hover:text-white focus:text-white font-bold text-base px-8 py-4",
            "transition-all hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg w-full sm:w-auto focus:ring-2 focus:ring-offset-2 focus:ring-[var(--landing-blue)]"
          )}
        >
          Find a Ride
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
          Offer a Ride
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-8 flex items-center gap-4 text-xs font-semibold text-[var(--landing-text-muted)] uppercase tracking-widest"
      >
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--landing-green)]" /> Enterprise Verified</span>
        <span className="w-1 h-1 rounded-full bg-[var(--landing-border-strong)]" />
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--landing-cyan)]" /> AI Matched</span>
      </motion.div>
      
    </section>
  );
}
