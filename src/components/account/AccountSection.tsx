"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

interface AccountSectionProps {
  title: string;
  description?: string;
  eyebrow?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AccountSection({
  title,
  description,
  eyebrow = "Account",
  children,
  actions,
}: AccountSectionProps) {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 md:mb-10">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl text-primary md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          <SignOutButton>
            <Button type="button" variant="outline" size="sm">
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
      {children}
    </div>
  );
}
