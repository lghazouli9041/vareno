import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function ShopBanner() {
  return (
    <section
      className="border-b border-border bg-secondary/40"
      aria-labelledby="shop-heading"
    >
      <Container className="pb-16 pt-28 md:pb-20 md:pt-36">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li className="text-primary" aria-current="page">
              Shop
            </li>
          </ol>
        </nav>

        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-accent">
          The Collection
        </p>
        <h1
          id="shop-heading"
          className="max-w-4xl font-display text-5xl leading-[1.05] text-primary md:text-7xl"
        >
          Architectural Faucets
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-muted md:text-base">
          Explore the VARENO catalog — kitchen and bathroom fixtures crafted for
          designers, architects, and refined American homes. Filter by finish,
          collection, and availability to specify with precision.
        </p>
      </Container>
    </section>
  );
}
