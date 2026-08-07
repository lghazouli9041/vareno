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
  return Boolean(
    item.children?.some((child) => pathname === child.href.split("?")[0]),
  );
}

function NavLinkStyles({
  inverted,
  active,
}: {
  inverted?: boolean;
  active?: boolean;
}) {
  return cn(
    "relative inline-flex items-center gap-1.5 py-1 text-[10px] uppercase tracking-[0.28em] transition-colors duration-300",
    "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)]",
    "hover:after:scale-x-100",
    inverted
      ? "text-inverse-text/90 hover:text-accent"
      : "text-muted hover:text-primary",
    active && "text-accent after:scale-x-100",
  );
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
        className={NavLinkStyles({ inverted, active })}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          size={11}
          strokeWidth={1.5}
          className={cn(
            "transition-transform duration-400",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-5 transition-all duration-400",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="border border-border/80 bg-background/95 p-2 shadow-md backdrop-blur-xl">
          <ul className="space-y-0.5" role="menu">
            {item.children?.map((child) => (
              <li key={`${child.label}-${child.href}`} role="none">
                <Link
                  href={child.href}
                  role="menuitem"
                  className="block px-3 py-2.5 text-[10px] uppercase tracking-[0.22em] text-muted transition-colors duration-300 hover:bg-secondary hover:text-accent"
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
    <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
      {mainNavigation.map((item) =>
        item.children?.length ? (
          <NavDropdown key={item.label} item={item} inverted={inverted} />
        ) : (
          <Link
            key={item.label}
            href={item.href}
            className={NavLinkStyles({
              inverted,
              active: isActive(pathname, item),
            })}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
