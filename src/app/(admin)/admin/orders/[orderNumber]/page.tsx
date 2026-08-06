import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/Button";
import { getAdminOrder } from "@/lib/admin/data";
import { formatOrderStatus } from "@/lib/orders/status";
import { formatPriceExact } from "@/lib/utils";

type Props = { params: Promise<{ orderNumber: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await getAdminOrder(decodeURIComponent(orderNumber));
  if (!order) notFound();

  const timeline = [
    { label: "Order created", at: order.createdAt },
    { label: `Status · ${formatOrderStatus(order.status)}`, at: order.updatedAt },
    { label: "Fulfillment placeholder", at: null },
    { label: "Invoice placeholder", at: null },
  ];

  return (
    <div>
      <AdminPageHeader
        title={order.orderNumber}
        description={`Placed ${new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(order.createdAt)}`}
        actions={
          <>
            <Button type="button" variant="outline" size="sm" disabled>
              Invoice
            </Button>
            <Button type="button" variant="outline" size="sm" disabled>
              Fulfill
            </Button>
          </>
        }
      />

      <Link
        href="/admin/orders"
        className="mb-6 inline-block text-xs uppercase tracking-[0.14em] text-muted hover:text-accent"
      >
        ← Back to orders
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border border-border p-5">
          <h2 className="font-display text-2xl">Items</h2>
          <ul className="mt-4 divide-y divide-border">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <div>
                  <p className="text-primary">{item.productName}</p>
                  <p className="mt-1 text-xs text-muted">
                    {item.finish} · Qty {item.quantity}
                  </p>
                </div>
                <p>
                  {formatPriceExact(
                    Number(item.unitPrice) * item.quantity,
                    order.currency,
                  )}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPriceExact(Number(order.subtotal), order.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{formatPriceExact(Number(order.shipping), order.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Tax</dt>
              <dd>{formatPriceExact(Number(order.tax), order.currency)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="font-medium">Total</dt>
              <dd className="font-display text-xl">
                {formatPriceExact(Number(order.total), order.currency)}
              </dd>
            </div>
          </dl>
        </section>

        <div className="space-y-6">
          <section className="border border-border p-5">
            <h2 className="font-display text-2xl">Customer</h2>
            <p className="mt-3 text-sm text-primary">{order.customerEmail}</p>
            {order.customer && (
              <Link
                href={`/admin/customers/${order.customer.id}`}
                className="mt-3 inline-block text-[11px] uppercase tracking-[0.14em] text-accent"
              >
                View customer
              </Link>
            )}
            {order.shippingAddress && (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
                <br />
                {order.shippingAddress.line1}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
            )}
          </section>

          <section className="border border-border p-5">
            <h2 className="font-display text-2xl">Timeline</h2>
            <ol className="mt-4 space-y-4">
              {timeline.map((event) => (
                <li key={event.label} className="border-l border-border pl-4">
                  <p className="text-sm text-primary">{event.label}</p>
                  <p className="mt-1 text-xs text-muted">
                    {event.at
                      ? new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(event.at)
                      : "Pending"}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
