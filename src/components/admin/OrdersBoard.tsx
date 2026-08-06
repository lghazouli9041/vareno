"use client";

import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { formatOrderStatus } from "@/lib/orders/status";
import { formatPriceExact, cn } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  currency: string;
  customerEmail: string;
  itemCount: number;
};

function OrdersBoardComponent({ orders }: { orders: AdminOrderRow[] }) {
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (!q) return true;
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q)
      );
    });
  }, [orders, status, query]);

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="Monitor fulfillment, payment status, and customer purchases."
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order or email"
          className="min-w-[220px] flex-1 border border-border bg-secondary/30 px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="border border-border bg-secondary/30 px-3 py-2.5 text-sm"
        >
          <option value="all">All statuses</option>
          {(
            [
              "PENDING",
              "PAID",
              "PROCESSING",
              "SHIPPED",
              "DELIVERED",
              "CANCELLED",
              "REFUNDED",
            ] as OrderStatus[]
          ).map((value) => (
            <option key={value} value={value}>
              {formatOrderStatus(value)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-border/80 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.orderNumber}`}
                    className="font-medium hover:text-accent"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(new Date(order.createdAt))}
                </td>
                <td className="px-4 py-3">{order.customerEmail}</td>
                <td className="px-4 py-3">
                  <span className={cn("border border-border px-2 py-1 text-[10px] uppercase tracking-[0.12em]")}>
                    {formatOrderStatus(order.status)}
                  </span>
                </td>
                <td className="px-4 py-3">{order.itemCount}</td>
                <td className="px-4 py-3">
                  {formatPriceExact(order.total, order.currency)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No orders match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const OrdersBoard = memo(OrdersBoardComponent);
