import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ManagedAddress = {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  source?: "local" | "order";
};

type AddressInput = Omit<ManagedAddress, "id" | "isDefault" | "source"> & {
  id?: string;
  isDefault?: boolean;
};

interface AddressBookStore {
  addresses: ManagedAddress[];
  seeded: boolean;
  seedFromServer: (addresses: ManagedAddress[]) => void;
  add: (input: AddressInput) => void;
  update: (id: string, input: AddressInput) => void;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
}

function withSingleDefault(
  addresses: ManagedAddress[],
  defaultId?: string,
): ManagedAddress[] {
  if (!addresses.length) return addresses;
  const target =
    defaultId ??
    addresses.find((item) => item.isDefault)?.id ??
    addresses[0]?.id;
  return addresses.map((item) => ({
    ...item,
    isDefault: item.id === target,
  }));
}

export const useAddressBookStore = create<AddressBookStore>()(
  persist(
    (set, get) => ({
      addresses: [],
      seeded: false,

      seedFromServer: (serverAddresses) => {
        const { seeded, addresses } = get();
        if (seeded || addresses.length > 0) {
          set({ seeded: true });
          return;
        }
        if (!serverAddresses.length) {
          set({ seeded: true });
          return;
        }
        set({
          seeded: true,
          addresses: withSingleDefault(
            serverAddresses.map((item) => ({ ...item, source: "order" })),
          ),
        });
      },

      add: (input) => {
        const id =
          input.id ??
          (typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `addr-${Date.now()}`);
        set((state) => {
          const next: ManagedAddress = {
            ...input,
            id,
            isDefault: input.isDefault || state.addresses.length === 0,
            source: "local",
          };
          return {
            addresses: withSingleDefault(
              [...state.addresses, next],
              next.isDefault ? next.id : undefined,
            ),
          };
        });
      },

      update: (id, input) => {
        set((state) => {
          const addresses = state.addresses.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...input,
                  id,
                  source: item.source ?? "local",
                }
              : item,
          );
          return {
            addresses: withSingleDefault(
              addresses,
              input.isDefault ? id : undefined,
            ),
          };
        });
      },

      remove: (id) => {
        set((state) => {
          const addresses = state.addresses.filter((item) => item.id !== id);
          return { addresses: withSingleDefault(addresses) };
        });
      },

      setDefault: (id) => {
        set((state) => ({
          addresses: withSingleDefault(state.addresses, id),
        }));
      },
    }),
    {
      name: "hajamed-address-book",
      partialize: (state) => ({
        addresses: state.addresses,
        seeded: state.seeded,
      }),
    },
  ),
);
