import SettingsPageClient from "@/components/settings/settings-page-client";
import { requireUser } from "@/lib/guards";

export default async function SettingsPage() {
  const user = await requireUser();
  return <SettingsPageClient user={user} />;
}
