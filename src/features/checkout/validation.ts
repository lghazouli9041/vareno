import type {
  AddressFields,
  CheckoutErrors,
  CheckoutFormValues,
} from "@/features/checkout/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[\d\s().-]{7,}$/;
const zipPattern = /^\d{5}(-\d{4})?$/;

function requireText(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label} is required`;
  return undefined;
}

function validateAddress(
  address: AddressFields,
  prefix: "shipping" | "billing",
): CheckoutErrors {
  const errors: CheckoutErrors = {};

  const firstName = requireText(address.firstName, "First name");
  if (firstName) errors[`${prefix}.firstName`] = firstName;

  const lastName = requireText(address.lastName, "Last name");
  if (lastName) errors[`${prefix}.lastName`] = lastName;

  if (!address.phone.trim()) {
    errors[`${prefix}.phone`] = "Phone is required";
  } else if (!phonePattern.test(address.phone.trim())) {
    errors[`${prefix}.phone`] = "Enter a valid phone number";
  }

  const country = requireText(address.country, "Country");
  if (country) errors[`${prefix}.country`] = country;

  const street = requireText(address.address, "Address");
  if (street) errors[`${prefix}.address`] = street;

  const city = requireText(address.city, "City");
  if (city) errors[`${prefix}.city`] = city;

  const state = requireText(address.state, "State");
  if (state) errors[`${prefix}.state`] = state;

  if (!address.zip.trim()) {
    errors[`${prefix}.zip`] = "ZIP code is required";
  } else if (
    address.country === "United States" &&
    !zipPattern.test(address.zip.trim())
  ) {
    errors[`${prefix}.zip`] = "Enter a valid ZIP code";
  }

  return errors;
}

export function validateCheckout(
  values: CheckoutFormValues,
): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  Object.assign(errors, validateAddress(values.shipping, "shipping"));

  if (!values.billingSameAsShipping) {
    Object.assign(errors, validateAddress(values.billing, "billing"));
  }

  return errors;
}

export function validateField(
  values: CheckoutFormValues,
  path: keyof CheckoutErrors,
): string | undefined {
  return validateCheckout(values)[path];
}
