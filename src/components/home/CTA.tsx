import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="relative py-28 md:py-36 px-6 lg:px-8 bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #C9A96E 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">
          Begin Your Journey
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6 leading-tight">
          Elevate Your Space
        </h2>
        <div className="gold-line-center mb-8" />
        <p className="text-cream/50 leading-relaxed mb-10 max-w-md mx-auto">
          Explore our full collection of luxury faucets and find the perfect
          piece for your home. Questions? Our team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/shop" size="lg">
            Shop Collection
          </Button>
          <Button
            href="/contact"
            variant="outline"
            size="lg"
            className="border-cream/30 text-cream hover:bg-cream hover:text-black"
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </section>
  );
}
