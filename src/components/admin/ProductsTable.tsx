"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  memo,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { listAdminCatalogProductsAction } from "@/features/catalog/actions";
import { deleteAdminProductAction } from "@/features/commerce/actions";
import { formatPrice, cn } from "@/lib/utils";
import { useAdminProductsStore } from "@/store/admin-products";
import type { AdminProductStatus } from "@/types/admin";

const PAGE_SIZE = 8;

function ProductsTableComponent() {
  const router = useRouter();
  const products = useAdminProductsStore((s) => s.products);
  const hydrateFromServer = useAdminProductsStore((s) => s.hydrateFromServer);
  const duplicate = useAdminProductsStore((s) => s.duplicate);
  const setStatus = useAdminProductsStore((s) => s.setStatus);
  const remove = useAdminProductsStore((s) => s.remove);

  const [query, setQuery] = useState("");
  const [status, setStatusFilter] = useState<"all" | AdminProductStatus>("all");
  const [category, setCategory] = useState<"all" | "kitchen" | "bathroom">(
    "all",
  );
  const [sort, setSort] = useState<"name" | "price" | "stock" | "updated">(
    "updated",
  );
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    void listAdminCatalogProductsAction().then((result) => {
      if (result.ok) hydrateFromServer(result.products);
    });
  }, [hydrateFromServer]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((product) => {
      if (status !== "all" && product.status !== status) return false;
      if (category !== "all" && product.category !== category) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.collection.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price") return b.price - a.price;
      if (sort === "stock") return a.stock - b.stock;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

    return list;
  }, [products, query, status, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  const toggleAll = (event: ChangeEvent<HTMLInputElement>) => {
    setSelected(
      event.target.checked ? pageItems.map((item) => item.id) : [],
    );
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Search, filter, and manage the VARENO catalog."
        actions={
          <Button href="/admin/products/new" variant="gold" size="sm">
            Create product
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
          placeholder="Search name, SKU, collection"
          className="border border-border bg-secondary/30 px-3 py-2.5 text-sm outline-none focus:border-primary md:col-span-2"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatusFilter(event.target.value as typeof status);
            setPage(0);
          }}
          className="border border-border bg-secondary/30 px-3 py-2.5 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value as typeof category);
            setPage(0);
          }}
          className="border border-border bg-secondary/30 px-3 py-2.5 text-sm"
        >
          <option value="all">All categories</option>
          <option value="kitchen">Kitchen</option>
          <option value="bathroom">Bathroom</option>
        </select>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!selected.length}
            onClick={() => {
              selected.forEach((id) => setStatus(id, "archived"));
              setSelected([]);
            }}
          >
            Archive
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!selected.length}
            onClick={() => {
              if (confirm(`Delete ${selected.length} products?`)) {
                selected.forEach((id) => void deleteAdminProductAction(id));
                remove(selected);
                setSelected([]);
              }
            }}
          >
            Delete
          </Button>
        </div>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          className="border border-border bg-secondary/30 px-3 py-2 text-sm"
        >
          <option value="updated">Sort · Updated</option>
          <option value="name">Sort · Name</option>
          <option value="price">Sort · Price</option>
          <option value="stock">Sort · Stock</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    pageItems.length > 0 &&
                    pageItems.every((item) => selected.includes(item.id))
                  }
                  onChange={toggleAll}
                  aria-label="Select page"
                />
              </th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Inventory</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((product) => (
              <tr key={product.id} className="border-b border-border/80 last:border-0">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleOne(product.id)}
                    aria-label={`Select ${product.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 overflow-hidden bg-surface">
                      <Image
                        src={product.featuredImage}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-medium text-primary hover:text-accent"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {product.sku} · {product.collection}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "border px-2 py-1 text-[10px] uppercase tracking-[0.14em]",
                      product.status === "active" && "border-accent text-accent",
                      product.status === "draft" && "border-border text-muted",
                      product.status === "archived" &&
                        "border-error/40 text-error",
                    )}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-[0.12em] text-muted hover:text-accent"
                      onClick={() => router.push(`/admin/products/${product.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-[0.12em] text-muted hover:text-accent"
                      onClick={() => {
                        const copy = duplicate(product.id);
                        if (copy) router.push(`/admin/products/${copy.id}`);
                      }}
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-[0.12em] text-muted hover:text-primary"
                      onClick={() =>
                        setStatus(
                          product.id,
                          product.status === "archived" ? "active" : "archived",
                        )
                      }
                    >
                      {product.status === "archived" ? "Restore" : "Archive"}
                    </button>
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-[0.12em] text-muted hover:text-error"
                      onClick={() => {
                        if (confirm(`Delete ${product.name}?`)) {
                          void deleteAdminProductAction(product.id);
                          remove([product.id]);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No products match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <p>
          {filtered.length} products · Page {currentPage + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= pageCount - 1}
            onClick={() =>
              setPage((value) => Math.min(pageCount - 1, value + 1))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export const ProductsTable = memo(ProductsTableComponent);
