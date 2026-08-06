"use client";

import Link from "next/link";
import { memo } from "react";
import { OrderCard } from "@/components/account/OrderCard";
import type { AccountOrder } from "@/lib/account/order-view";

interface OrdersListProps {
  orders: AccountOrder[];
  emptyHref?: string;
}

function OrdersListComponent({
  orders,
  emptyHref = "/shop",
}: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="border border-border bg-background px-6 py-14 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
          Orders
        </p>
        <p className="mt-3 font-display text-3xl text-primary">No orders yet</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          When you complete a purchase, your VARENO order history will appear
          here.
        </p>
        <Link
          href={emptyHref}
          className="mt-7 inline-block text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-hover"
        >
          Shop Collection
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-5">
      {orders.map((order) => (
        <li key={order.id}>
          <OrderCard order={order} />
        </li>
      ))}
    </ul>
  );
}

export const OrdersList = memo(OrdersListComponent);
