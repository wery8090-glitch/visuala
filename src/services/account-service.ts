import type { AuthUser } from "@/lib/types";

export class AccountService {
  static async me(): Promise<AuthUser | null> {
    const res = await fetch("/api/me", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { user: AuthUser };
    return data.user;
  }
}
