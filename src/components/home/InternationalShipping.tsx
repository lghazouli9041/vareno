import { Globe, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

const highlights = [
  {
    icon: Globe,
    label: "International Shipping",
    detail: "We ship from our global workshops directly to all 50 US states.",
  },
  {
    icon: Package,
    label: "Premium Packaging",
    detail: "Each faucet is individually crated with protective foam and branded packaging.",
  },
  {
    icon: Clock,
    label: "Delivery Timeline",
    detail: "Standard delivery within 7–14 business days. Express options available.",
  },
];

export function InternationalShipping() {
  return (
    <section className="py-24 md:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">
              Global Reach
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-black mb-6 leading-tight">
              Delivered to
              <br />
              Your Doorstep
            </h2>
            <div className="gold-line mb-8" />
            <p className="text-muted leading-relaxed mb-10 max-w-md">
              Vareno products are crafted internationally and shipped with care
              to customers across the United States. Every order includes tracking,
              insurance, and white-glove handling.
            </p>
            <Button href="/contact" variant="secondary">
              Shipping Information
            </Button>
          </div>

          <div className="space-y-8">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="flex gap-5 p-6 border border-cream-dark bg-white/50"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-gold/20">
                  <item.icon size={20} className="text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-black mb-1">
                    {item.label}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
