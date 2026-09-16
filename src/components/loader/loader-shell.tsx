"use client";

import { LoaderHeader } from "@/components/loader/loader-header";
import { LoaderSidebar } from "@/components/loader/loader-sidebar";
import { useLoader } from "@/components/loader/loader-provider";
import type { AuthUser } from "@/lib/types";

export function LoaderShell({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  const { settings } = useLoader();

  const bgClass =
    settings.background === "bg1"
      ? "bg-[radial-gradient(circle_at_20%_0%,rgba(132,204,22,0.2),transparent_40%),linear-gradient(to_bottom,#0a0f18,#0e1118)]"
      : settings.background === "bg2"
        ? "bg-[radial-gradient(circle_at_80%_0%,rgba(34,197,94,0.2),transparent_40%),linear-gradient(to_bottom,#111827,#09090b)]"
        : "bg-[radial-gradient(circle_at_50%_0%,rgba(163,230,53,0.14),transparent_35%),linear-gradient(to_bottom,#0f172a,#18181b)]";

  return (
    <div className="px-3 py-4 lg:px-6">
      <div className={`relative mx-auto flex min-h-[760px] w-full max-w-[1280px] gap-3 rounded-2xl border border-zinc-800 p-3 shadow-2xl ${bgClass}`}>
        <div className="absolute inset-0 -z-10 rounded-2xl bg-black/50" />

        <div className="hidden lg:block">
          <LoaderSidebar user={user} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-zinc-800 bg-zinc-950/75 p-4">
          <LoaderHeader username={user.username} uid={user.id} plan={user.subscription.plan} />
          <div className="mt-4 min-h-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
