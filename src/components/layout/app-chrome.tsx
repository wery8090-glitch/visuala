"use client";

import { usePathname } from "next/navigation";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import type { AuthUser, Lang } from "@/lib/types";

export function AppChrome({
  user,
  lang,
  children,
}: {
  user: AuthUser | null;
  lang: Lang;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoader = pathname.startsWith("/loader");
  const isAuth = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  if (isLoader || isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteNavbar user={user} />
      <main>{children}</main>
      <SiteFooter lang={lang} />
    </>
  );
}
