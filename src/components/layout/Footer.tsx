import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/layout/Container";
import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-inverse text-inverse-text">
      <Container className="py-20 md:py-24">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <Logo inverted />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-inverse-text/55">
              VARENO creates architectural faucets engineered for designers,
              architects and refined American homes.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-inverse-text/50 transition-colors duration-300 hover:text-accent"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-inverse-text/50 transition-colors duration-300 hover:text-accent"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <h2 className="mb-5 text-[11px] uppercase tracking-[0.22em] text-accent">
              Shop
            </h2>
            <ul className="space-y-3">
              {footerNavigation.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-inverse-text/60 transition-colors duration-300 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="mb-5 text-[11px] uppercase tracking-[0.22em] text-accent">
              Company
            </h2>
            <ul className="space-y-3">
              {footerNavigation.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-inverse-text/60 transition-colors duration-300 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="mb-5 text-[11px] uppercase tracking-[0.22em] text-accent">
              Support
            </h2>
            <ul className="space-y-3">
              {footerNavigation.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-inverse-text/60 transition-colors duration-300 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-inverse-text/10 pt-8 md:flex-row">
          <p className="text-xs text-inverse-text/40">
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <p className="text-xs text-inverse-text/40">
            {siteConfig.address.city}, {siteConfig.address.state}
          </p>
        </div>
      </Container>
    </footer>
  );
}
