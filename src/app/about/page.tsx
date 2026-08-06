import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About VARENO",
  description:
    "Discover VARENO—architectural faucets crafted for designers, architects, and refined American homes. Craftsmanship, materials, and timeless design.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description:
      "VARENO creates architectural faucets engineered for timeless American interiors.",
    url: `${siteConfig.url}/about`,
  },
};

const pillars = [
  {
    title: "Craftsmanship",
    body: "Solid brass foundations, ceramic disc precision, and finishes calibrated for architectural light—built to be touched every day for decades.",
  },
  {
    title: "Design",
    body: "Silhouettes edited like instrument design. Every spout, handle, and proportion is composed for interiors that value clarity over ornament.",
  },
  {
    title: "Materials",
    body: "PVD finishes, enduring alloys, and hardware specified for residential luxury and hospitality performance alike.",
  },
  {
    title: "Timeless Interiors",
    body: "VARENO is specified when a room must feel permanent—quiet luxury that photographs as beautifully as it lives.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Architectural faucets for timeless living"
        description="VARENO is a premium American luxury faucet brand for architects, designers, and homeowners who demand material integrity and enduring form."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      <Section tone="default" aria-labelledby="about-mission">
        <div className="mx-auto max-w-3xl">
          <h2
            id="about-mission"
            className="font-display text-3xl text-primary md:text-4xl"
          >
            Crafted for the American market
          </h2>
          <div className="gold-line mt-6" aria-hidden="true" />
          <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
            From New York showrooms to West Coast residences, VARENO fixtures
            are engineered for the way refined American homes actually live—
            generous clearances, WaterSense-minded flow where appropriate, and
            finishes that hold their composure through daily ritual.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            We partner with interior designers, architects, builders, and
            hospitality teams who specify detail at every scale. The result is
            a catalog that feels like a material library: Heritage warmth,
            Signature clarity, Imperial presence, Atelier precision, and Element
            restraint.
          </p>
        </div>
      </Section>

      <Section tone="surface" aria-labelledby="about-pillars">
        <h2
          id="about-pillars"
          className="mb-10 text-center font-display text-3xl text-primary md:text-4xl"
        >
          What we stand for
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <li
              key={pillar.title}
              className="rounded-2xl border border-border/80 bg-background p-8 shadow-sm"
            >
              <h3 className="font-display text-2xl text-primary">
                {pillar.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {pillar.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Container className="pb-20">
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-muted">
          {siteConfig.tagline}. Based in {siteConfig.address.city},{" "}
          {siteConfig.address.state}—serving projects across the United States.
        </p>
      </Container>
    </>
  );
}
