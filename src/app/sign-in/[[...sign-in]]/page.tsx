import type { Metadata } from "next";
import { ClerkSignIn } from "@/components/auth/ClerkSignIn";
import { Logo } from "@/components/layout/Logo";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/25 px-6 pt-28 pb-20">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo />
          <p className="mt-8 text-[10px] uppercase tracking-[0.24em] text-accent">
            Account
          </p>
          <h1 className="mt-3 font-display text-4xl text-primary">Sign In</h1>
          <p className="mt-3 text-sm text-muted">
            Access orders, addresses, and your profile.
          </p>
        </div>
        <ClerkSignIn />
      </div>
    </div>
  );
}
