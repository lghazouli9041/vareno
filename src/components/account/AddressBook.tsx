"use client";

import { memo, useEffect, useState } from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  deleteAddressAction,
  upsertAddressAction,
} from "@/features/commerce/actions";
import {
  useAddressBookStore,
  type ManagedAddress,
} from "@/store/address-book";

type AddressFormState = {
  firstName: string;
  lastName: string;
  company: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

const emptyForm: AddressFormState = {
  firstName: "",
  lastName: "",
  company: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
  phone: "",
  isDefault: false,
};

function toForm(address?: ManagedAddress): AddressFormState {
  if (!address) return emptyForm;
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    company: address.company ?? "",
    line1: address.line1,
    line2: address.line2 ?? "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone ?? "",
    isDefault: address.isDefault,
  };
}

interface AddressBookProps {
  serverAddresses: ManagedAddress[];
}

function AddressBookComponent({ serverAddresses }: AddressBookProps) {
  const addresses = useAddressBookStore((s) => s.addresses);
  const seedFromServer = useAddressBookStore((s) => s.seedFromServer);
  const add = useAddressBookStore((s) => s.add);
  const update = useAddressBookStore((s) => s.update);
  const remove = useAddressBookStore((s) => s.remove);
  const setDefault = useAddressBookStore((s) => s.setDefault);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<AddressFormState>(emptyForm);

  useEffect(() => {
    seedFromServer(serverAddresses);
  }, [seedFromServer, serverAddresses]);

  const openCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm({ ...emptyForm, isDefault: addresses.length === 0 });
  };

  const openEdit = (address: ManagedAddress) => {
    setCreating(false);
    setEditingId(address.id);
    setForm(toForm(address));
  };

  const closeForm = () => {
    setCreating(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.line1.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.postalCode.trim()
    ) {
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      company: form.company.trim() || undefined,
      line1: form.line1.trim(),
      line2: form.line2.trim() || undefined,
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim() || "US",
      phone: form.phone.trim() || undefined,
      isDefault: form.isDefault,
    };

    void (async () => {
      const result = await upsertAddressAction({
        id: editingId ?? undefined,
        ...payload,
      });
      if (editingId) {
        update(editingId, payload);
      } else {
        add({
          ...payload,
          id: result.ok ? result.id : undefined,
        });
      }
      closeForm();
    })();
  };

  const showForm = creating || editingId;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {addresses.length} saved{" "}
          {addresses.length === 1 ? "address" : "addresses"}
        </p>
        <Button
          type="button"
          variant="gold"
          size="sm"
          className="inline-flex items-center gap-1.5"
          onClick={openCreate}
        >
          <Plus size={14} strokeWidth={1.5} />
          Add address
        </Button>
      </div>

      {showForm && (
        <div className="mb-8 border border-border bg-background p-5 md:p-7">
          <h2 className="font-display text-2xl text-primary">
            {editingId ? "Edit address" : "New address"}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(
              [
                ["firstName", "First name"],
                ["lastName", "Last name"],
                ["company", "Company"],
                ["phone", "Phone"],
                ["line1", "Address"],
                ["line2", "Apt / suite"],
                ["city", "City"],
                ["state", "State"],
                ["postalCode", "Postal code"],
                ["country", "Country"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm sm:col-span-1">
                <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
                  {label}
                </span>
                <input
                  value={form[key]}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, [key]: event.target.value }))
                  }
                  className="w-full border border-border bg-secondary/30 px-3 py-2.5 outline-none focus:border-primary"
                />
              </label>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-primary">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  isDefault: event.target.checked,
                }))
              }
            />
            Set as default address
          </label>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="gold" size="sm" onClick={save}>
              Save address
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="border border-border bg-background px-6 py-14 text-center">
          <p className="font-display text-3xl text-primary">No addresses yet</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Add a shipping address for a faster checkout experience. Addresses
            are saved on this device.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="border border-border bg-background p-5 md:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-primary">
                    {address.firstName} {address.lastName}
                  </p>
                  {address.isDefault && (
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-accent">
                      <Star size={12} strokeWidth={1.5} />
                      Default
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {address.line1}
                {address.line2 ? (
                  <>
                    <br />
                    {address.line2}
                  </>
                ) : null}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
              </p>
              {address.phone && (
                <p className="mt-2 text-sm text-muted">{address.phone}</p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(address.id)}
                    className="text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                  >
                    Make default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(address)}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary"
                >
                  <Pencil size={12} strokeWidth={1.5} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    remove(address.id);
                    void deleteAddressAction(address.id);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-error"
                >
                  <Trash2 size={12} strokeWidth={1.5} />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const AddressBook = memo(AddressBookComponent);
