import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AccountPreferences = {
  phone: string;
  language: "en" | "fr" | "es";
};

interface PreferencesStore extends AccountPreferences {
  setPhone: (phone: string) => void;
  setLanguage: (language: AccountPreferences["language"]) => void;
  hydrate: (partial: Partial<AccountPreferences>) => void;
}

export const useAccountPreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      phone: "",
      language: "en",
      setPhone: (phone) => set({ phone }),
      setLanguage: (language) => set({ language }),
      hydrate: (partial) => set((state) => ({ ...state, ...partial })),
    }),
    { name: "hajamed-account-preferences" },
  ),
);
