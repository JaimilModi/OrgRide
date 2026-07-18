import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="py-24 lg:py-32 bg-primary-950 text-center">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-tight text-white mb-10">
          Your next commute could already be going your way.
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register/rider"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl bg-accent-500 text-primary-950 hover:bg-accent-400 transition-colors"
          >
            Find a Ride
          </Link>
          <Link
            href="/register/driver"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl border-2 border-primary-700 text-white hover:bg-primary-900 transition-colors"
          >
            Offer a Ride
          </Link>
        </div>
        
        <p className="mt-8 text-neutral-400 font-medium">
          Already have an account? <Link href="/signin" className="text-accent-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </section>
  );
}
