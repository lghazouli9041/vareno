import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Trade Program",
  description:
    "VARENO Trade Program for architects, interior designers, builders, and hospitality projects. Trade pricing, priority support, and dedicated account management.",
  alternates: { canonical: "/trade-program" },
  openGraph: {
    title: `Trade Program | ${siteConfig.name}`,
    description:
      "Priority support, trade pricing, and dedicated account managers for luxury residential and hospitality projects.",
    url: `${siteConfig.url}/trade-program`,
  },
};

const audiences = [
  "Architects",
  "Interior Designers",
  "Builders",
  "Hospitality",
  "Luxury Projects",
];

const benefits = [
  {
    title: "Priority support",
    body: "Direct access to product specialists for specification, finish matching, and lead-time guidance on active jobs.",
  },
  {
    title: "Trade pricing",
    body: "Preferred net pricing on VARENO collections for registered trade partners and qualified project accounts.",
  },
  {
    title: "Dedicated account manager",
    body: "A single point of contact for multi-fixture packages, hospitality rollouts, and coordinated deliveries.",
  },
];

export default function TradeProgramPage() {
  return (
    <>
      <PageHero
        eyebrow="Trade"
        title="Built for those who specify"
        description="The VARENO Trade Program supports architects, designers, builders, and hospitality teams delivering luxury residential and commercial interiors."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Trade Program" },
        ]}
      />

      <Section tone="default" aria-labelledby="trade-audience">
        <h2
          id="trade-audience"
          className="mb-8 font-display text-3xl text-primary md:text-4xl"
        >
          Who we partner with
        </h2>
        <ul className="flex flex-wrap gap-3">
          {audiences.map((item) => (
            <li
              key={item}
              className="rounded-full border border-border bg-secondary/50 px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-primary"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface" aria-labelledby="trade-benefits">
        <h2
          id="trade-benefits"
          className="mb-10 font-display text-3xl text-primary md:text-4xl"
        >
          Program benefits
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="rounded-2xl border border-border/80 bg-background p-8 shadow-sm"
            >
              <h3 className="font-display text-2xl text-primary">
                {benefit.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {benefit.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="default" className="text-center" aria-labelledby="trade-cta">
        <h2
          id="trade-cta"
          className="font-display text-3xl text-primary md:text-4xl"
        >
          Request trade access
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Share your firm details and project type. We typically respond within
          one business day at{" "}
          <a
            href={`mailto:${siteConfig.tradeEmail}`}
            className="text-primary underline-offset-4 hover:text-accent hover:underline"
          >
            {siteConfig.tradeEmail}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/contact" variant="gold" size="lg">
            Contact Trade Concierge
          </Button>
          <Button href="/shop" variant="outline" size="lg">
            Browse Catalog
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted">
          Or{" "}
          <Link href="/contact" className="text-accent hover:underline">
            send a project inquiry
          </Link>{" "}
          through our contact form.
        </p>
      </Section>
    </>
  );
}
