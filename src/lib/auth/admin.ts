import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getPrimaryEmail,
  requireUser,
  syncUserFromClerk,
} from "@/lib/auth/session";

function clerkClaimsAdmin(
  user: NonNullable<Awaited<ReturnType<typeof currentUser>>>,
): boolean {
  const role = user.publicMetadata?.role;
  return role === "admin" || role === "ADMIN";
}

function envClaimsAdmin(email: string | null): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export async function resolveIsAdmin(
  user?: NonNullable<Awaited<ReturnType<typeof currentUser>>>,
): Promise<boolean> {
  const clerkUser = user ?? (await currentUser());
  if (!clerkUser) return false;

  if (clerkClaimsAdmin(clerkUser)) return true;

  const email = getPrimaryEmail(clerkUser);
  if (envClaimsAdmin(email)) return true;

  const dbUser = await syncUserFromClerk(clerkUser);
  return dbUser?.role === "ADMIN";
}

/** Require a signed-in Clerk user with ADMIN privileges. */
export async function requireAdmin() {
  const user = await requireUser();
  const allowed = await resolveIsAdmin(user);
  if (!allowed) {
    redirect("/account");
  }
  return user;
}

/** Soft check for server actions — returns false instead of redirecting. */
export async function assertAdminAction(): Promise<
  | { ok: true; user: NonNullable<Awaited<ReturnType<typeof currentUser>>> }
  | { ok: false; error: string }
> {
  const session = await auth();
  if (!session.userId) {
    return { ok: false, error: "Unauthorized" };
  }
  const user = await currentUser();
  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }
  const allowed = await resolveIsAdmin(user);
  if (!allowed) {
    return { ok: false, error: "Forbidden" };
  }
  return { ok: true, user };
}
