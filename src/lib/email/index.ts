import { siteConfig } from "@/config/site";

export type OrderEmailPayload = {
  orderNumber: string;
  email: string;
  total: string;
  currency: string;
  items: Array<{ name: string; quantity: number; finish: string }>;
};

type EmailResult = {
  ok: boolean;
  id?: string;
  skipped?: boolean;
  error?: string;
};

async function sendViaResend(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[email:skipped]", input.subject, input.to);
    return { ok: true, skipped: true };
  }

  const from =
    process.env.EMAIL_FROM ??
    `VARENO <orders@${new URL(siteConfig.url).hostname}>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    });

    const data = (await response.json()) as { id?: string; message?: string };
    if (!response.ok) {
      return { ok: false, error: data.message ?? `HTTP ${response.status}` };
    }
    return { ok: true, id: data.id };
  } catch (error) {
    console.error("Email send failed:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Email failed",
    };
  }
}

export async function sendOrderConfirmationEmail(
  payload: OrderEmailPayload,
): Promise<EmailResult> {
  const html = `
    <div style="font-family:Georgia,serif;color:#111;max-width:560px;margin:0 auto">
      <p style="letter-spacing:.2em;text-transform:uppercase;font-size:11px;color:#C9A14A">VARENO</p>
      <h1 style="font-weight:400;font-size:28px">Order confirmed</h1>
      <p>Thank you. Your order <strong>${payload.orderNumber}</strong> has been received.</p>
      <p>Total: <strong>${payload.total} ${payload.currency}</strong></p>
      <ul>
        ${payload.items
          .map(
            (item) =>
              `<li>${item.name} · ${item.finish} × ${item.quantity}</li>`,
          )
          .join("")}
      </ul>
      <p style="color:#777;font-size:13px">A shipping confirmation will follow when your order dispatches.</p>
    </div>
  `;

  return sendViaResend({
    to: payload.email,
    subject: `Order ${payload.orderNumber} confirmed · VARENO`,
    html,
  });
}

export async function sendShippingConfirmationEmail(payload: {
  email: string;
  orderNumber: string;
  trackingPlaceholder?: string;
}): Promise<EmailResult> {
  return sendViaResend({
    to: payload.email,
    subject: `Your VARENO order ${payload.orderNumber} has shipped`,
    html: `<p>Order <strong>${payload.orderNumber}</strong> is on its way.</p>
      <p>Tracking: ${payload.trackingPlaceholder ?? "Provided by carrier shortly."}</p>`,
  });
}

export async function sendAdminOrderNotification(payload: {
  orderNumber: string;
  email: string;
  total: string;
}): Promise<EmailResult> {
  const adminTo =
    process.env.ADMIN_NOTIFICATION_EMAIL ?? siteConfig.supportEmail;
  return sendViaResend({
    to: adminTo,
    subject: `New order ${payload.orderNumber}`,
    html: `<p>New paid order <strong>${payload.orderNumber}</strong> from ${payload.email} · ${payload.total}</p>`,
  });
}

/** Password reset remains handled by Clerk — seam for future branded templates. */
export async function sendPasswordResetPlaceholder(): Promise<EmailResult> {
  return {
    ok: true,
    skipped: true,
    error: "Password reset is managed by Clerk authentication.",
  };
}
