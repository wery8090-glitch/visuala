import { DashboardView } from "@/components/loader/dashboard-view";
import { requireUser } from "@/lib/guards";

export default async function LoaderHomePage() {
  const user = await requireUser();
  return <DashboardView user={user} />;
}
