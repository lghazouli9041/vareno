import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationPreferences = {
  orderUpdates: boolean;
  shippingUpdates: boolean;
  productLaunches: boolean;
  designInspiration: boolean;
  smsUpdates: boolean;
};

interface NotificationStore extends NotificationPreferences {
  setPreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K],
  ) => void;
}

export const useNotificationPreferencesStore = create<NotificationStore>()(
  persist(
    (set) => ({
      orderUpdates: true,
      shippingUpdates: true,
      productLaunches: false,
      designInspiration: true,
      smsUpdates: false,
      setPreference: (key, value) => set({ [key]: value }),
    }),
    { name: "hajamed-notification-preferences" },
  ),
);
