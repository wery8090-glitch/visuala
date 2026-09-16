import { LoaderTabs } from "@/components/loader/loader-tabs";
import { LoaderSettingsPanel } from "@/components/loader/settings-panel";
import { getLangFromCookies } from "@/lib/lang";
import { getTranslation } from "@/lib/i18n/translations";

export default async function LoaderSettingsPage() {
  const lang = await getLangFromCookies();
  const t = (key: string) => getTranslation(lang, key);

  return (
    <div>
      <LoaderTabs />
      <h2 className="mb-4 text-xl font-semibold">{t("loader.nav.settings")}</h2>
      <LoaderSettingsPanel />
    </div>
  );
}
