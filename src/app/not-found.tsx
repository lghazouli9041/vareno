import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-accent">
        VARENO
      </p>
      <h1 className="mt-4 font-display text-4xl text-primary md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        This page is no longer available or the link may be incorrect.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href="/shop" variant="gold">
          Browse shop
        </Button>
        <Button href="/" variant="outline">
          Back home
        </Button>
      </div>
      <p className="mt-6 text-xs text-muted">
        Need help?{" "}
        <Link
          href="/contact"
          className="text-accent underline-offset-4 hover:underline"
        >
          Contact concierge
        </Link>
        .
      </p>
    </div>
  );
}
