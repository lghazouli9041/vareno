import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Section } from "@/components/layout/Section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "VARENO shipping, delivery, inspection, and returns for luxury kitchen and bathroom faucets across the United States.",
  alternates: { canonical: "/shipping-returns" },
  openGraph: {
    title: `Shipping & Returns | ${siteConfig.name}`,
    description:
      "Luxury delivery standards, order processing timelines, inspection guidance, and returns for VARENO fixtures.",
    url: `${siteConfig.url}/shipping-returns`,
  },
};

const sections = [
  {
    id: "delivery",
    title: "Luxury delivery",
    body: `Complimentary ground shipping on qualifying orders over $${siteConfig.shipping.freeThreshold} within the contiguous United States. Standard delivery typically arrives in ${siteConfig.shipping.standardDays} business days. Express options (${siteConfig.shipping.expressDays} days) are available at checkout when inventory allows.`,
  },
  {
    id: "processing",
    title: "Order processing",
    body: "In-stock finishes usually leave our fulfillment partners within two business days. Made-to-order and specialty finishes may require additional lead time—your confirmation email includes the projected ship window before payment captures for custom work.",
  },
  {
    id: "inspection",
    title: "Inspection process",
    body: "Inspect packaging on arrival. Photograph any transit damage before opening. Verify finish, SKU, and contents against your packing list within 48 hours so we can resolve issues quickly with carriers and our warehouse.",
  },
  {
    id: "returns",
    title: "Returns",
    body: "Uninstalled products in original packaging may be returned within 30 days of delivery. Custom finishes and installed fixtures are final sale unless defective. Contact concierge for an RMA—unauthorized returns cannot be accepted.",
  },
];

export default function ShippingReturnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Logistics"
        title="Shipping & Returns"
        description="White-glove care from warehouse to vanity. Clear timelines, careful packing, and a returns process built for premium fixtures."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shipping & Returns" },
        ]}
      />

      <Section tone="default" aria-labelledby="shipping-details">
        <h2 id="shipping-details" className="sr-only">
          Shipping and returns details
        </h2>
        <ul className="mx-auto max-w-3xl space-y-10">
          {sections.map((section) => (
            <li key={section.id} className="border-b border-border pb-10 last:border-0">
              <h3 className="font-display text-2xl text-primary md:text-3xl">
                {section.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {section.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
