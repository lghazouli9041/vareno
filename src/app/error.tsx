"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-accent">
        VARENO
      </p>
      <h1 className="mt-4 font-display text-4xl text-primary md:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        We could not complete this request. Please try again.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" variant="gold" onClick={() => reset()}>
          Try again
        </Button>
        <Button href="/" variant="outline">
          Back home
        </Button>
      </div>
      <p className="mt-6 text-xs text-muted">
        Or{" "}
        <Link href="/contact" className="text-accent underline-offset-4 hover:underline">
          contact concierge
        </Link>
        .
      </p>
    </div>
  );
}
