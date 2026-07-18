export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-surface border-y border-neutral-100" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-primary-950">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
          {/* For Riders */}
          <div>
            <h3 className="text-xl font-bold text-primary-900 mb-8 pb-4 border-b-2 border-primary-100 uppercase tracking-wide">
              For Riders
            </h3>
            <ol className="space-y-8">
              {[
                "Join your workplace network",
                "Search compatible rides",
                "Book and commute"
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-800 font-bold text-sm">
                    {i + 1}
                  </span>
                  <p className="text-lg font-semibold text-neutral-700 pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* For Drivers */}
          <div>
            <h3 className="text-xl font-bold text-accent-700 mb-8 pb-4 border-b-2 border-primary-100 uppercase tracking-wide">
              For Drivers
            </h3>
            <ol className="space-y-8">
              {[
                "Register yourself and your vehicle",
                "Offer a ride",
                "Accept riders and commute"
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700 font-bold text-sm">
                    {i + 1}
                  </span>
                  <p className="text-lg font-semibold text-neutral-700 pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
