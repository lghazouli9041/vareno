import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-28 pb-20">
      <div className="max-w-lg text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
          Checkout
        </p>
        <h1 className="mt-3 font-display text-4xl text-primary md:text-5xl">
          Payment cancelled
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Your bag is unchanged. You can resume checkout whenever you are ready,
          or continue browsing the collection.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/checkout" variant="gold">
            Return to checkout
          </Button>
          <Button href="/cart" variant="outline">
            View cart
          </Button>
        </div>
        <Link
          href="/shop"
          className="mt-6 inline-block text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
