import { ShieldCheck, GitMerge, ArrowLeftRight, Heart } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Verified Workplace Community",
    desc: "Built around employees belonging to the same organisational ecosystem — not anonymous strangers.",
  },
  {
    icon: GitMerge,
    title: "Route & Schedule Matching",
    desc: "Designed to connect journeys based on where and when employees travel.",
  },
  {
    icon: ArrowLeftRight,
    title: "Flexible Driver & Rider Experience",
    desc: "The same employee can find a ride when needed or offer available seats when driving.",
  },
  {
    icon: Heart,
    title: "Safer Commute Preferences",
    desc: "Designed to support trusted profiles and preferences such as female-only rides.",
  },
] as const;

export default function WhyOrgRide() {
  return (
    <section className="py-20 lg:py-28 bg-white" id="why-orgride">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-primary-950">
            Why OrgRide
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-5 p-6 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                <div className="shrink-0 h-12 w-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Icon size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-950 mb-1.5">{item.title}</h3>
                  <p className="text-neutral-600 text-[0.95rem] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
