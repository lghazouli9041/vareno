"use client";

import { memo } from "react";
import { KeyRound, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";

function SecurityPanelComponent() {
  return (
    <div className="space-y-5">
      <section className="border border-border bg-background p-5 md:p-7">
        <div className="flex items-start gap-3">
          <KeyRound size={18} strokeWidth={1.5} className="mt-1 text-accent" />
          <div className="flex-1">
            <h2 className="font-display text-2xl text-primary">Password</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Password management is handled by your secure authentication
              provider. A self-serve reset experience will appear here.
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-5" disabled>
              Update password
            </Button>
            <p className="mt-2 text-xs text-muted">Placeholder</p>
          </div>
        </div>
      </section>

      <section className="border border-border bg-background p-5 md:p-7">
        <div className="flex items-start gap-3">
          <Smartphone size={18} strokeWidth={1.5} className="mt-1 text-accent" />
          <div className="flex-1">
            <h2 className="font-display text-2xl text-primary">
              Two-factor authentication
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Add an authenticator app or SMS challenge for elevated account
              protection.
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-5" disabled>
              Enable 2FA
            </Button>
            <p className="mt-2 text-xs text-muted">Placeholder</p>
          </div>
        </div>
      </section>

      <section className="border border-border bg-background p-5 md:p-7">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} strokeWidth={1.5} className="mt-1 text-accent" />
          <div className="flex-1">
            <h2 className="font-display text-2xl text-primary">Recent sessions</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Review devices currently signed in to your VARENO account.
            </p>
            <ul className="mt-5 divide-y divide-border border border-border">
              <li className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="text-primary">This device</span>
                <span className="text-muted">Active now</span>
              </li>
              <li className="px-4 py-3 text-sm text-muted">
                Additional session history — placeholder
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export const SecurityPanel = memo(SecurityPanelComponent);
