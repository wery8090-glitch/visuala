"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";

const items = [
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/profile", key: "nav.profile" },
  { href: "/settings", key: "nav.settings" },
  { href: "/pricing", key: "nav.pricing" },
  { href: "/versions", key: "nav.versions" },
  { href: "/admin", key: "nav.admin", admin: true },
];

export function DashboardSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 md:w-64">
      <nav className="space-y-1">
        {items.map((item) => {
          if (item.admin && !isAdmin) return null;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition ${pathname === item.href ? "bg-zinc-800 text-lime-300" : "text-zinc-300 hover:bg-zinc-900"}`}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
