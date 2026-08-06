"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildCompareRows, COMPARE_PLACEHOLDER } from "@/lib/compare-rows";
import { catalogToCartProduct } from "@/lib/catalog-to-cart";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useCompareStore } from "@/store/compare";
import type { CatalogProduct } from "@/types/catalog";

interface CompareTableProps {
  products: CatalogProduct[];
  collectionNames?: Record<string, string>;
}

function CompareTableComponent({
  products,
  collectionNames = {},
}: CompareTableProps) {
  const remove = useCompareStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);
  const rows = useMemo(
    () => buildCompareRows(products, collectionNames),
    [products, collectionNames],
  );

  if (products.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-36 bg-background px-3 py-4 text-[10px] uppercase tracking-[0.18em] text-muted md:w-44">
              Spec
            </th>
            {products.map((product) => {
              const collection = (
                collectionNames[product.collection] ?? product.collection
              ).replace(" Collection", "");
              const finish =
                product.finishOptions.find((f) => f.available) ??
                product.finishOptions[0];

              return (
                <th
                  key={product.id}
                  className="min-w-[180px] px-3 py-4 align-top font-normal md:min-w-[200px]"
                >
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="absolute -right-1 -top-1 z-10 border border-border bg-background p-1.5 text-muted transition-colors hover:text-error"
                      aria-label={`Remove ${product.name} from comparison`}
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                        <Image
                          src={product.featuredImage}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="220px"
                        />
                      </div>
                      <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-accent">
                        {collection}
                      </p>
                      <p className="mt-1.5 font-display text-xl text-primary transition-colors group-hover:text-accent md:text-2xl">
                        {product.name}
                      </p>
                    </Link>
                    {finish && (
                      <div className="mt-4">
                        <p className="font-display text-lg text-primary">
                          {formatPrice(finish.price)}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full"
                          onClick={() =>
                            addItem(catalogToCartProduct(product, finish), 1)
                          }
                        >
                          Add to Cart
                        </Button>
                      </div>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-border">
              <th className="sticky left-0 z-10 bg-background px-3 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td
                  key={`${row.key}-${products[index]?.id ?? index}`}
                  className={cn(
                    "px-3 py-4 text-sm leading-relaxed",
                    value === COMPARE_PLACEHOLDER
                      ? "text-muted/70"
                      : "text-muted",
                  )}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const CompareTable = memo(CompareTableComponent);
