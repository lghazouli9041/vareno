"use client";

import { cn } from "@/lib/utils";

export function ShopSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <ul
      className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="animate-pulse">
          <div className="aspect-[3/4] bg-surface" />
          <div className="mt-5 h-2 w-20 bg-border" />
          <div className="mt-3 h-6 w-3/4 bg-border" />
          <div className="mt-3 h-3 w-24 bg-border/80" />
          <div className="mt-4 h-5 w-16 bg-border" />
        </li>
      ))}
    </ul>
  );
}

interface ShopPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ShopPagination({
  page,
  totalPages,
  onPageChange,
}: ShopPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-2"
      aria-label="Catalog pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={cn(
          "border border-border px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors",
          page === 1
            ? "cursor-not-allowed opacity-30"
            : "text-primary hover:border-accent hover:text-accent",
        )}
      >
        Prev
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPageChange(item)}
          className={cn(
            "min-w-10 border px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors",
            item === page
              ? "border-primary bg-primary text-inverse-text"
              : "border-border text-primary hover:border-accent hover:text-accent",
          )}
          aria-current={item === page ? "page" : undefined}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={cn(
          "border border-border px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors",
          page === totalPages
            ? "cursor-not-allowed opacity-30"
            : "text-primary hover:border-accent hover:text-accent",
        )}
      >
        Next
      </button>
    </nav>
  );
}
