import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Lifetime Limited Warranty",
  description:
    "VARENO Lifetime Limited Warranty coverage for architectural faucets—function, finish, and premium support for residential use.",
  alternates: { canonical: "/warranty" },
  openGraph: {
    title: `Warranty | ${siteConfig.name}`,
    description:
      "Lifetime Limited Warranty details and premium support for VARENO fixtures.",
    url: `${siteConfig.url}/warranty`,
  },
};

const coverage = [
  {
    title: "Function",
    body: "Ceramic disc cartridges and mechanical performance are warranted against manufacturing defects for the life of the product under normal residential use.",
  },
  {
    title: "Finish",
    body: "PVD and specialty finishes are covered against peeling, blistering, and manufacturing defects. Proper care is required; abrasive cleaners void finish coverage.",
  },
  {
    title: "What is not covered",
    body: "Improper installation, misuse, hard-water calcification from lack of maintenance, and commercial wear outside agreed trade terms.",
  },
];

export default function WarrantyPage() {
  return (
    <>
      <PageHero
        eyebrow="Assurance"
        title="Lifetime Limited Warranty"
        description="VARENO stands behind every fixture with coverage designed for enduring residential performance—and support that matches a luxury purchase."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Warranty" },
        ]}
      />

      <Section tone="default" aria-labelledby="warranty-coverage">
        <h2
          id="warranty-coverage"
          className="mb-10 font-display text-3xl text-primary md:text-4xl"
        >
          Coverage explained
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {coverage.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-border/80 bg-background p-8 shadow-sm"
            >
              <h3 className="font-display text-2xl text-primary">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface" aria-labelledby="warranty-support">
        <div className="mx-auto max-w-3xl">
          <h2
            id="warranty-support"
            className="font-display text-3xl text-primary md:text-4xl"
          >
            Premium support
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Should you need service, our concierge team will guide diagnosis,
            replacement parts, and authorized repair paths. Keep your order
            confirmation and SKU available—most residential claims are resolved
            without returning the full fixture.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Trade and hospitality warranties may include project-specific terms.
            Contact{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="text-primary underline-offset-4 hover:text-accent hover:underline"
            >
              {siteConfig.supportEmail}
            </a>{" "}
            for documentation.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="gold">
              Start a Warranty Request
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
