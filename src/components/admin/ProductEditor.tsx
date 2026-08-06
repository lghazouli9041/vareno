"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import {
  listAdminCatalogProductsAction,
  listCatalogCollectionsAction,
} from "@/features/catalog/actions";
import {
  uploadProductImageAction,
  upsertAdminProductAction,
} from "@/features/commerce/actions";
import { cn, formatPrice } from "@/lib/utils";
import { useAdminProductsStore } from "@/store/admin-products";
import type { AdminProduct, AdminProductStatus } from "@/types/admin";
import type {
  CatalogAvailability,
  CatalogCategory,
  CatalogCollection,
} from "@/types/catalog";

const tabs = [
  "General",
  "Pricing",
  "Media",
  "Variants",
  "Inventory",
  "SEO",
  "Shipping",
  "Specifications",
  "Preview",
] as const;

type Tab = (typeof tabs)[number];

function emptyProduct(defaultCollection = "signature"): AdminProduct {
  const stamp = Date.now().toString(36);
  return {
    id: `prod-new-${stamp}`,
    slug: `new-product-${stamp}`,
    collection: defaultCollection,
    name: "",
    category: "bathroom",
    finishOptions: [
      {
        id: `fin-${stamp}`,
        name: "Brushed Gold",
        slug: "brushed-gold",
        hex: "#C9A14A",
        sku: `SKU-${stamp.toUpperCase()}`,
        price: 1200,
        available: true,
      },
    ],
    price: 1200,
    sku: `SKU-${stamp.toUpperCase()}`,
    shortDescription: "",
    marketingDescription: "",
    seoTitle: "",
    seoDescription: "",
    featuredImage: "/brand/monogram.svg",
    gallery: [],
    dimensions: { height: "", spoutReach: "" },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    status: "draft",
    stock: 12,
    updatedAt: new Date().toISOString(),
  };
}

interface ProductEditorProps {
  productId?: string;
}

