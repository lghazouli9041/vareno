import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { getAdminCustomer } from "@/lib/admin/data";
import { formatOrderStatus } from "@/lib/orders/status";
import { formatPriceExact } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const customer = await getAdminCustomer(decodeURIComponent(id));
  if (!customer) notFound();

  const name =
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    customer.email;
  const lifetimeValue = customer.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  return (
    <div>
      <AdminPageHeader
        title={name}
        description={customer.email}
      />
      <Link
        href="/admin/customers"
        className="mb-6 inline-block text-xs uppercase tracking-[0.14em] text-muted hover:text-accent"
      >
        ← Back to customers
      </Link>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="border border-border p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            Orders
          </p>
          <p className="mt-2 font-display text-3xl">{customer.orders.length}</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            Lifetime value
          </p>
          <p className="mt-2 font-display text-3xl">
            {formatPriceExact(lifetimeValue)}
          </p>
          <p className="mt-1 text-xs text-muted">Placeholder metric</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            Addresses
          </p>
          <p className="mt-2 font-display text-3xl">
            {customer.addresses.length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-border p-5">
          <h2 className="font-display text-2xl">Order history</h2>
          <ul className="mt-4 divide-y divide-border">
            {customer.orders.map((order) => (
              <li key={order.id} className="flex justify-between gap-3 py-3 text-sm">
                <div>
                  <Link
                    href={`/admin/orders/${order.orderNumber}`}
                    className="hover:text-accent"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {formatOrderStatus(order.status)}
                  </p>
                </div>
                <p>{formatPriceExact(Number(order.total), order.currency)}</p>
              </li>
            ))}
            {customer.orders.length === 0 && (
              <li className="py-6 text-sm text-muted">No orders yet.</li>
            )}
          </ul>
        </section>

        <section className="border border-border p-5">
          <h2 className="font-display text-2xl">Addresses</h2>
          <ul className="mt-4 space-y-4">
            {customer.addresses.map((address) => (
              <li key={address.id} className="text-sm leading-relaxed text-muted">
                <p className="text-primary">
                  {address.firstName} {address.lastName}
                  {address.isDefault ? " · Default" : ""}
                </p>
                {address.line1}
                <br />
                {address.city}, {address.state} {address.postalCode}
              </li>
            ))}
            {customer.addresses.length === 0 && (
              <li className="text-sm text-muted">No addresses on file.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
