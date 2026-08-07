import type { Metadata } from "next";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact VARENO concierge—showroom, WhatsApp, email, and project inquiries for luxury brass fixtures.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description:
      "Reach the VARENO atelier for residential and trade inquiries.",
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return <ContactExperience />;
}
