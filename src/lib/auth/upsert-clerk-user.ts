import { getPrimaryEmail } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import type { currentUser } from "@clerk/nextjs/server";

function shouldGrantAdmin(
  user: NonNullable<Awaited<ReturnType<typeof currentUser>>>,
  email: string,
): boolean {
  const role = user.publicMetadata?.role;
  if (role === "admin" || role === "ADMIN") return true;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

/** Shared upsert used by session sync — preserves ADMIN, upgrades via Clerk/env. */
export async function upsertClerkUser(
  user: NonNullable<Awaited<ReturnType<typeof currentUser>>>,
) {
  const email = getPrimaryEmail(user);
  if (!email) return null;

  const grantAdmin = shouldGrantAdmin(user, email);

  return prisma.user.upsert({
    where: { email },
    create: {
      email,
      firstName: user.firstName ?? "VARENO",
      lastName: user.lastName ?? "Member",
      phone: user.phoneNumbers[0]?.phoneNumber ?? undefined,
      role: grantAdmin ? "ADMIN" : "CUSTOMER",
    },
    update: {
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      phone: user.phoneNumbers[0]?.phoneNumber ?? undefined,
      ...(grantAdmin ? { role: "ADMIN" as const } : {}),
    },
  });
}
