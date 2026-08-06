"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createHash } from "crypto";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  type: z.enum(["general", "trade", "support", "press"]),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
});

async function sendContactEmail(input: z.infer<typeof contactSchema>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL ?? siteConfig.supportEmail;
  const from =
    process.env.EMAIL_FROM ??
    `VARENO <concierge@${new URL(siteConfig.url).hostname}>`;

  if (!apiKey) {
    console.info("[contact:email:skipped]", input.email, input.type);
    return { sent: false as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `Contact · ${input.type} · ${input.name}`,
      html: `<p><strong>${input.name}</strong> (${input.email})</p>
        <p>Type: ${input.type}</p>
        ${input.company ? `<p>Company: ${input.company}</p>` : ""}
        <p>${input.message.replace(/\n/g, "<br/>")}</p>`,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Contact email failed:", body);
    return { sent: false as const };
  }
  return { sent: true as const };
}

export async function submitContactAction(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    type: formData.get("type"),
    company: formData.get("company") || "",
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false as const, error: "Please check your details and try again." };
  }

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 32);

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    const recent = await prisma.contactMessage.count({
      where: {
        createdAt: { gte: hourAgo },
        OR: [{ ipHash }, { email: parsed.data.email.toLowerCase() }],
      },
    });

    if (recent >= 5) {
      return {
        ok: false as const,
        error: "Too many messages. Please try again in an hour.",
      };
    }

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        type: parsed.data.type,
        company: parsed.data.company || null,
        message: parsed.data.message,
        ipHash,
      },
    });
  } catch (error) {
    console.error("Contact persistence failed:", error);
    // Still attempt email if DB is down.
  }

  await sendContactEmail(parsed.data);
  return { ok: true as const };
}
