"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useState } from "react";
import { Download, Package, RotateCcw, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { useCatalogSnapshot } from "@/hooks/useCatalogSnapshot";
import { catalogToCartProduct } from "@/lib/catalog-to-cart";
import type { AccountOrder } from "@/lib/account/order-view";
import { formatPriceExact } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface OrderCardProps {
  order: AccountOrder;
}

function OrderCardComponent({ order }: OrderCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { products } = useCatalogSnapshot();
  const [message, setMessage] = useState<string | null>(null);

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(order.createdAt));

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2400);
  };

  const buyAgain = useCallback(() => {
    let added = 0;
    for (const item of order.items) {
      const product =
        (item.slug
          ? products.find((entry) => entry.slug === item.slug)
          : undefined) ??
        products.find((entry) => entry.id === item.productId) ??
        products.find(
          (entry) =>
            entry.name.trim().toLowerCase() ===
            item.productName.trim().toLowerCase(),
        );

      if (!product) continue;
      const finish =
        product.finishOptions.find(
          (option) =>
            option.name.toLowerCase() === item.finish.toLowerCase(),
        ) ??
        product.finishOptions.find((option) => option.available) ??
        product.finishOptions[0];
      if (!finish) continue;
      addItem(catalogToCartProduct(product, finish), item.quantity);
      added += 1;
    }
    notify(
      added
        ? `${added} ${added === 1 ? "item" : "items"} added to cart`
        : "Unable to match items for reorder",
    );
  }, [addItem, order.items, products]);

  return (
    <article className="border border-border bg-background p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
            Order
          </p>
          <h3 className="mt-1 font-display text-2xl text-primary">
            {order.orderNumber}
          </h3>
          <p className="mt-2 text-sm text-muted">{dateLabel}</p>
        </div>
        <div className="text-right">
          <OrderStatusBadge status={order.status} />
          <p className="mt-3 font-display text-xl text-primary">
            {formatPriceExact(order.total, order.currency)}
          </p>
        </div>
      </div>

      <ul className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {order.items.slice(0, 5).map((item) => (
          <li
            key={item.id}
            className="relative h-16 w-14 shrink-0 overflow-hidden bg-surface"
            title={item.productName}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-[10px] text-muted">
                <Package size={16} strokeWidth={1.4} />
              </span>
            )}
          </li>
        ))}
        {order.items.length > 5 && (
          <li className="flex h-16 w-14 shrink-0 items-center justify-center border border-border text-xs text-muted">
            +{order.items.length - 5}
          </li>
        )}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2 md:gap-3">
        <Button
          href={`/account/orders/${order.orderNumber}`}
          variant="outline"
          size="sm"
        >
          View details
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-1.5"
          onClick={() => notify("Invoice download coming soon.")}
        >
          <Download size={14} strokeWidth={1.5} />
          Invoice
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-1.5"
          onClick={() => notify("Shipment tracking coming soon.")}
        >
          <Truck size={14} strokeWidth={1.5} />
          Track
        </Button>
        <Button
          type="button"
          variant="gold"
          size="sm"
          className="inline-flex items-center gap-1.5"
          onClick={buyAgain}
        >
          <RotateCcw size={14} strokeWidth={1.5} />
          Buy again
        </Button>
      </div>

      {message && (
        <p className="mt-4 text-xs text-muted" role="status">
          {message}
        </p>
      )}

      <Link
        href={`/account/orders/${order.orderNumber}`}
        className="mt-4 block text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent md:hidden"
      >
        Open order
      </Link>
    </article>
  );
}

export const OrderCard = memo(OrderCardComponent);
