import { cookies } from "next/headers";
import type { Lang } from "@/lib/types";

export const LANG_COOKIE = "chroma_lang";

export async function getLangFromCookies(): Promise<Lang> {
  const cookieStore = await cookies();
  const lang = cookieStore.get(LANG_COOKIE)?.value;
  return lang === "en" ? "en" : "ru";
}

export function normalizeLang(value: unknown): Lang {
  return value === "en" ? "en" : "ru";
}
