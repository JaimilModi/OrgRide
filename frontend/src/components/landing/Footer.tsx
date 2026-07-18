import Link from "next/link";

const LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why OrgRide", href: "#why-orgride" },
  { label: "Sign In", href: "/signin" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-950 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 lg:py-14">
        <div className="flex flex-col gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="h-6 w-6 text-neutral-500" fill="none" aria-hidden="true">
                <circle cx="16" cy="8" r="3" fill="currentColor" className="text-accent-500" />
                <path d="M6 26 C9 16,13 10,16 10 C19 10,23 16,26 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="9" cy="23" r="2" fill="currentColor" opacity="0.35" />
                <circle cx="23" cy="23" r="2" fill="currentColor" opacity="0.35" />
              </svg>
              <span className="text-lg font-bold text-neutral-300 tracking-tight">OrgRide</span>
            </Link>
            <p className="text-sm text-neutral-500 max-w-xs">
              Smarter shared commuting for workplace communities.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2" aria-label="Footer navigation">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="pt-6 border-t border-white/[0.04]">
            <p className="text-xs text-neutral-600">
              &copy; {new Date().getFullYear()} OrgRide. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
