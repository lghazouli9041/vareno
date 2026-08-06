import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description:
    "Review your VARENO selection—architectural faucets reserved for your interior.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartView />;
}
