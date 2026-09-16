"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";
import { AuthService } from "@/services/auth-service";
import type { AuthUser } from "@/lib/types";

export function ProfilePanel({ user }: { user: AuthUser }) {
  const { t } = useI18n();
  const router = useRouter();

  const logout = async () => {
    await AuthService.logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-zinc-800 text-2xl font-bold text-lime-300">
          {user.username.slice(0, 1).toUpperCase()}
        </div>
        <div className="grid gap-1 text-sm text-zinc-300">
          <p>{t("profile.username")}: {user.username}</p>
          <p>{t("profile.email")}: {user.email}</p>
          <p>{t("common.role")}: {user.role}</p>
          <p>{t("common.subscription")}: {user.subscription.plan.replace("_", "+")}</p>
          <p>{t("loader.expires")}: {user.subscription.expiresAt ?? "—"}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/loader/settings">
          <Button variant="secondary">{t("profile.editProfile")}</Button>
        </Link>
        <Button onClick={() => void logout()}>{t("nav.logout")}</Button>
      </div>
    </Card>
  );
}
