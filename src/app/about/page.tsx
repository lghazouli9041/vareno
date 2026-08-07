import type { Metadata } from "next";
import { AboutExperience } from "@/components/about/AboutExperience";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About VARENO",
  description:
    "The VARENO philosophy—handcrafted solid brass fixtures for extraordinary European-minded homes.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description:
      "Discover the maison behind VARENO handmade brass faucets and accessories.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return <AboutExperience />;
}
