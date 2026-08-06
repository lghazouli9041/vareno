import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { AccountSection } from "@/components/account/AccountSection";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { getOrderForEmail } from "@/lib/account/data";
import { toAccountOrder } from "@/lib/account/order-view";
import { getPrimaryEmail, requireUser } from "@/lib/auth/session";
import { formatPriceExact } from "@/lib/utils";

type OrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function AccountOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const user = await requireUser();
  const email = getPrimaryEmail(user);
  if (!email) notFound();

  const raw = await getOrderForEmail(orderNumber, email);
  if (!raw) notFound();
  const order = await toAccountOrder(raw);

  return (
    <AccountSection
      title={order.orderNumber}
      eyebrow="Order"
      description={`Placed ${new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(new Date(order.createdAt))}`}
      actions={<OrderStatusBadge status={order.status} />}
    >
      <div className="mb-8">
        <Link
          href="/account/orders"
          className="text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
        >
          ← Back to orders
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="border border-border bg-background p-5 md:p-7">
          <h2 className="font-display text-2xl text-primary">Items</h2>
          <ul className="mt-5 space-y-5">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 border-b border-border/70 pb-5 last:border-0 last:pb-0"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-surface">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-muted">
                      <Package size={18} strokeWidth={1.4} />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {item.slug ? (
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-display text-xl text-primary transition-colors hover:text-accent"
                    >
                      {item.productName}
                    </Link>
                  ) : (
                    <p className="font-display text-xl text-primary">
                      {item.productName}
                    </p>
                  )}
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                    {item.finish} · Qty {item.quantity}
                  </p>
                  <p className="mt-2 text-sm text-primary">
                    {formatPriceExact(
                      item.unitPrice * item.quantity,
                      order.currency,
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-6">
          <section className="border border-border bg-background p-5 md:p-7">
            <h2 className="font-display text-2xl text-primary">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatPriceExact(order.subtotal, order.currency)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Shipping</dt>
                <dd>{formatPriceExact(order.shipping, order.currency)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Tax</dt>
                <dd>{formatPriceExact(order.tax, order.currency)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="font-medium text-primary">Total</dt>
                <dd className="font-display text-xl text-primary">
                  {formatPriceExact(order.total, order.currency)}
                </dd>
              </div>
            </dl>
            <div className="mt-6 space-y-2">
              <Button type="button" variant="outline" size="sm" className="w-full" disabled>
                Download invoice
              </Button>
              <Button type="button" variant="ghost" size="sm" className="w-full" disabled>
                Track shipment
              </Button>
              <p className="text-center text-[11px] text-muted">
                Invoice & tracking placeholders
              </p>
            </div>
          </section>

          {(raw.shippingAddress || raw.billingAddress) && (
            <section className="border border-border bg-background p-5 md:p-7">
              <h2 className="font-display text-2xl text-primary">Addresses</h2>
              <div className="mt-4 space-y-5 text-sm text-muted">
                {raw.shippingAddress && (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-accent">
                      Shipping
                    </p>
                    <p className="mt-2 leading-relaxed">
                      {raw.shippingAddress.firstName}{" "}
                      {raw.shippingAddress.lastName}
                      <br />
                      {raw.shippingAddress.line1}
                      {raw.shippingAddress.line2 ? (
                        <>
                          <br />
                          {raw.shippingAddress.line2}
                        </>
                      ) : null}
                      <br />
                      {raw.shippingAddress.city}, {raw.shippingAddress.state}{" "}
                      {raw.shippingAddress.postalCode}
                    </p>
                  </div>
                )}
                {raw.billingAddress && (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-accent">
                      Billing
                    </p>
                    <p className="mt-2 leading-relaxed">
                      {raw.billingAddress.firstName}{" "}
                      {raw.billingAddress.lastName}
                      <br />
                      {raw.billingAddress.line1}
                      <br />
                      {raw.billingAddress.city}, {raw.billingAddress.state}{" "}
                      {raw.billingAddress.postalCode}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </AccountSection>
  );
}
