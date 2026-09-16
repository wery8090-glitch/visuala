"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import type { AuthUser } from "@/lib/types";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/#features", key: "nav.features" },
  { href: "/versions", key: "nav.versions" },
  { href: "/pricing", key: "nav.pricing" },
  { href: "/download", key: "nav.download" },
];

export function SiteNavbar({ user }: { user: AuthUser | null }) {
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-wide text-zinc-100">
          {t("brand")}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition ${pathname === link.href ? "bg-zinc-800 text-lime-300" : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"}`}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200"
            value={lang}
            onChange={(e) => void setLang(e.target.value as "en" | "ru")}
          >
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>

          {user ? (
            <>
              <Link href="/loader">
                <Button variant="secondary" className="hidden sm:inline-flex">
                  {t("nav.dashboard")}
                </Button>
              </Link>
              <Button onClick={() => void logout()}>{t("nav.logout")}</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary">{t("nav.login")}</Button>
              </Link>
              <Link href="/register">
                <Button>{t("nav.getStarted")}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
