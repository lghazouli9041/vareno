"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { siteConfig } from "@/config/site";

export type AdminSettings = {
  storeName: string;
  legalName: string;
  supportEmail: string;
  phone: string;
  brandTagline: string;
  shippingThreshold: number;
  standardDays: string;
  expressDays: string;
  taxRate: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

interface AdminSettingsStore extends AdminSettings {
  ensureSeeded: () => void;
  update: (partial: Partial<AdminSettings>) => void;
}

const defaults: AdminSettings = {
  storeName: siteConfig.name,
  legalName: siteConfig.legalName,
  supportEmail: siteConfig.supportEmail,
  phone: siteConfig.phone,
  brandTagline: siteConfig.tagline,
  shippingThreshold: siteConfig.shipping.freeThreshold,
  standardDays: siteConfig.shipping.standardDays,
  expressDays: siteConfig.shipping.expressDays,
  taxRate: 8,
  street: siteConfig.address.street,
  city: siteConfig.address.city,
  state: siteConfig.address.state,
  zip: siteConfig.address.zip,
  country: siteConfig.address.country,
};

export const useAdminSettingsStore = create<AdminSettingsStore>()(
  persist(
    (set, get) => ({
      ...defaults,
      ensureSeeded: () => {
        if (!get().storeName) set(defaults);
      },
      update: (partial) => set(partial),
    }),
    { name: "hajamed-admin-settings" },
  ),
);
