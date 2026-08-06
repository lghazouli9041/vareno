"use client";

import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { useAdminSettingsStore } from "@/store/admin-settings";

function SettingsFormComponent() {
  const settings = useAdminSettingsStore();
  const update = useAdminSettingsStore((s) => s.update);
  const ensureSeeded = useAdminSettingsStore((s) => s.ensureSeeded);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Store information, brand, email, shipping, and taxes."
      />

      <div className="space-y-6">
        <section className="border border-border p-5 md:p-7">
          <h2 className="font-display text-2xl">Store information</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field
              label="Store name"
              value={settings.storeName}
              onChange={(value) => update({ storeName: value })}
            />
            <Field
              label="Legal name"
              value={settings.legalName}
              onChange={(value) => update({ legalName: value })}
            />
            <Field
              label="Phone"
              value={settings.phone}
              onChange={(value) => update({ phone: value })}
            />
            <Field
              label="Support email"
              value={settings.supportEmail}
              onChange={(value) => update({ supportEmail: value })}
            />
          </div>
        </section>

        <section className="border border-border p-5 md:p-7">
          <h2 className="font-display text-2xl">Brand</h2>
          <div className="mt-4 grid gap-4">
            <Field
              label="Tagline"
              value={settings.brandTagline}
              onChange={(value) => update({ brandTagline: value })}
            />
          </div>
        </section>

        <section className="border border-border p-5 md:p-7">
          <h2 className="font-display text-2xl">Address</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field
              label="Street"
              value={settings.street}
              onChange={(value) => update({ street: value })}
              className="md:col-span-2"
            />
            <Field
              label="City"
              value={settings.city}
              onChange={(value) => update({ city: value })}
            />
            <Field
              label="State"
              value={settings.state}
              onChange={(value) => update({ state: value })}
            />
            <Field
              label="ZIP"
              value={settings.zip}
              onChange={(value) => update({ zip: value })}
            />
            <Field
              label="Country"
              value={settings.country}
              onChange={(value) => update({ country: value })}
            />
          </div>
        </section>

        <section className="border border-border p-5 md:p-7">
          <h2 className="font-display text-2xl">Shipping & taxes</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field
              label="Free shipping threshold"
              value={String(settings.shippingThreshold)}
              onChange={(value) =>
                update({ shippingThreshold: Number(value) || 0 })
              }
              type="number"
            />
            <Field
              label="Tax rate (%)"
              value={String(settings.taxRate)}
              onChange={(value) => update({ taxRate: Number(value) || 0 })}
              type="number"
            />
            <Field
              label="Standard delivery"
              value={settings.standardDays}
              onChange={(value) => update({ standardDays: value })}
            />
            <Field
              label="Express delivery"
              value={settings.expressDays}
              onChange={(value) => update({ expressDays: value })}
            />
          </div>
        </section>

        <Button
          type="button"
          variant="gold"
          size="sm"
          onClick={() => {
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
          }}
        >
          Save settings
        </Button>
        {saved && (
          <p className="text-sm text-muted" role="status">
            Settings saved locally.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border bg-secondary/30 px-3 py-2.5 outline-none focus:border-primary"
      />
    </label>
  );
}

export const SettingsForm = memo(SettingsFormComponent);
