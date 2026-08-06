import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your VARENO order with a secure, concierge-inspired checkout experience.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
  openGraph: {
    title: `Checkout | ${siteConfig.name}`,
    description: "Review your selection and complete your luxury faucet order.",
    url: `${siteConfig.url}/checkout`,
  },
};

type CheckoutPageProps = {
  searchParams: Promise<{ cancelled?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  return <CheckoutView cancelled={params.cancelled === "true"} />;
}
