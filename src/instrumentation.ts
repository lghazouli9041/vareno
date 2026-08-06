export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

  // Valider toutes les variables uniquement en production
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const { assertEnv } = await import("@/lib/env");
  assertEnv();
}