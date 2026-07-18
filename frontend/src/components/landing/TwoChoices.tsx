import Link from "next/link";
import { User, Car } from "lucide-react";

export default function TwoChoices() {
  return (
    <section id="join" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Find a Ride */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 lg:p-10 flex flex-col items-start hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-6">
              <User size={28} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-extrabold text-primary-950 mb-3">Need a Ride?</h3>
            <p className="text-neutral-600 leading-relaxed mb-8">
              Find verified colleagues travelling towards your destination and request an available seat.
            </p>
            <Link
              href="/register/rider"
              className="mt-auto inline-block px-7 py-3 text-sm font-semibold rounded-lg bg-primary-900 text-white hover:bg-primary-800 transition-colors"
            >
              Find a Ride
            </Link>
          </div>

          {/* Offer a Ride */}
          <div className="rounded-2xl border border-neutral-200 bg-accent-50/50 p-8 lg:p-10 flex flex-col items-start hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 rounded-2xl bg-accent-200 text-accent-700 flex items-center justify-center mb-6">
              <Car size={28} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-extrabold text-primary-950 mb-3">Driving to Work?</h3>
            <p className="text-neutral-600 leading-relaxed mb-8">
              Offer your available seats and share your commute with colleagues travelling along your route.
            </p>
            <Link
              href="/register/driver"
              className="mt-auto inline-block px-7 py-3 text-sm font-semibold rounded-lg bg-accent-500 text-primary-950 hover:bg-accent-400 transition-colors"
            >
              Offer a Ride
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
