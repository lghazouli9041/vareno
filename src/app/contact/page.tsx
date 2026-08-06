import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact VARENO concierge for product questions, trade inquiries, and luxury project support. Showroom hours and business contact details.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description:
      "Reach VARENO for residential concierge and trade project inquiries.",
    url: `${siteConfig.url}/contact`,
  },
};

const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 6:00 PM ET" },
  { day: "Saturday", time: "10:00 AM – 4:00 PM ET" },
  { day: "Sunday", time: "Closed" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Concierge"
        title="Visit the conversation"
        description="A luxury showroom experience—whether you are specifying a single vanity or an entire residence. We respond with clarity, finish guidance, and project-minded support."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      <Container className="grid gap-12 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-20">
        <aside className="space-y-10" aria-labelledby="contact-details">
          <div>
            <h2
              id="contact-details"
              className="font-display text-3xl text-primary"
            >
              Showroom & concierge
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.zip}
              <br />
              {siteConfig.address.country}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-accent">
              Business hours
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {hours.map((row) => (
                <li
                  key={row.day}
                  className="flex justify-between gap-4 border-b border-border/70 py-2"
                >
                  <span>{row.day}</span>
                  <span className="text-primary">{row.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <p>
              <span className="text-[11px] uppercase tracking-[0.18em] text-accent">
                General
              </span>
              <br />
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="text-primary hover:text-accent"
              >
                {siteConfig.supportEmail}
              </a>
            </p>
            <p>
              <span className="text-[11px] uppercase tracking-[0.18em] text-accent">
                Trade inquiries
              </span>
              <br />
              <a
                href={`mailto:${siteConfig.tradeEmail}`}
                className="text-primary hover:text-accent"
              >
                {siteConfig.tradeEmail}
              </a>
            </p>
            <p>
              <span className="text-[11px] uppercase tracking-[0.18em] text-accent">
                Phone
              </span>
              <br />
              <a
                href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                className="text-primary hover:text-accent"
              >
                {siteConfig.phone}
              </a>
            </p>
          </div>
        </aside>

        <div>
          <h2 className="mb-6 font-display text-3xl text-primary">
            Send a message
          </h2>
          <ContactForm />
        </div>
      </Container>
    </>
  );
}
