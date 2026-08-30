import { ShieldCheck, Leaf, Gem, Zap, Globe, Heart } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Authenticated",
    desc: "Every bead is hand-inspected by certified Nepali gemologists and comes with a certificate of origin.",
    color: "bg-amber-50 text-[#713f12]",
    border: "border-amber-200/60",
  },
  {
    icon: Leaf,
    title: "Ethically Sourced",
    desc: "Sustainably harvested from the ancient forests of the Himalayan foothills with zero ecological harm.",
    color: "bg-green-50 text-green-700",
    border: "border-green-200/60",
  },
  {
    icon: Gem,
    title: "Premium Mukhi Selection",
    desc: "From rare 1 Mukhi to the divine 21 Mukhi — we carry the full spectrum of sacred Rudraksha grades.",
    color: "bg-purple-50 text-purple-700",
    border: "border-purple-200/60",
  },
  {
    icon: Zap,
    title: "Energized & Blessed",
    desc: "All beads are ritually cleansed and energized with Vedic mantras by experienced Nepali priests.",
    color: "bg-orange-50 text-orange-700",
    border: "border-orange-200/60",
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    desc: "Insured worldwide shipping with real-time tracking. Free on orders above $150 to any country.",
    color: "bg-blue-50 text-blue-700",
    border: "border-blue-200/60",
  },
  {
    icon: Heart,
    title: "Devotee Community",
    desc: "Join 10,000+ spiritual seekers. Access guides, rituals, and expert support from our team.",
    color: "bg-rose-50 text-rose-700",
    border: "border-rose-200/60",
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="inline-block rounded-full border border-amber-800/20 bg-amber-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#713f12] sm:text-xs">
            Why Choose Us
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#2d1a0e] sm:text-3xl lg:text-4xl">
            The Nepali Rudraksh Difference
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5c3a1e]/70 sm:text-base">
            We are more than a store — we are guardians of an ancient tradition,
            connecting spiritual seekers with genuinely sacred Himalayan Rudraksha.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, color, border }) => (
            <div
              key={title}
              className={`group rounded-2xl border ${border} bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-amber-900/8 sm:p-6`}
            >
              <div className={`mb-3.5 inline-flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-base font-bold text-[#422006] sm:text-lg">{title}</h3>
              <p className="text-xs leading-relaxed text-[#5c3a1e]/70 sm:text-sm">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom stat bar */}
        <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl bg-[#713f12] p-5 sm:mt-14 sm:grid-cols-4 sm:p-8">
          {[
            { val: "10,000+", label: "Happy Devotees" },
            { val: "21", label: "Mukhi Grades" },
            { val: "50+", label: "Countries Served" },
            { val: "4.9★", label: "Average Rating" },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <span className="text-xl font-extrabold text-amber-300 sm:text-2xl lg:text-3xl">{val}</span>
              <span className="mt-1 text-[10px] font-medium text-amber-100/80 uppercase tracking-wider sm:text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
