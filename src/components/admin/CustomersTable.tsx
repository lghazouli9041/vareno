"use client";

import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { formatPriceExact } from "@/lib/utils";

export type AdminCustomerRow = {
  id: string;
  email: string;
  name: string;
  orderCount: number;
  lifetimeValue: number;
  createdAt: string;
};

function CustomersTableComponent({
  customers,
}: {
  customers: AdminCustomerRow[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (customer) =>
        customer.email.toLowerCase().includes(q) ||
        customer.name.toLowerCase().includes(q),
    );
  }, [customers, query]);

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description="Profiles, order history, and household addresses."
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search customers"
        className="mb-4 w-full max-w-md border border-border bg-secondary/30 px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Lifetime value</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id} className="border-b border-border/80 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="font-medium hover:text-accent"
                  >
                    {customer.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">{customer.email}</p>
                </td>
                <td className="px-4 py-3">{customer.orderCount}</td>
                <td className="px-4 py-3">
                  {formatPriceExact(customer.lifetimeValue)}
                  <span className="ml-2 text-[10px] uppercase tracking-[0.12em] text-muted">
                    placeholder
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(new Date(customer.createdAt))}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const CustomersTable = memo(CustomersTableComponent);
