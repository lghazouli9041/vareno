import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isCloudinaryConfiguredEnv,
  isResendConfigured,
  isStripeConfigured,
} from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight readiness probe for load balancers / deploy platforms.
 * Does not expose secrets.
 */
export async function GET() {
  let database: "up" | "down" = "down";
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "up";
  } catch {
    database = "down";
  }

  const body = {
    ok: database === "up",
    service: "vareno",
    timestamp: new Date().toISOString(),
    checks: {
      database,
      stripe: isStripeConfigured() ? "configured" : "missing",
      resend: isResendConfigured() ? "configured" : "missing",
      cloudinary: isCloudinaryConfiguredEnv() ? "configured" : "missing",
    },
  };

  return NextResponse.json(body, {
    status: database === "up" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
