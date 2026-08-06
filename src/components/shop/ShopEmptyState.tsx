"use client";

import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ShopEmptyStateProps {
  onReset: () => void;
  hasQuery?: boolean;
}

export function ShopEmptyState({ onReset, hasQuery }: ShopEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-24 text-center md:py-28">
      <span
        className="mb-6 flex h-16 w-16 items-center justify-center border border-border text-accent"
        aria-hidden="true"
      >
        <PackageSearch size={28} strokeWidth={1.5} />
      </span>
      <h2 className="font-display text-3xl text-primary md:text-4xl">
        {hasQuery ? "No matches found" : "No fixtures match"}
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        {hasQuery
          ? "Try a different search term, or clear filters to explore the full collection."
          : "Adjust your filters to broaden the selection — or reset to view every VARENO fixture."}
      </p>
      <Button type="button" variant="outline" className="mt-8" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}
