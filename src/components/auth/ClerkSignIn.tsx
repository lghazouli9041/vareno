"use client";

import { SignIn } from "@clerk/nextjs";
import { ClientOnly } from "@/components/util/ClientOnly";

/** Client-mounted Clerk SignIn — avoids SSR/client hydration mismatch. */
export function ClerkSignIn() {
  return (
    <ClientOnly fallback={<div className="min-h-[320px]" aria-hidden="true" />}>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/account"
        fallbackRedirectUrl="/account"
      />
    </ClientOnly>
  );
}
