import type { Metadata } from "next";
import { WishlistView } from "@/components/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  description:
    "Your saved VARENO pieces—architectural faucets curated for your interior.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return <WishlistView />;
}
