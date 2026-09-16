import { getTranslation } from "@/lib/i18n/translations";
import type { Lang } from "@/lib/types";

export function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t border-zinc-800 py-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 text-sm text-zinc-400">
        <span>{getTranslation(lang, "brand")}</span>
        <span>{getTranslation(lang, "landing.footer")}</span>
      </div>
    </footer>
  );
}
