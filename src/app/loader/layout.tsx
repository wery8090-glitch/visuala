import { LoaderProvider } from "@/components/loader/loader-provider";
import { LoaderShell } from "@/components/loader/loader-shell";
import { requireUser } from "@/lib/guards";
import { VersionService } from "@/services/version-service";

export default async function LoaderLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const defaultTier = VersionService.getDefaultTier(user.subscription.plan);
  const defaultVersionId = VersionService.getDefaultVersionId(user.subscription.plan);

  return (
    <LoaderProvider defaultTier={defaultTier} defaultVersionId={defaultVersionId}>
      <LoaderShell user={user}>{children}</LoaderShell>
    </LoaderProvider>
  );
}
