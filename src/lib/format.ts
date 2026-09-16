import type { Lang } from "@/lib/types";

export function formatDate(value: string | Date | null, lang: Lang): string {
  if (!value) return lang === "ru" ? "Не указано" : "Not set";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
