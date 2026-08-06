"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Boxes,
  FolderKanban,
  LayoutDashboard,
  Menu,
  MessageSquareQuote,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/collections", label: "Collections", icon: FolderKanban },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/discounts", label: "Discounts", icon: Percent },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="space-y-0.5">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 text-[12px] uppercase tracking-[0.12em] transition-colors",
              active
                ? "bg-primary text-inverse-text"
                : "text-muted hover:bg-secondary hover:text-primary",
            )}
          >
            <Icon size={15} strokeWidth={1.5} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex bg-background text-primary">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="border-b border-border px-5 py-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
            VARENO
          </p>
          <p className="mt-1 font-display text-2xl">Admin</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
          >
            ← Storefront
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border px-4 lg:px-8">
          <button
            type="button"
            className="border border-border p-2 text-primary lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open admin menu"
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
            Commerce console
          </p>
          <Link
            href="/account"
            className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
          >
            Account
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-10 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-primary/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <p className="font-display text-xl">Admin</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-2"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
