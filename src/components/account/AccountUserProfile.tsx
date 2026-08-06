"use client";

import { UserProfile } from "@clerk/nextjs";

export function AccountUserProfile() {
  return (
    <UserProfile
      routing="hash"
      appearance={{
        elements: {
          rootBox: "w-full",
          cardBox: "w-full shadow-none",
          navbar: "border-r border-border",
        },
      }}
    />
  );
}
