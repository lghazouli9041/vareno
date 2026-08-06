"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const RECENT_KEY = "hajamed-shop-recent-searches";

interface ShopSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export function ShopSearch({
  value,
  onChange,
  className,
  id = "shop-search",
}: ShopSearchProps) {
  const [recent, setRecent] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      setRecent(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setRecent([]);
    }
  }, []);

  const persistRecent = (term: string) => {
    const cleaned = term.trim();
    if (cleaned.length < 2) return;
    const next = [
      cleaned,
      ...recent.filter((item) => item.toLowerCase() !== cleaned.toLowerCase()),
    ].slice(0, 6);
    setRecent(next);
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const showRecent = focused && !value.trim() && recent.length > 0;

  const emptyHint = useMemo(() => {
    if (!value.trim()) return null;
    return "Keep typing to refine — results update instantly.";
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <label
        htmlFor={id}
        className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-primary"
      >
        Search
      </label>
      <div className="relative">
        <Search
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setFocused(false), 150);
            persistRecent(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") persistRecent(value);
          }}
          placeholder="Search by name, finish, collection…"
          className="w-full border border-border bg-secondary/40 py-3 pl-10 pr-10 text-sm text-primary outline-none transition-colors placeholder:text-muted focus:border-primary"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted transition-colors hover:text-primary"
            aria-label="Clear search"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {emptyHint && (
        <p className="mt-2 text-xs text-muted">{emptyHint}</p>
      )}

      {showRecent && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 border border-border bg-background p-3 shadow-md"
          role="listbox"
          aria-label="Recent searches"
        >
          <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-muted">
            Recent
          </p>
          <ul className="space-y-1">
            {recent.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  className="w-full px-2 py-1.5 text-left text-sm text-primary transition-colors hover:bg-secondary"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onChange(term)}
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
