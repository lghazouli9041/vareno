import Link from "next/link";
import { formatOrderStatus } from "@/lib/orders/status";
import { formatPriceExact } from "@/lib/utils";
import type { Order, OrderItem } from "@prisma/client";

type OrderRow = Order & { items: OrderItem[] };

interface OrdersTableProps {
  orders: OrderRow[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-background px-6 py-10 text-center shadow-sm">
        <p className="font-display text-2xl text-primary">No orders yet</p>
        <p className="mt-2 text-sm text-muted">
          When you complete a purchase, it will appear here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-hover"
        >
          Shop Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/50 text-[11px] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border/80 last:border-0"
              >
                <td className="px-5 py-4 font-medium text-primary">
                  {order.orderNumber}
                </td>
                <td className="px-5 py-4 text-muted">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(order.createdAt)}
                </td>
                <td className="px-5 py-4 text-primary">
                  {formatOrderStatus(order.status)}
                </td>
                <td className="px-5 py-4 text-primary">
                  {formatPriceExact(Number(order.total), order.currency)}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="text-xs uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-hover"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
