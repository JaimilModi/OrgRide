"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const navLinks = [
    { name: "How it Works", href: "#how-it-works" },
    { name: "Sign In", href: "/signin" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-[1440px] mx-auto px-6 pt-6 relative z-50 flex items-center justify-between"
    >
      {/* Left: Logo */}
      <Link href="/" className="flex items-center group relative z-20 hover:opacity-90 transition-opacity">
        <Image 
          src="/branding/orgride-logo-transparent.png" 
          alt="OrgRide Logo" 
          width={100} 
          height={100} 
          className="h-10 w-auto object-contain"
          priority
        />
      </Link>

      {/* Center/Right: Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <nav className="flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            >
              <Link
                href={link.href}
                className="text-[var(--landing-text-secondary)] text-sm font-medium hover:text-[var(--landing-text-primary)] transition-colors"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </nav>
        
        <div className="w-px h-5 bg-[var(--landing-border-strong)]" />
        
        <div className="flex items-center gap-3">
          <Link
            href="/register/rider"
            className="text-[var(--landing-text-primary)] text-sm font-semibold hover:text-[var(--landing-blue)] transition-colors px-3 py-2"
          >
            Find a Ride
          </Link>
          <Link
            href="/register/driver"
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-full",
              "bg-[var(--landing-blue)] text-white hover:text-white focus:text-white font-bold text-sm px-6 py-2.5",
              "transition-all hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-[var(--landing-blue)]"
            )}
          >
            Offer a Ride
          </Link>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="w-10 h-10 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] flex items-center justify-center text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)] shadow-sm transition-colors">
          <Menu size={18} />
        </button>
      </div>
    </motion.header>
  );
}
