"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderAuthProps {
  inverted?: boolean;
}

export function HeaderAuth({ inverted = false }: HeaderAuthProps) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className={cn(
          "inline-flex p-2 transition-colors duration-300",
          inverted
            ? "text-inverse-text hover:text-accent"
            : "text-primary hover:text-accent",
        )}
        aria-label="Sign in"
      >
        <User size={20} strokeWidth={1.5} />
      </Link>
    );
  }

  return (
    <div className="inline-flex items-center px-1">
      <UserButton
        userProfileMode="navigation"
        userProfileUrl="/account/profile"
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
            userButtonPopoverCard: "shadow-md border border-border",
          },
        }}
        customMenuItems={[
          { label: "Account", href: "/account" },
          { label: "Orders", href: "/account/orders" },
        ]}
      />
    </div>
  );
}
