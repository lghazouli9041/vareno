"use client";

import { memo, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { listInventoryAction } from "@/features/admin/actions";

type InventoryRow = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  finish: string;
  stock: number;
  inStock: boolean;
  alert: "OK" | "Low stock" | "Out of stock";
};

function InventoryBoardComponent() {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await listInventoryAction();
      if (!result.ok) {
        setError(result.error ?? "Unable to load inventory");
        return;
      }
      setRows(result.rows);
      setLowStockCount(result.lowStockCount ?? 0);
      setOutOfStockCount(result.outOfStockCount ?? 0);
    });
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Inventory"
        description="Stock levels, low-stock alerts, and availability."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="border border-border p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            Tracked SKUs
          </p>
          <p className="mt-2 font-display text-3xl">{rows.length}</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            Low stock
          </p>
          <p className="mt-2 font-display text-3xl text-warning">
            {lowStockCount}
          </p>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            Out of stock
          </p>
          <p className="mt-2 font-display text-3xl text-error">
            {outOfStockCount}
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-muted" role="status">
          {error}
        </p>
      )}
      {pending && rows.length === 0 && (
        <p className="mb-4 text-sm text-muted">Loading inventory…</p>
      )}

      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Finish</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Alert</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/80 last:border-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${row.productId}`}
                    className="hover:text-accent"
                  >
                    {row.productName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{row.sku}</td>
                <td className="px-4 py-3 text-muted">{row.finish}</td>
                <td className="px-4 py-3">{row.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      row.alert === "OK"
                        ? "text-muted"
                        : row.alert === "Low stock"
                          ? "text-warning"
                          : "text-error"
                    }
                  >
                    {row.alert}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const InventoryBoard = memo(InventoryBoardComponent);
