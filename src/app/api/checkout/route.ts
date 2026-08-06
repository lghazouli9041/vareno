import { NextResponse } from "next/server";
import {
  createCheckoutSessionSchema,
  createStripeCheckoutSession,
} from "@/features/checkout/create-checkout-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createCheckoutSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Invalid checkout request",
        },
        { status: 400 },
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 },
      );
    }

    const session = await createStripeCheckoutSession(parsed.data);
    return NextResponse.json({
      url: session.url,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Unable to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
