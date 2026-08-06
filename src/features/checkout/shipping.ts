import { siteConfig } from "@/config/site";
import type { ShippingMethodId } from "@/features/checkout/types";

export interface ShippingMethodOption {
  id: ShippingMethodId;
  label: string;
  description: string;
  price: number;
  eta: string;
}

export const shippingMethods: ShippingMethodOption[] = [
  {
    id: "standard",
    label: "Standard Delivery",
    description: "Tracked ground shipping in protective packaging.",
    price: 0,
    eta: `${siteConfig.shipping.standardDays} business days`,
  },
  {
    id: "express",
    label: "Express Delivery",
    description: "Priority handling with accelerated transit.",
    price: 45,
    eta: `${siteConfig.shipping.expressDays} business days`,
  },
  {
    id: "white-glove",
    label: "White Glove",
    description: "Scheduled delivery with unpacking and placement.",
    price: 125,
    eta: "Scheduled within 5–8 business days",
  },
];

export function getShippingMethod(id: ShippingMethodId): ShippingMethodOption {
  return (
    shippingMethods.find((method) => method.id === id) ?? shippingMethods[0]
  );
}

export function estimateShipping(
  subtotal: number,
  methodId: ShippingMethodId,
): number {
  const method = getShippingMethod(methodId);
  if (method.id === "standard" && subtotal >= siteConfig.shipping.freeThreshold) {
    return 0;
  }
  if (method.id === "standard") {
    return subtotal === 0 ? 0 : 45;
  }
  return method.price;
}

export function estimateTax(subtotal: number): number {
  return Math.round(subtotal * 0.08);
}

export const usStates = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
] as const;

export const countries = ["United States", "Canada"] as const;
