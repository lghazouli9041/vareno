export type ShippingMethodId = "standard" | "express" | "white-glove";

export type PaymentMethodId = "card" | "apple-pay" | "google-pay";

export interface AddressFields {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface CheckoutFormValues {
  email: string;
  shipping: AddressFields;
  billingSameAsShipping: boolean;
  billing: AddressFields;
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
}

export type CheckoutFieldPath =
  | "email"
  | `shipping.${keyof AddressFields}`
  | `billing.${keyof AddressFields}`;

export type CheckoutErrors = Partial<Record<CheckoutFieldPath, string>>;

export const emptyAddress = (): AddressFields => ({
  firstName: "",
  lastName: "",
  phone: "",
  country: "United States",
  address: "",
  city: "",
  state: "",
  zip: "",
});

export const initialCheckoutValues = (): CheckoutFormValues => ({
  email: "",
  shipping: emptyAddress(),
  billingSameAsShipping: true,
  billing: emptyAddress(),
  shippingMethod: "standard",
  paymentMethod: "card",
});
