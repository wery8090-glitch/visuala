"use client";

import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

export function LoaderHeader({
  username,
  uid,
  plan,
}: {
  username: string;
  uid: string;
  plan: string;
}) {
  const { t, lang, setLang } = useI18n();
  const router = useRouter();

  const logout = async () => {
    await AuthService.logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
          CHROMA
        </div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
          {username}
        </div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
          UID: {uid.slice(0, 8)}
        </div>
        <div className="rounded-lg border border-lime-400/30 bg-lime-500/10 px-3 py-2 text-xs text-lime-300">
          {t("loader.plan")}: {plan.replace("_", "+")}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
          ● {t("loader.connected")}
        </div>
        <select
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-100"
          value={lang}
          onChange={(e) => void setLang(e.target.value as "en" | "ru")}
        >
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
        <Button variant="secondary" onClick={() => void logout()}>
          {t("nav.logout")}
        </Button>
      </div>
    </div>
  );
}