function ProductEditorComponent({ productId }: ProductEditorProps) {
  const router = useRouter();
  const hydrateFromServer = useAdminProductsStore((s) => s.hydrateFromServer);
  const products = useAdminProductsStore((s) => s.products);
  const upsert = useAdminProductsStore((s) => s.upsert);
  const [tab, setTab] = useState<Tab>("General");
  const [draft, setDraft] = useState<AdminProduct | null>(null);
  const [saved, setSaved] = useState(false);
  const [collections, setCollections] = useState<CatalogCollection[]>([]);

  useEffect(() => {
    void listAdminCatalogProductsAction().then((result) => {
      if (result.ok) hydrateFromServer(result.products);
    });
    void listCatalogCollectionsAction().then((result) => {
      if (result.ok) setCollections(result.collections);
    });
  }, [hydrateFromServer]);

  useEffect(() => {
    if (!productId) {
      setDraft(
        (prev) => prev ?? emptyProduct(collections[0]?.slug ?? "signature"),
      );
      return;
    }
    const found = products.find((item) => item.id === productId);
    if (found) setDraft({ ...found });
  }, [productId, products, collections]);

  const finishSummary = useMemo(
    () => draft?.finishOptions.map((item) => item.name).join(", ") ?? "",
    [draft],
  );

  if (!draft) {
    return (
      <p className="text-sm text-muted">
        Product not found.{" "}
        <button
          type="button"
          className="text-accent"
          onClick={() => router.push("/admin/products")}
        >
          Back to products
        </button>
      </p>
    );
  }

  const update = <K extends keyof AdminProduct>(
    key: K,
    value: AdminProduct[K],
  ) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const save = () => {
    if (!draft.name.trim()) return;
    const next = {
      ...draft,
      slug: draft.slug || draft.name.toLowerCase().replace(/\s+/g, "-"),
      price: draft.finishOptions[0]?.price ?? draft.price,
      updatedAt: new Date().toISOString(),
    };
    upsert(next);
    void upsertAdminProductAction({
      id: next.id,
      slug: next.slug,
      name: next.name,
      shortDescription: next.shortDescription,
      marketingDescription: next.marketingDescription,
      category: next.category,
      collection: next.collection,
      price: next.price,
      material: next.material,
      warranty: next.warranty,
      featuredImage: next.featuredImage,
      status: next.status,
      stock: next.stock,
      sku: next.sku,
      seoTitle: next.seoTitle,
      seoDescription: next.seoDescription,
      finishOptions: next.finishOptions.map((finish) => ({
        id: finish.id,
        name: finish.name,
        slug: finish.slug,
        sku: finish.sku,
        price: finish.price,
        available: finish.available,
      })),
      dimensions: next.dimensions,
    }).then((result) => {
      if (!result.ok) {
        console.error("Admin product DB save failed", result);
      }
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    if (!productId) router.replace(`/admin/products/${next.id}`);
  };

  const onUpload = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file || !draft) return;
    const body = new FormData();
    body.set("file", file);
    const result = await uploadProductImageAction(body);
    if (result.ok) {
      setDraft({ ...draft, featuredImage: result.url });
    } else {
      window.alert(result.error ?? "Upload failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={productId ? "Edit product" : "Create product"}
        description="Professional editor for catalog presentation and commerce details."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button type="button" variant="gold" size="sm" onClick={save}>
              Save product
            </Button>
          </>
        }
      />

      {saved && (
        <p className="mb-4 text-sm text-muted" role="status">
          Product saved.
        </p>
      )}

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "shrink-0 px-3 py-3 text-[11px] uppercase tracking-[0.14em] transition-colors",
              tab === item
                ? "border-b-2 border-accent text-primary"
                : "text-muted hover:text-primary",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="border border-border p-5 md:p-7">
        {tab === "General" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <input
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Slug">
              <input
                value={draft.slug}
                onChange={(e) => update("slug", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="SKU">
              <input
                value={draft.sku}
                onChange={(e) => update("sku", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Status">
              <select
                value={draft.status}
                onChange={(e) =>
                  update("status", e.target.value as AdminProductStatus)
                }
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) =>
                  update("category", e.target.value as CatalogCategory)
                }
                className={inputClass}
              >
                <option value="bathroom">Bathroom</option>
                <option value="kitchen">Kitchen</option>
              </select>
            </Field>
            <Field label="Collection">
              <select
                value={draft.collection}
                onChange={(e) => update("collection", e.target.value)}
                className={inputClass}
              >
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.slug}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Short description" className="md:col-span-2">
              <textarea
                value={draft.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                rows={3}
                className={inputClass}
              />
            </Field>
            <Field label="Marketing description" className="md:col-span-2">
              <textarea
                value={draft.marketingDescription}
                onChange={(e) =>
                  update("marketingDescription", e.target.value)
                }
                rows={5}
                className={inputClass}
              />
            </Field>
          </div>
        )}

        {tab === "Pricing" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Base price">
              <input
                type="number"
                value={draft.price}
                onChange={(e) => update("price", Number(e.target.value) || 0)}
                className={inputClass}
              />
            </Field>
            <Field label="Primary finish price">
              <input
                type="number"
                value={draft.finishOptions[0]?.price ?? 0}
                onChange={(e) => {
                  const price = Number(e.target.value) || 0;
                  const finishOptions = draft.finishOptions.map((item, index) =>
                    index === 0 ? { ...item, price } : item,
                  );
                  setDraft({ ...draft, finishOptions, price });
                }}
                className={inputClass}
              />
            </Field>
          </div>
        )}

        {tab === "Media" && (
          <div className="space-y-5">
            <label className="flex h-40 cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-secondary/20 text-sm text-muted transition-colors hover:border-accent hover:text-primary">
              <span>Upload image (Cloudinary when configured)</span>
              <span className="mt-2 text-xs">or drop a file</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => void onUpload(event.target.files)}
              />
            </label>
            <Field label="Featured image URL">
              <input
                value={draft.featuredImage}
                onChange={(e) => update("featuredImage", e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="relative h-40 w-32 overflow-hidden bg-surface">
              <Image
                src={draft.featuredImage || "/brand/monogram.svg"}
                alt=""
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          </div>
        )}

        {tab === "Variants" && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Finish variants currently on this product.
            </p>
            <ul className="divide-y divide-border border border-border">
              {draft.finishOptions.map((finish) => (
                <li
                  key={finish.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 border border-border"
                      style={{ backgroundColor: finish.hex }}
                    />
                    <span>
                      {finish.name} · {finish.sku}
                    </span>
                  </div>
                  <span>{formatPrice(finish.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "Inventory" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Stock quantity">
              <input
                type="number"
                value={draft.stock}
                onChange={(e) => update("stock", Number(e.target.value) || 0)}
                className={inputClass}
              />
            </Field>
            <Field label="Availability">
              <select
                value={draft.availability}
                onChange={(e) =>
                  update(
                    "availability",
                    e.target.value as CatalogAvailability,
                  )
                }
                className={inputClass}
              >
                <option value="in_stock">In stock</option>
                <option value="made_to_order">Made to order</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </Field>
          </div>
        )}

        {tab === "SEO" && (
          <div className="grid gap-4">
            <Field label="SEO title">
              <input
                value={draft.seoTitle}
                onChange={(e) => update("seoTitle", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="SEO description">
              <textarea
                value={draft.seoDescription}
                onChange={(e) => update("seoDescription", e.target.value)}
                rows={4}
                className={inputClass}
              />
            </Field>
          </div>
        )}

        {tab === "Shipping" && (
          <div className="space-y-3 text-sm text-muted">
            <p>Standard delivery: 5–7 business days</p>
            <p>Express delivery: 2–3 business days</p>
            <p>Free shipping threshold follows store settings.</p>
            <p className="text-xs">Shipping rules placeholder for admin UX.</p>
          </div>
        )}

        {tab === "Specifications" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Height">
              <input
                value={draft.dimensions.height}
                onChange={(e) =>
                  update("dimensions", {
                    ...draft.dimensions,
                    height: e.target.value,
                  })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Spout reach">
              <input
                value={draft.dimensions.spoutReach}
                onChange={(e) =>
                  update("dimensions", {
                    ...draft.dimensions,
                    spoutReach: e.target.value,
                  })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Material">
              <input
                value={draft.material}
                onChange={(e) => update("material", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Warranty">
              <input
                value={draft.warranty}
                onChange={(e) => update("warranty", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        )}

        {tab === "Preview" && (
          <div className="grid gap-6 md:grid-cols-[160px_minmax(0,1fr)]">
            <div className="relative aspect-[3/4] overflow-hidden bg-surface">
              <Image
                src={draft.featuredImage || "/brand/monogram.svg"}
                alt=""
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-accent">
                {draft.collection}
              </p>
              <h2 className="mt-2 font-display text-3xl">
                {draft.name || "Untitled product"}
              </h2>
              <p className="mt-2 text-sm text-muted">{finishSummary}</p>
              <p className="mt-4 font-display text-2xl">
                {formatPrice(draft.price)}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                {draft.shortDescription || "No description yet."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block text-sm", className)}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full border border-border bg-secondary/30 px-3 py-2.5 text-sm outline-none focus:border-primary";

export const ProductEditor = memo(ProductEditorComponent);
