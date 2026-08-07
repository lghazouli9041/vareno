"use client";

import { useState, type FormEvent } from "react";
import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/layout/Container";
import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("success");
    setEmail("");
  };

  return (
    <footer className="relative bg-inverse text-inverse-text">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/55 to-transparent"
        aria-hidden="true"
      />

      <Container className="py-20 md:py-24">
        <div className="grid grid-cols-1 gap-14 border-b border-inverse-text/10 pb-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.32em] text-accent">
              Private List
            </p>
            <h2 className="mt-4 font-display text-3xl text-inverse-text md:text-4xl">
              Join the VARENO Collection
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-inverse-text/50">
              Early access to new brass pieces, atelier notes, and invitations
              reserved for collectors.
            </p>
            <form
              onSubmit={onSubmit}
              className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "success") setStatus("idle");
                }}
                placeholder="Your email"
                className="min-h-12 flex-1 border border-inverse-text/20 bg-transparent px-4 text-sm text-inverse-text placeholder:text-inverse-text/35 focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-12 bg-accent px-7 text-[10px] font-medium uppercase tracking-[0.24em] text-primary transition-colors hover:bg-accent-hover"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 min-h-5 text-xs text-inverse-text/40" role="status">
              {status === "success"
                ? "Welcome to the collection."
                : "Considered correspondence only."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-3">
            <div>
              <h3 className="mb-5 text-[10px] uppercase tracking-[0.28em] text-accent">
                Categories
              </h3>
              <ul className="space-y-3.5">
                {footerNavigation.shop.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-inverse-text/55 transition-colors duration-300 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-[10px] uppercase tracking-[0.28em] text-accent">
                Maison
              </h3>
              <ul className="space-y-3.5">
                {footerNavigation.company.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-inverse-text/55 transition-colors duration-300 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-5 text-[10px] uppercase tracking-[0.28em] text-accent">
                Contact
              </h3>
              <ul className="space-y-3.5 text-sm text-inverse-text/55">
                <li>
                  <a
                    href={`mailto:${siteConfig.supportEmail}`}
                    className="transition-colors hover:text-accent"
                  >
                    {siteConfig.supportEmail}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                    className="transition-colors hover:text-accent"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
                <li className="leading-relaxed">
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.city}, {siteConfig.address.state}{" "}
                  {siteConfig.address.zip}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-inverse-text/45">
              Handcrafted solid brass fixtures for extraordinary European-minded
              homes.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-inverse-text/45 transition-colors duration-300 hover:text-accent"
              aria-label="Instagram"
            >
              <Instagram size={18} strokeWidth={1.35} />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-inverse-text/45 transition-colors duration-300 hover:text-accent"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} strokeWidth={1.35} />
            </a>
            <a
              href={siteConfig.social.pinterest}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.22em] text-inverse-text/45 transition-colors duration-300 hover:text-accent"
              aria-label="Pinterest"
            >
              Pin
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-inverse-text/10 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-inverse-text/35">
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.2em] text-inverse-text/35">
            {footerNavigation.support.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
