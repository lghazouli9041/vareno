import { z } from "zod";

/**
 * Validated environment contract.
 * Server-only — never import this module into Client Components.
 *
 * Development: DATABASE_URL + Clerk are required; Stripe / Cloudinary / Resend
 * are optional (empty values allowed).
 * Production runtime: those integrations are also required.
 * Build phase: warn only so `next build` can complete without every key.
 */

/** Treat blank strings as unset so optional secrets don't fail Zod in .env files. */
const optionalNonEmpty = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().min(1).optional(),
);

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().email().optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional(),
);

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: optionalNonEmpty,
  CLERK_SECRET_KEY: optionalNonEmpty,
  STRIPE_SECRET_KEY: optionalNonEmpty,
  STRIPE_WEBHOOK_SECRET: optionalNonEmpty,
  CLOUDINARY_CLOUD_NAME: optionalNonEmpty,
  CLOUDINARY_API_KEY: optionalNonEmpty,
  CLOUDINARY_API_SECRET: optionalNonEmpty,
  RESEND_API_KEY: optionalNonEmpty,
  EMAIL_FROM: optionalNonEmpty,
  ADMIN_NOTIFICATION_EMAIL: optionalEmail,
  ADMIN_EMAILS: optionalNonEmpty,
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: optionalUrl,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: optionalNonEmpty,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: optionalNonEmpty,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: optionalNonEmpty,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: optionalNonEmpty,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: optionalNonEmpty,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalNonEmpty,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: optionalNonEmpty,
  NEXT_PUBLIC_WHATSAPP_NUMBER: optionalNonEmpty,
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type PublicEnv = z.infer<typeof publicSchema>;

/** Required in every environment (including local development). */
const CORE_REQUIRED_SERVER = ["DATABASE_URL", "CLERK_SECRET_KEY"] as const;
const CORE_REQUIRED_PUBLIC = ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] as const;

/**
 * Required only when NODE_ENV === "production" (runtime).
 * Optional in development / test.
 */
const PRODUCTION_ONLY_REQUIRED_SERVER = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "ADMIN_NOTIFICATION_EMAIL",
] as const;

const PRODUCTION_ONLY_REQUIRED_PUBLIC = [
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
] as const;

const PRODUCTION_RECOMMENDED = [
  "ADMIN_EMAILS",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SITE_URL",
] as const;

let cachedServer: ServerEnv | null = null;
let cachedPublic: PublicEnv | null = null;

function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function isProductionRuntime() {
  return process.env.NODE_ENV === "production" && !isBuildPhase();
}

function shouldSkipValidation() {
  return (
    process.env.SKIP_ENV_VALIDATION === "1" ||
    process.env.SKIP_ENV_VALIDATION === "true"
  );
}

function collectMissing(
  required: readonly string[],
  source: Record<string, string | undefined>,
) {
  return required.filter((key) => {
    if (key === "CLOUDINARY_CLOUD_NAME") {
      return !(
        source.CLOUDINARY_CLOUD_NAME?.trim() ||
        source.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()
      );
    }
    return !source[key]?.trim();
  });
}

/** Soft parse of server env (always available). */
export function getEnv(): ServerEnv {
  if (cachedServer) return cachedServer;

  const parsed = serverSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    CLOUDINARY_CLOUD_NAME:
      process.env.CLOUDINARY_CLOUD_NAME ??
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  });

  if (!parsed.success) {
    console.error("Invalid environment variables", parsed.error.flatten());
    throw new Error("Invalid environment variables");
  }

  cachedServer = parsed.data;
  return cachedServer;
}

export function getPublicEnv(): PublicEnv {
  if (cachedPublic) return cachedPublic;

  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  });

  if (!parsed.success) {
    console.error("Invalid public environment variables", parsed.error.flatten());
    throw new Error("Invalid public environment variables");
  }

  cachedPublic = parsed.data;
  return cachedPublic;
}

/**
 * Assert environment readiness.
 * - Always: DATABASE_URL + Clerk keys
 * - Production runtime: also Stripe, Cloudinary, Resend/email
 * - Build phase: warn only (never throw)
 * - Development: Stripe / Cloudinary / Resend optional
 */
export function assertEnv(): void {
  if (shouldSkipValidation()) return;

  // Ensure schemas parse (blank optional values are treated as unset).
  getEnv();
  getPublicEnv();

  const envSource = process.env as Record<string, string | undefined>;

  const missingCore = [
    ...collectMissing(CORE_REQUIRED_SERVER, envSource),
    ...collectMissing(CORE_REQUIRED_PUBLIC, envSource),
  ];

  const missingProductionOnly = isProductionRuntime()
    ? [
        ...collectMissing(PRODUCTION_ONLY_REQUIRED_SERVER, envSource),
        ...collectMissing(PRODUCTION_ONLY_REQUIRED_PUBLIC, envSource),
        ...(!envSource.NEXT_PUBLIC_APP_URL?.trim() &&
        !envSource.NEXT_PUBLIC_SITE_URL?.trim()
          ? (["NEXT_PUBLIC_APP_URL|NEXT_PUBLIC_SITE_URL"] as const)
          : []),
      ]
    : [];

  const critical = [...missingCore, ...missingProductionOnly];

  if (isProductionRuntime()) {
    const recommended = collectMissing(PRODUCTION_RECOMMENDED, envSource);
    if (recommended.length) {
      console.warn(
        `[env] Recommended for production (missing): ${recommended.join(", ")}`,
      );
    }
  }

  if (!critical.length) return;

  const message = `[env] Missing required variables: ${critical.join(", ")}`;

  // Throw for missing core always (except build phase), and for
  // production-only vars only in production runtime.
  if (!isBuildPhase()) {
    throw new Error(message);
  }

  console.warn(message);
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function isCloudinaryConfiguredEnv() {
  return Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}
