"use client";

import dynamic from "next/dynamic";
import { memo } from "react";
import { AdminKpiCard, AdminPageHeader } from "@/components/admin/AdminUi";
import { formatPriceExact } from "@/lib/utils";

const AdminChart = dynamic(
  () => import("@/components/admin/AdminChart").then((mod) => mod.AdminChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 animate-pulse border border-border bg-surface" />
    ),
  },
);

export type AnalyticsPayload = {
  revenue: number;
  orders: number;
  customers: number;
  returningCustomers: number;
  averageOrderValue: number;
  conversion: number | null;
  revenueSeries: Array<{ label: string; value: number }>;
  ordersSeries: Array<{ label: string; value: number }>;
  topProducts: Array<{ name: string; revenue: number; units: number }>;
  topCollections: Array<{ name: string; count: number }>;
};

function AnalyticsDashboardComponent({ data }: { data: AnalyticsPayload }) {
  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Performance across revenue, demand, and assortment."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminKpiCard
          label="Revenue"
          value={formatPriceExact(data.revenue)}
        />
        <AdminKpiCard label="Orders" value={String(data.orders)} />
        <AdminKpiCard label="Customers" value={String(data.customers)} />
        <AdminKpiCard
          label="Average order value"
          value={formatPriceExact(data.averageOrderValue)}
        />
        <AdminKpiCard
          label="Returning customers"
          value={String(data.returningCustomers)}
        />
        <AdminKpiCard
          label="Conversion"
          value={
            data.conversion == null ? "—" : `${data.conversion.toFixed(1)}%`
          }
          hint="Orders ÷ customers"
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <AdminChart
          title="Revenue"
          points={data.revenueSeries}
          valueFormat="currency"
        />
        <AdminChart title="Orders" points={data.ordersSeries} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="border border-border p-5">
          <h2 className="font-display text-2xl">Top products</h2>
          <ul className="mt-4 divide-y divide-border">
            {data.topProducts.length === 0 ? (
              <li className="py-6 text-sm text-muted">No product data yet.</li>
            ) : (
              data.topProducts.map((product) => (
                <li
                  key={product.name}
                  className="flex justify-between gap-3 py-3 text-sm"
                >
                  <span>
                    {product.name}
                    <span className="mt-1 block text-xs text-muted">
                      {product.units} units
                    </span>
                  </span>
                  <span>{formatPriceExact(product.revenue)}</span>
                </li>
              ))
            )}
          </ul>
        </section>
        <section className="border border-border p-5">
          <h2 className="font-display text-2xl">Top collections</h2>
          <ul className="mt-4 divide-y divide-border">
            {data.topCollections.length === 0 ? (
              <li className="py-6 text-sm text-muted">No collection sales yet.</li>
            ) : (
              data.topCollections.map((collection) => (
                <li
                  key={collection.name}
                  className="flex justify-between gap-3 py-3 text-sm"
                >
                  <span>{collection.name}</span>
                  <span className="text-muted">{collection.count} units</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

export const AnalyticsDashboard = memo(AnalyticsDashboardComponent);
