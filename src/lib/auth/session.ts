import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session.userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

export function getPrimaryEmail(
  user: Awaited<ReturnType<typeof currentUser>>,
): string | null {
  if (!user) return null;
  return (
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses[0]?.emailAddress ||
    null
  );
}

/** Ensure a Prisma Customer row exists for the signed-in Clerk user. */
export async function syncCustomerFromClerk(
  user: NonNullable<Awaited<ReturnType<typeof currentUser>>>,
) {
  const email = getPrimaryEmail(user);
  if (!email) return null;

  return prisma.customer.upsert({
    where: { email },
    create: {
      email,
      clerkUserId: user.id,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      phone: user.phoneNumbers[0]?.phoneNumber ?? undefined,
    },
    update: {
      clerkUserId: user.id,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      phone: user.phoneNumbers[0]?.phoneNumber ?? undefined,
    },
  });
}

/** Ensure a Prisma User row exists for wishlist / reviews / admin (Clerk-backed). */
export async function syncUserFromClerk(
  user: NonNullable<Awaited<ReturnType<typeof currentUser>>>,
) {
  const { upsertClerkUser } = await import("@/lib/auth/upsert-clerk-user");
  return upsertClerkUser(user);
}
