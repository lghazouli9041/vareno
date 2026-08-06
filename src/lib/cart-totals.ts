import { siteConfig } from "@/config/site";

export function estimateCartShipping(subtotal: number): number {
  if (subtotal === 0) return 0;
  if (subtotal >= siteConfig.shipping.freeThreshold) return 0;
  return 45;
}

export function estimateCartTax(subtotal: number): number {
  return Math.round(subtotal * 0.08);
}

export function amountToFreeShipping(subtotal: number): number {
  return Math.max(0, siteConfig.shipping.freeThreshold - subtotal);
}
