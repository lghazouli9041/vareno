"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { submitContactAction } from "@/features/contact/actions";

type InquiryType = "general" | "trade" | "support" | "press";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await submitContactAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-border bg-background p-8 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <p className="text-[11px] uppercase tracking-[0.22em] text-accent">
          Message Received
        </p>
        <h2 className="mt-3 font-display text-3xl text-primary">
          Thank you for reaching out
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          A VARENO concierge will respond within one business day. Trade
          inquiries are prioritized during showroom hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-background p-6 shadow-sm md:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-primary"
          >
            Full name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-primary"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-type"
          className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-primary"
        >
          Inquiry type
        </label>
        <select
          id="contact-type"
          name="type"
          defaultValue={"general" satisfies InquiryType}
          className="w-full rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        >
          <option value="general">General inquiry</option>
          <option value="trade">Trade / project inquiry</option>
          <option value="support">Product support</option>
          <option value="press">Press & partnerships</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="contact-company"
          className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-primary"
        >
          Company (optional)
        </label>
        <input
          id="contact-company"
          name="company"
          autoComplete="organization"
          className="w-full rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-primary"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          className="w-full resize-y rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full sm:w-auto"
        disabled={pending}
      >
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
