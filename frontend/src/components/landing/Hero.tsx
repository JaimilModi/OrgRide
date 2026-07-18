import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-[4.5rem] overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        {/* Text column */}
        <div className="flex flex-col gap-6 max-w-xl lg:max-w-none">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-tight text-primary-950">
            Share your commute with people you already work with.
          </h1>

          <p className="text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-neutral-600 max-w-lg">
            Find a ride or offer available seats to verified colleagues travelling along your route.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/register/rider"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-accent-500 text-primary-950 hover:bg-accent-400 shadow-sm transition-colors"
            >
              Find a Ride
            </Link>
            <Link
              href="/register/driver"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl border-2 border-primary-200 text-primary-800 hover:border-primary-400 hover:bg-primary-50 transition-colors"
            >
              Offer a Ride
            </Link>
          </div>
          <div className="pt-2">
            <p className="text-sm text-neutral-500 font-medium">
              Already registered? <Link href="/signin" className="text-primary-700 hover:underline">Sign In</Link>
            </p>
          </div>
        </div>

        {/* Visual column */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
