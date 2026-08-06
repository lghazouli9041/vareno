import type { Product, ProductVariant } from "@/types/product";

export interface CartLineItem {
  id: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

/** Legacy cart shape — kept for migration; prefer CartLineItem */
export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
}

export interface WishlistItem {
  productId: string;
  variantId?: string;
  addedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface ShippingRate {
  id: string;
  label: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface Coupon {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minSubtotal?: number;
  active: boolean;
}
