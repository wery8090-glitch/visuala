import { AccountShell } from "@/components/layout/account-shell";
import { Card } from "@/components/ui/card";
import { ProfileActions } from "@/components/profile/profile-actions";
import { formatDate } from "@/lib/format";
import { getTranslation } from "@/lib/i18n/translations";
import { getLangFromCookies } from "@/lib/lang";
import { requireUser } from "@/lib/guards";

export default async function ProfilePage() {
  const user = await requireUser();
  const lang = await getLangFromCookies();
  const t = (key: string) => getTranslation(lang, key);

  return (
    <AccountShell user={user}>
      <Card>
        <h1 className="text-2xl font-semibold">{t("profile.title")}</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Card>
            <p className="text-sm text-zinc-400">{t("profile.avatar")}</p>
            <div className="mt-3 flex size-14 items-center justify-center rounded-full bg-zinc-800 text-lg font-semibold text-lime-300">
              {user.username.slice(0, 1).toUpperCase()}
            </div>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("profile.username")}</p>
            <p className="mt-1 text-zinc-100">{user.username}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("profile.email")}</p>
            <p className="mt-1 text-zinc-100">{user.email}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("common.role")}</p>
            <p className="mt-1 text-zinc-100">{user.role}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("common.subscription")}</p>
            <p className="mt-1 text-lime-300">{user.subscription.plan.replace("_", "+")}</p>
          </Card>
          <Card>
            <p className="text-sm text-zinc-400">{t("profile.expiration")}</p>
            <p className="mt-1 text-zinc-100">{formatDate(user.subscription.expiresAt, lang)}</p>
          </Card>
          <Card className="md:col-span-2">
            <p className="text-sm text-zinc-400">{t("profile.accountCreated")}</p>
            <p className="mt-1 text-zinc-100">{formatDate(user.createdAt, lang)}</p>
          </Card>
        </div>
        <ProfileActions />
      </Card>
    </AccountShell>
  );
}
