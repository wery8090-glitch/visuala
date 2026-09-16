import { LoaderTabs } from "@/components/loader/loader-tabs";
import { VersionsPanel } from "@/components/loader/versions-panel";
import { getLangFromCookies } from "@/lib/lang";
import { getTranslation } from "@/lib/i18n/translations";
import { requireUser } from "@/lib/guards";

export default async function LoaderVersionsPage() {
  const user = await requireUser();
  const lang = await getLangFromCookies();
  const t = (key: string) => getTranslation(lang, key);

  return (
    <div>
      <LoaderTabs />
      <h2 className="mb-4 text-xl font-semibold">{t("loader.nav.versions")}</h2>
      <VersionsPanel plan={user.subscription.plan} />
    </div>
  );
}
