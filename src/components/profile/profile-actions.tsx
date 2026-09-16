"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

export function ProfileActions() {
  const { t } = useI18n();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <Link href="/settings">
        <Button variant="secondary">{t("profile.editProfile")}</Button>
      </Link>
      <Button onClick={() => void logout()}>{t("nav.logout")}</Button>
    </div>
  );
}
