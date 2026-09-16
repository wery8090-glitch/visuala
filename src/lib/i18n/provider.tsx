"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getTranslation } from "@/lib/i18n/translations";
import type { Lang } from "@/lib/types";

type I18nContextType = {
  lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => Promise<void>;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();

  const setLang = async (nextLang: Lang) => {
    await fetch("/api/lang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: nextLang }),
    });
    setLangState(nextLang);
    router.refresh();
  };

  const value = useMemo<I18nContextType>(
    () => ({
      lang,
      t: (key) => getTranslation(lang, key),
      setLang,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
}
