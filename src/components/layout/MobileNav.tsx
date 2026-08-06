"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { mainNavigation, type NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

function MobileNavGroup({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(
    Boolean(item.children?.some((child) => child.href === pathname)),
  );
  const panelId = useId();

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "block border-b border-border py-4 text-sm uppercase tracking-[0.18em] transition-colors",
          pathname === item.href ? "text-accent" : "text-primary hover:text-accent",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-sm uppercase tracking-[0.18em] text-primary"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((value) => !value)}
      >
        {item.label}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn(
            "text-muted transition-transform duration-300",
            expanded && "rotate-180",
          )}
        />
      </button>
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <ul className="overflow-hidden">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "block py-3 pl-3 text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent",
                  pathname === child.href && "text-accent",
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <span className="font-display text-xl uppercase tracking-[0.15em] text-primary">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-primary transition-colors hover:text-accent"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Mobile">
          {mainNavigation.map((item) => (
            <MobileNavGroup key={item.href} item={item} onNavigate={onClose} />
          ))}
        </nav>

        <div className="flex flex-col gap-4 border-t border-border px-6 py-6">
          <Link
            href="/wishlist"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
          >
            Wishlist
          </Link>
          <Link
            href="/compare"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
          >
            Compare
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
          >
            Contact Concierge
          </Link>
        </div>
      </aside>
    </div>
  );
}
