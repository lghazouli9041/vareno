"use client";

import { SignUp } from "@clerk/nextjs";
import { ClientOnly } from "@/components/util/ClientOnly";

/** Client-mounted Clerk SignUp — avoids SSR/client hydration mismatch. */
export function ClerkSignUp() {
  return (
    <ClientOnly fallback={<div className="min-h-[320px]" aria-hidden="true" />}>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/account"
        fallbackRedirectUrl="/account"
      />
    </ClientOnly>
  );
}
