import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--landing-border)] bg-[var(--landing-surface-sec)] py-12 relative z-10">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center group">
            <Image 
              src="/branding/orgride-logo-transparent.png" 
              alt="OrgRide Logo" 
              width={100} 
              height={100} 
              className="h-10 w-auto object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/signin" className="text-sm font-medium text-[var(--landing-text-secondary)] hover:text-[var(--landing-blue)] transition-colors">
              Sign In
            </Link>
            <Link href="/register/rider" className="text-sm font-medium text-[var(--landing-text-secondary)] hover:text-[var(--landing-blue)] transition-colors">
              Find a Ride
            </Link>
            <Link href="/register/driver" className="text-sm font-medium text-[var(--landing-text-secondary)] hover:text-[var(--landing-blue)] transition-colors">
              Offer a Ride
            </Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[var(--landing-border-strong)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-[var(--landing-text-muted)]">
          <p>© {new Date().getFullYear()} OrgRide. Premium Enterprise Mobility.</p>
          <div className="flex gap-6">
            <a href="#" className="landing-footer-link text-xs font-medium">Privacy</a>
            <a href="#" className="landing-footer-link text-xs font-medium">Terms</a>
            <a href="#" className="landing-footer-link text-xs font-medium">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
