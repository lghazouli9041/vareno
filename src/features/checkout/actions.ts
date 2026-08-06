"use server";

import {
  createCheckoutSessionSchema,
  createStripeCheckoutSession,
} from "@/features/checkout/create-checkout-session";

export type CheckoutSessionActionResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function createCheckoutSessionAction(
  rawInput: unknown,
): Promise<CheckoutSessionActionResult> {
  try {
    const parsed = createCheckoutSessionSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid checkout request",
      };
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        ok: false,
        error: "Payments are temporarily unavailable. Please try again later.",
      };
    }

    const session = await createStripeCheckoutSession(parsed.data);
    return { ok: true, url: session.url };
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unable to start secure checkout";
    return {
      ok: false,
      error:
        message.includes("STRIPE_SECRET_KEY")
          ? "Payments are temporarily unavailable. Please try again later."
          : message,
    };
  }
}
