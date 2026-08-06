"use client";

import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAccountPreferencesStore } from "@/store/account-preferences";

interface ProfileEditorProps {
  firstName: string;
  lastName: string;
  email: string | null;
  initialPhone?: string | null;
}

function ProfileEditorComponent({
  firstName,
  lastName,
  email,
  initialPhone,
}: ProfileEditorProps) {
  const phone = useAccountPreferencesStore((s) => s.phone);
  const language = useAccountPreferencesStore((s) => s.language);
  const setPhone = useAccountPreferencesStore((s) => s.setPhone);
  const setLanguage = useAccountPreferencesStore((s) => s.setLanguage);
  const hydrate = useAccountPreferencesStore((s) => s.hydrate);

  const [draftPhone, setDraftPhone] = useState(phone);
  const [draftLanguage, setDraftLanguage] = useState(language);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!phone && initialPhone) {
      hydrate({ phone: initialPhone });
      setDraftPhone(initialPhone);
    }
  }, [hydrate, initialPhone, phone]);

  useEffect(() => {
    setDraftPhone(phone);
    setDraftLanguage(language);
  }, [language, phone]);

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join("") ||
    email?.[0]?.toUpperCase() ||
    "V";

  const displayName =
    [firstName, lastName].filter(Boolean).join(" ") || "VARENO Member";

  const onSave = () => {
    setPhone(draftPhone.trim());
    setLanguage(draftLanguage);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
      <div className="flex flex-col items-center border border-border bg-background p-6 text-center lg:items-start lg:text-left">
        <div
          className="flex h-24 w-24 items-center justify-center border border-border bg-secondary/40 font-display text-3xl text-primary"
          aria-hidden="true"
        >
          {initials}
        </div>
        <p className="mt-4 font-display text-2xl text-primary">{displayName}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
          Avatar placeholder
        </p>
      </div>

      <div className="border border-border bg-background p-5 md:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
              First name
            </span>
            <input
              value={firstName}
              readOnly
              className="w-full border border-border bg-secondary/20 px-3 py-2.5 text-primary outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
              Last name
            </span>
            <input
              value={lastName}
              readOnly
              className="w-full border border-border bg-secondary/20 px-3 py-2.5 text-primary outline-none"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
              Email
            </span>
            <input
              value={email ?? ""}
              readOnly
              className="w-full border border-border bg-secondary/20 px-3 py-2.5 text-primary outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
              Phone
            </span>
            <input
              value={draftPhone}
              onChange={(event) => setDraftPhone(event.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full border border-border bg-secondary/30 px-3 py-2.5 outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
              Preferred language
            </span>
            <select
              value={draftLanguage}
              onChange={(event) =>
                setDraftLanguage(
                  event.target.value as "en" | "fr" | "es",
                )
              }
              className="w-full border border-border bg-secondary/30 px-3 py-2.5 outline-none focus:border-primary"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </label>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-muted">
          Name and email are managed by your secure sign-in. Phone and language
          preferences are saved on this device.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="button" variant="gold" size="sm" onClick={onSave}>
            Save preferences
          </Button>
          <Button href="/account/security" variant="outline" size="sm">
            Security settings
          </Button>
          {saved && (
            <span className="text-xs text-muted" role="status">
              Preferences saved.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export const ProfileEditor = memo(ProfileEditorComponent);
