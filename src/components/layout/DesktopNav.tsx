"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { mainNavigation, type NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface DesktopNavProps {
  inverted?: boolean;
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  if (pathname === item.href) return true;
  return Boolean(item.children?.some((child) => pathname === child.href));
}

function NavDropdown({
  item,
  inverted,
}: {
  item: NavItem;
  inverted?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = isActive(pathname, item);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300",
          inverted
            ? "text-inverse-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] hover:text-accent"
            : "text-muted hover:text-accent",
          active && "text-accent",
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          size={12}
          strokeWidth={1.5}
          className={cn(
            "transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-4 transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="rounded-lg border border-border bg-background/95 p-3 shadow-md backdrop-blur-md">
          <ul className="space-y-0.5" role="menu">
            {item.children?.map((child) => (
              <li key={child.href} role="none">
                <Link
                  href={child.href}
                  role="menuitem"
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:bg-secondary hover:text-accent",
                    pathname === child.href && "bg-secondary text-accent",
                  )}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function DesktopNav({ inverted = false }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="hidden items-center gap-9 lg:flex"
      aria-label="Primary"
    >
      {mainNavigation.map((item) =>
        item.children?.length ? (
          <NavDropdown key={item.href} item={item} inverted={inverted} />
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-[11px] uppercase tracking-[0.2em] transition-colors duration-300",
              inverted
                ? "text-inverse-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] hover:text-accent"
                : "text-muted hover:text-accent",
              isActive(pathname, item) && "text-accent",
            )}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
