import type { Metadata } from "next";
import { ClerkSignUp } from "@/components/auth/ClerkSignUp";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/25 px-6 pt-28 pb-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
            Account
          </p>
          <h1 className="mt-3 font-display text-4xl text-primary">Sign Up</h1>
          <p className="mt-3 text-sm text-muted">
            Create your account to track orders and saved addresses.
          </p>
        </div>
        <ClerkSignUp />
      </div>
    </div>
  );
}
