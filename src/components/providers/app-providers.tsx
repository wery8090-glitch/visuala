"use client";

import { I18nProvider } from "@/lib/i18n/provider";
import { ToastProvider } from "@/components/ui/toast";
import type { Lang } from "@/lib/types";

export function AppProviders({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  return (
    <I18nProvider initialLang={initialLang}>
      <ToastProvider>{children}</ToastProvider>
    </I18nProvider>
  );
}
