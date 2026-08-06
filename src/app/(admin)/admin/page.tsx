import Link from "next/link";
import { AdminChart } from "@/components/admin/AdminChart";
import { AdminKpiCard, AdminPageHeader } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/Button";
import { getProductionAnalytics } from "@/lib/admin/analytics";
import { getAdminOrders } from "@/lib/admin/data";
import { formatOrderStatus } from "@/lib/orders/status";
import { formatPriceExact } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [analytics, orders] = await Promise.all([
    getProductionAnalytics(),
    getAdminOrders(),
  ]);
  const recent = orders.slice(0, 6);
  const { kpis, revenueSeries, ordersSeries, topProducts } = analytics;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="A clear view of VARENO commerce performance."
        actions={
          <>
            <Button href="/admin/products/new" variant="gold" size="sm">
              Create product
            </Button>
            <Button href="/admin/orders" variant="outline" size="sm">
              View orders
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminKpiCard
          label="Revenue"
          value={formatPriceExact(kpis.revenue)}
        />
        <AdminKpiCard label="Orders" value={String(kpis.orders)} />
        <AdminKpiCard label="Customers" value={String(kpis.customers)} />
        <AdminKpiCard label="Products" value={String(kpis.products)} />
        <AdminKpiCard
          label="Average order value"
          value={formatPriceExact(kpis.averageOrderValue)}
        />
        <AdminKpiCard
          label="Conversion"
          value={
            kpis.conversion == null ? "—" : `${kpis.conversion.toFixed(1)}%`
          }
          hint="Orders ÷ customers"
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <AdminChart
          title="Revenue"
          points={revenueSeries}
          valueFormat="currency"
        />
        <AdminChart title="Orders" points={ordersSeries} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="border border-border">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-2xl">Recent activity</h2>
            <Link
              href="/admin/orders"
              className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-accent"
            >
              All orders
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-sm text-muted">
              No orders yet. New checkouts will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 text-sm"
                >
                  <div>
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="font-medium text-primary hover:text-accent"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {order.customerEmail} · {formatOrderStatus(order.status)}
                    </p>
                  </div>
                  <p className="font-display text-lg">
                    {formatPriceExact(Number(order.total), order.currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-border">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display text-2xl">Top products</h2>
          </div>
          {topProducts.length === 0 ? (
            <p className="px-5 py-10 text-sm text-muted">
              Product rankings appear once orders are placed.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {topProducts.map((product) => (
                <li
                  key={product.name}
                  className="flex items-center justify-between gap-3 px-5 py-4 text-sm"
                >
                  <div>
                    <p className="text-primary">{product.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {product.units} units
                    </p>
                  </div>
                  <p>{formatPriceExact(product.revenue)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-8 border border-border p-5">
        <h2 className="font-display text-2xl">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/admin/products" variant="outline" size="sm">
            Manage products
          </Button>
          <Button href="/admin/inventory" variant="outline" size="sm">
            Check inventory
          </Button>
          <Button href="/admin/discounts" variant="outline" size="sm">
            Create discount
          </Button>
          <Button href="/admin/analytics" variant="outline" size="sm">
            Open analytics
          </Button>
        </div>
      </section>
    </div>
  );
}
