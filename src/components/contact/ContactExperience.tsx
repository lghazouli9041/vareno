"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { siteConfig } from "@/config/site";
import { motion as motionTokens } from "@/constants/design";
import { getWhatsAppUrl } from "@/lib/utils";

const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 6:00 PM ET" },
  { day: "Saturday", time: "10:00 AM – 4:00 PM ET" },
  { day: "Sunday", time: "By appointment" },
];

export function ContactExperience() {
  const reduceMotion = useReducedMotion();
  const ease = motionTokens.easeLuxury;
  const whatsappUrl = getWhatsAppUrl(
    "Hello VARENO — I would like guidance on a brass fixture for my project.",
  );

  return (
    <>
      <section className="relative flex min-h-[55vh] items-end overflow-hidden pb-14 pt-36 md:min-h-[60vh] md:pb-20">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2200&q=90"
          alt="VARENO showroom atmosphere"
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-primary/25"
          aria-hidden="true"
        />
        <Container className="relative z-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1, ease }}
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
              Concierge
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl text-inverse-text md:text-6xl">
              An appointment with the atelier.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-[1.9] text-inverse-text/75 md:text-base">
              Finish guidance, project specification, and white-glove support—
              whether you are furnishing a powder room or an entire residence.
            </p>
          </motion.div>
        </Container>
      </section>

      <Section tone="default" aria-labelledby="showroom-heading">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.85, ease }}
            className="space-y-10"
          >
            <div>
              <h2
                id="showroom-heading"
                className="font-display text-3xl text-primary md:text-4xl"
              >
                Showroom
              </h2>
              <div className="gold-line mt-6" aria-hidden="true" />
              <p className="mt-6 flex gap-3 text-sm leading-relaxed text-muted">
                <MapPin
                  size={18}
                  strokeWidth={1.4}
                  className="mt-0.5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.city}, {siteConfig.address.state}{" "}
                  {siteConfig.address.zip}
                  <br />
                  {siteConfig.address.country}
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-[10px] uppercase tracking-[0.28em] text-accent">
                Hours
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {hours.map((row) => (
                  <li
                    key={row.day}
                    className="flex justify-between gap-4 border-b border-border/70 py-2.5"
                  >
                    <span>{row.day}</span>
                    <span className="text-primary">{row.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="space-y-5">
              <li>
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="group flex items-start gap-3 text-sm transition-colors hover:text-accent"
                >
                  <Mail
                    size={18}
                    strokeWidth={1.4}
                    className="mt-0.5 text-accent"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-muted">
                      Email
                    </span>
                    <span className="text-primary group-hover:text-accent">
                      {siteConfig.supportEmail}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                  className="group flex items-start gap-3 text-sm transition-colors hover:text-accent"
                >
                  <Phone
                    size={18}
                    strokeWidth={1.4}
                    className="mt-0.5 text-accent"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-muted">
                      Phone
                    </span>
                    <span className="text-primary group-hover:text-accent">
                      {siteConfig.phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm transition-colors hover:text-accent"
                >
                  <MessageCircle
                    size={18}
                    strokeWidth={1.4}
                    className="mt-0.5 text-accent"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-muted">
                      WhatsApp
                    </span>
                    <span className="text-primary group-hover:text-accent">
                      Message the concierge
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </motion.aside>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.08, ease }}
            className="border border-border/80 bg-background px-6 py-8 md:px-8 md:py-10"
          >
            <h2 className="font-display text-3xl text-primary">
              Send a message
            </h2>
            <p className="mt-3 text-sm text-muted">
              Tell us about your project—we respond with clarity and finish
              guidance.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
