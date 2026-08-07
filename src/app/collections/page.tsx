import type { Metadata } from "next";
import { CollectionsShowcase } from "@/components/collections/CollectionsShowcase";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore VARENO kitchen, bathroom, accessories, and new brass collections—handcrafted for extraordinary homes.",
  alternates: { canonical: "/collections" },
  openGraph: {
    title: `Collections | ${siteConfig.name}`,
    description:
      "Luxury brass collections for kitchen, bath, and the details between.",
    url: `${siteConfig.url}/collections`,
  },
};

export default function CollectionsPage() {
  return <CollectionsShowcase />;
}
