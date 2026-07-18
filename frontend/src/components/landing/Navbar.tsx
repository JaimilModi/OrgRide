"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why OrgRide", href: "#why-orgride" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = mobileOpen ? "hidden" : "";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-6 lg:px-10"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <svg
            viewBox="0 0 32 32"
            className="h-8 w-8 text-primary-800 group-hover:text-primary-700 transition-colors"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="16" cy="8" r="3" fill="currentColor" className="text-accent-500" />
            <path
              d="M6 26 C9 16, 13 10, 16 10 C19 10, 23 16, 26 26"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="9" cy="23" r="2" fill="currentColor" opacity="0.35" />
            <circle cx="23" cy="23" r="2" fill="currentColor" opacity="0.35" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-primary-900">
            OrgRide
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-4 py-2 text-[0.935rem] font-medium text-neutral-600 hover:text-primary-800 rounded-lg hover:bg-primary-50/60 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/signin"
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-primary-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/#join"
            className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-accent-500 text-primary-950 hover:bg-accent-400 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[4.5rem] bottom-0 bg-white z-40 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 pt-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3.5 px-4 text-lg font-medium text-neutral-800 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/signin"
            onClick={() => setMobileOpen(false)}
            className="block py-3.5 px-4 text-lg font-medium text-neutral-800 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            Sign In
          </Link>
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <Link
              href="/#join"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3.5 text-base font-semibold rounded-xl bg-accent-500 text-primary-950 hover:bg-accent-400 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
