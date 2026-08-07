import type { Metadata } from "next";
import { CraftsmanshipStory } from "@/components/craftsmanship/CraftsmanshipStory";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Craftsmanship",
  description:
    "Discover the VARENO atelier process—traditional casting, hand engraving, polishing, inspection, and white-glove packaging.",
  alternates: { canonical: "/craftsmanship" },
  openGraph: {
    title: `Craftsmanship | ${siteConfig.name}`,
    description:
      "How VARENO handcrafts solid brass fixtures for extraordinary homes.",
    url: `${siteConfig.url}/craftsmanship`,
  },
};

export default function CraftsmanshipPage() {
  return <CraftsmanshipStory />;
}
