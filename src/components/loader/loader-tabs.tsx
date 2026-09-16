"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";

const items = [
  { href: "/loader", key: "loader.nav.home" },
  { href: "/loader/versions", key: "loader.nav.versions" },
  { href: "/loader/downloads", key: "loader.nav.downloads" },
  { href: "/loader/subscription", key: "loader.nav.subscription" },
  { href: "/loader/profile", key: "loader.nav.profile" },
  { href: "/loader/settings", key: "loader.nav.settings" },
];

export function LoaderTabs() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto xl:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg border px-3 py-2 text-xs transition ${
              active
                ? "border-lime-400/50 bg-lime-400/15 text-lime-200"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </div>
  );
}
