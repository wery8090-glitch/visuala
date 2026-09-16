import { redirect } from "next/navigation";
import { getCurrentUserFromCookies, hasAdminAccess } from "@/lib/auth";

export async function requireUser() {
  const user = await getCurrentUserFromCookies();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdminUser() {
  const user = await requireUser();
  if (!hasAdminAccess(user.role)) redirect("/loader");
  return user;
}
