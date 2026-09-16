import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import type { AuthUser } from "@/lib/types";

export function AccountShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const isAdmin = user.role === "OWNER" || user.role === "ADMIN" || user.role === "MODERATOR";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row">
      <DashboardSidebar isAdmin={isAdmin} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
