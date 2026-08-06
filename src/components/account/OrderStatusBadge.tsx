import { memo } from "react";
import { cn } from "@/lib/utils";
import { formatOrderStatus } from "@/lib/orders/status";
import type { OrderStatus } from "@prisma/client";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

function OrderStatusBadgeComponent({
  status,
  className,
}: OrderStatusBadgeProps) {
  const tone =
    status === "DELIVERED" || status === "PAID"
      ? "border-accent/40 text-accent"
      : status === "CANCELLED" || status === "REFUNDED"
        ? "border-error/40 text-error"
        : "border-border text-primary";

  return (
    <span
      className={cn(
        "inline-flex border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]",
        tone,
        className,
      )}
    >
      {formatOrderStatus(status)}
    </span>
  );
}

export const OrderStatusBadge = memo(OrderStatusBadgeComponent);
