import { Shield, Gem, Truck } from "lucide-react";

const values = [
  {
    icon: Gem,
    title: "Premium Materials",
    description:
      "Solid brass construction with hand-applied finishes that stand the test of time.",
  },
  {
    icon: Shield,
    title: "Lifetime Warranty",
    description:
      "Every Vareno faucet is backed by our limited lifetime warranty for complete peace of mind.",
  },
  {
    icon: Truck,
    title: "Worldwide Delivery",
    description:
      "Carefully packaged and shipped internationally to your doorstep in the United States.",
  },
];

export function Values() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-8 bg-cream-dark/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">
            The Vareno Promise
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-black">
            Why Choose Vareno
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 border border-gold/30 mb-6">
                <value.icon size={22} className="text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-black mb-3">
                {value.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
