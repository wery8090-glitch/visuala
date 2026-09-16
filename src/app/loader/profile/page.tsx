import { LoaderTabs } from "@/components/loader/loader-tabs";
import { ProfilePanel } from "@/components/loader/profile-panel";
import { getLangFromCookies } from "@/lib/lang";
import { getTranslation } from "@/lib/i18n/translations";
import { requireUser } from "@/lib/guards";

export default async function LoaderProfilePage() {
  const user = await requireUser();
  const lang = await getLangFromCookies();
  const t = (key: string) => getTranslation(lang, key);

  return (
    <div>
      <LoaderTabs />
      <h2 className="mb-4 text-xl font-semibold">{t("loader.nav.profile")}</h2>
      <ProfilePanel user={user} />
    </div>
  );
}
