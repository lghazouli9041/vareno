"use client";

import { memo } from "react";
import { useNotificationPreferencesStore } from "@/store/account-notifications";

const rows: Array<{
  key:
    | "orderUpdates"
    | "shippingUpdates"
    | "productLaunches"
    | "designInspiration"
    | "smsUpdates";
  label: string;
  description: string;
  badge?: string;
}> = [
  {
    key: "orderUpdates",
    label: "Order confirmations",
    description: "Email receipts and order status changes.",
  },
  {
    key: "shippingUpdates",
    label: "Shipping updates",
    description: "Dispatch and delivery notifications by email.",
  },
  {
    key: "productLaunches",
    label: "New collections",
    description: "Be first to see limited finishes and releases.",
  },
  {
    key: "designInspiration",
    label: "Design inspiration",
    description: "Curated interiors and specification notes.",
  },
  {
    key: "smsUpdates",
    label: "SMS updates",
    description: "Text messages for shipping milestones.",
    badge: "Placeholder",
  },
];

function NotificationsPanelComponent() {
  const prefs = useNotificationPreferencesStore();
  const setPreference = useNotificationPreferencesStore((s) => s.setPreference);

  return (
    <div className="border border-border bg-background">
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li
            key={row.key}
            className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl text-primary">{row.label}</h2>
                {row.badge && (
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                    {row.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">{row.description}</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-primary">
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
                {prefs[row.key] ? "On" : "Off"}
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--color-accent,#C9A14A)]"
                checked={prefs[row.key]}
                disabled={row.key === "smsUpdates"}
                onChange={(event) =>
                  setPreference(row.key, event.target.checked)
                }
              />
            </label>
          </li>
        ))}
      </ul>
      <p className="border-t border-border px-5 py-4 text-xs text-muted md:px-7">
        Email preferences are saved on this device. SMS remains a placeholder
        until carrier messaging is enabled.
      </p>
    </div>
  );
}

export const NotificationsPanel = memo(NotificationsPanelComponent);
