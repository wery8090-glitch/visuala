"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import type { AuthUser } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/loader", key: "loader.nav.home", icon: "⌂" },
  { href: "/loader/versions", key: "loader.nav.versions", icon: "◈" },
  { href: "/loader/downloads", key: "loader.nav.downloads", icon: "↓" },
  { href: "/loader/subscription", key: "loader.nav.subscription", icon: "◉" },
  { href: "/loader/profile", key: "loader.nav.profile", icon: "◌" },
  { href: "/loader/settings", key: "loader.nav.settings", icon: "⚙" },
];

export function LoaderSidebar({ user }: { user: AuthUser }) {
  const canAdmin = user.role === "ADMIN" || user.role === "OWNER";
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="flex h-full w-[220px] flex-col rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
      <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-semibold tracking-[0.2em] text-lime-300">
        CHROMA
      </div>

      <nav className="space-y-2">
        {[...NAV_ITEMS, ...(canAdmin ? [{ href: "/admin", key: "nav.admin", icon: "♛" }] : [])].map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition active:scale-[0.99] ${
                active
                  ? "border-lime-400/40 bg-lime-400/15 text-lime-200"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              <span className="text-xs opacity-90">{item.icon}</span>
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      <Link href="/loader/profile" className="mt-auto block rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition hover:border-zinc-700 hover:bg-zinc-800">
        <p className="text-sm font-semibold text-zinc-100">{user.username}</p>
        <p className="mt-1 text-xs text-zinc-400">UID: {user.id.slice(0, 8)}</p>
        <p className="mt-1 text-xs text-lime-300">{user.subscription.plan.replace("_", "+")}</p>
      </Link>
    </aside>
  );
}
