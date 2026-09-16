import { LoaderTabs } from "@/components/loader/loader-tabs";
import { SubscriptionPanel } from "@/components/loader/subscription-panel";
import { requireUser } from "@/lib/guards";

export default async function LoaderSubscriptionPage() {
  const user = await requireUser();

  return (
    <div>
      <LoaderTabs />
      <SubscriptionPanel user={user} />
    </div>
  );
}
