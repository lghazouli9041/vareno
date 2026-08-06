import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function BrandStory() {
  return (
    <section className="bg-black text-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative aspect-square lg:aspect-auto lg:min-h-[600px]">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
              alt="Vareno craftsmanship"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20 lg:py-0">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">
              Our Heritage
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
              Crafted for
              <br />
              Perfection
            </h2>
            <div className="gold-line mb-8" />
            <p className="text-cream/60 leading-relaxed mb-6">
              At Vareno, we believe that the faucet is more than a fixture — it
              is the centerpiece of your sanctuary. Every piece is forged from
              solid brass, hand-finished by master artisans, and tested to exceed
              the highest standards of performance and durability.
            </p>
            <p className="text-cream/60 leading-relaxed mb-10">
              From our workshops to your home, we deliver an experience that
              transcends the ordinary. Because true luxury is felt in every detail.
            </p>
            <Button href="/about" variant="outline" className="self-start">
              Discover Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
