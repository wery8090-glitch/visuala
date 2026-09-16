import { AccountShell } from "@/components/layout/account-shell";
import AdminPanel from "@/components/admin/admin-panel";
import { requireAdminUser } from "@/lib/guards";

export default async function AdminPage() {
  const user = await requireAdminUser();
  return (
    <AccountShell user={user}>
      <AdminPanel user={user} />
    </AccountShell>
  );
}
