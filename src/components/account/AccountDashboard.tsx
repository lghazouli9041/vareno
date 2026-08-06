"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { memo, useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import {
  Heart,
  MapPin,
  Package,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AccountOrder } from "@/lib/account/order-view";
import { readRecentlyViewedSlugs } from "@/lib/recently-viewed";
import { useAddressBookStore } from "@/store/address-book";
import { useWishlistStore } from "@/store/wishlist";

const OrdersList = dynamic(
  () =>
    import("@/components/account/OrdersList").then((mod) => mod.OrdersList),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 animate-pulse border border-border bg-surface" />
    ),
  },
);

interface AccountDashboardProps {
  firstName: string | null;
  email: string | null;
  orders: AccountOrder[];
  addressCount: number;
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-border bg-background p-5 transition-colors hover:border-accent/50"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
          {label}
        </p>
        <ArrowUpRight
          size={14}
          strokeWidth={1.5}
          className="text-muted transition-colors group-hover:text-accent"
        />
      </div>
      <p className="mt-3 font-display text-3xl text-primary">{value}</p>
    </Link>
  );
}

function AccountDashboardComponent({
  firstName,
  email,
  orders,
  addressCount,
}: AccountDashboardProps) {
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const localAddresses = useAddressBookStore((s) => s.addresses.length);
  const [recentCount, setRecentCount] = useState(0);

  useEffect(() => {
    setRecentCount(readRecentlyViewedSlugs().length);
  }, []);

  const greeting = firstName
    ? `Welcome back, ${firstName}`
    : email
      ? `Welcome back`
      : "Welcome";

  const savedAddresses = Math.max(localAddresses, addressCount);
  const recentOrders = orders.slice(0, 2);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-4xl text-primary md:text-5xl">
            {greeting}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Your private atelier for orders, saved pieces, and household
            details.
          </p>
        </div>
        <SignOutButton>
          <Button type="button" variant="outline" size="sm">
            Sign Out
          </Button>
        </SignOutButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders" value={orders.length} href="/account/orders" />
        <StatCard
          label="Wishlist"
          value={wishlistCount}
          href="/account/wishlist"
        />
        <StatCard
          label="Recently viewed"
          value={recentCount}
          href="/account/recently-viewed"
        />
        <StatCard
          label="Addresses"
          value={savedAddresses}
          href="/account/addresses"
        />
      </div>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
              Latest
            </p>
            <h2 className="mt-1 font-display text-2xl text-primary md:text-3xl">
              Recent orders
            </h2>
          </div>
          <Link
            href="/account/orders"
            className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
          >
            View all
          </Link>
        </div>
        <OrdersList orders={recentOrders} />
      </section>

      <section className="mt-12">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
          Quick actions
        </p>
        <h2 className="mt-1 font-display text-2xl text-primary">Continue</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              href: "/shop",
              label: "Browse collection",
              icon: Package,
            },
            {
              href: "/account/wishlist",
              label: "Review wishlist",
              icon: Heart,
            },
            {
              href: "/account/recently-viewed",
              label: "Recently viewed",
              icon: Eye,
            },
            {
              href: "/account/addresses",
              label: "Manage addresses",
              icon: MapPin,
            },
          ].map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className="flex items-center gap-3 border border-border px-4 py-4 text-sm text-primary transition-colors hover:border-accent hover:text-accent"
              >
                <action.icon size={16} strokeWidth={1.5} />
                {action.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Button href="/account/profile" variant="outline" size="sm">
            Edit profile
          </Button>
        </div>
      </section>
    </div>
  );
}

export const AccountDashboard = memo(AccountDashboardComponent);
